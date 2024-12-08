import chalk from 'chalk';
import { Command } from 'commander';
import { CommandManager } from './command/command-manager';
import { ui } from './utils/ui';

type PackageJson = Readonly<{
  version: string;
  description?: string;
  name?: string;
}>;

class CLI {
  private static instance: CLI | null = null;
  private readonly program: Command;
  private readonly packageJson: PackageJson;
  private readonly commandManager: CommandManager;

  private constructor() {
    this.packageJson = require('../package.json');
    this.program = new Command();
    this.setupProgram();
    this.commandManager = new CommandManager(this.program);
  }

  public static getInstance(): CLI {
    if (!CLI.instance) {
      CLI.instance = new CLI();
    }
    return CLI.instance;
  }

  private setupProgram(): void {
    this.program
      .name(this.packageJson.name || 'optimize-icons')
      .version(this.packageJson.version)
      .description(this.packageJson.description || 'Icon optimization tool');
  }

  public async run(): Promise<void> {
    try {
      ui.showWelcome();
      await this.commandManager.executeCommand();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red('Fatal error:'), errorMessage);
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red('Fatal error:'), errorMessage);
      process.exit(1);
    }
  })();
}

export default CLI;
