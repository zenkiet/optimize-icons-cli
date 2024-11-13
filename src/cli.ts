import { hideBin } from "yargs/helpers";
import { blue, red } from "colorette";
import { OptimizeIconsOptions } from "./core/types";
import yargs from "yargs";
import inquirer from "inquirer";
import IconOptimizer from "./core/icon-optimize";
import { Command } from "commander";

type PackageJson = Readonly<{
  version: string;
  description?: string;
  name?: string;
}>;

class CLI {
  private static instance: CLI | null = null;
  private readonly program: Command;
  private readonly packageJson: PackageJson;

  private constructor() {
    this.packageJson = require("../package.json");
    this.program = new Command();
    this.setupProgram();
  }

  public static getInstance(): CLI {
    if (!CLI.instance) {
      CLI.instance = new CLI();
    }
    return CLI.instance;
  }

  private printBanner(): void {
    console.log(
      blue(`
╭───────────────────────────────────────╮
│  ${this.packageJson.name} v${this.packageJson.version}
│  ${this.packageJson.description || ""}
╰───────────────────────────────────────╯
        `),
    );
  }

  private setupProgram(): void {
    this.program
      .name(this.packageJson.name || "optimize-icons")
      .description(this.packageJson.description || "Icon optimization tool")
      .version(this.packageJson.version)
      .option(
        "-o, --output-path <path>",
        "Output path containing the built files",
      )
      .option("-v, --verbose", "Show verbose output")
      .addHelpText(
        "after",
        `
Examples:
  $ optimize-icons -o dist/browser
  $ optimize-icons -o dist/browser -v`,
      );
  }

  private async promptUserInput(): Promise<OptimizeIconsOptions> {
    const answers = await inquirer.prompt<OptimizeIconsOptions>([
      {
        type: "input",
        name: "outputPath",
        message: "Enter output path:",
        default: "dist/browser",
        validate: (input) => {
          if (input.trim().length === 0) {
            return "Output path is required";
          }
          return true;
        },
      },
      {
        type: "confirm",
        name: "verbose",
        message: "Enable verbose output?",
        default: false,
      },
    ]);

    return answers;
  }

  private async handleCommand(
    options: Partial<OptimizeIconsOptions>,
  ): Promise<void> {
    const config: OptimizeIconsOptions =
      options.outputPath || options.verbose
        ? {
            outputPath: options.outputPath || "dist/browser",
            verbose: options.verbose || false,
          }
        : await this.promptUserInput();

    const optimizer = new IconOptimizer(config);
    await optimizer.optimize();
  }

  public async run(): Promise<void> {
    try {
      this.program.parse();

      const options = this.program.opts<Partial<OptimizeIconsOptions>>();

      const config: OptimizeIconsOptions =
        options.outputPath || options.verbose
          ? {
              outputPath: options.outputPath || "dist/browser",
              verbose: options.verbose || false,
            }
          : await this.promptUserInput();

      const optimizer = new IconOptimizer(config);
      await optimizer.optimize();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(red("Fatal error:"), errorMessage);
      process.exit(1);
    }
  }
}

// Run CLI
if (require.main === module) {
  (async () => {
    try {
      await CLI.getInstance().run();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(red("Fatal error:"), errorMessage);
      process.exit(1);
    }
  })();
}

export default CLI;
