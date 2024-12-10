import boxen from 'boxen';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ICONS_DIR, IGNORE_FILE, OUTPUT_DIR, VERBOSE_DEFAULT } from '../constants';
import IconOptimizer from '../core/icon-optimize';
import { OptimizeIconsOptions } from '../core/types';
import { BaseCommand } from './base-command';

export class OptimizeCommand implements BaseCommand {
  constructor(private options: Partial<OptimizeIconsOptions>) {}

  public async promptUserInput(): Promise<OptimizeIconsOptions> {
    const answers = await inquirer.prompt<OptimizeIconsOptions>([
      {
        type: 'input',
        name: 'outputPath',
        message: 'Enter output path:',
        default: OUTPUT_DIR,
        validate: (input) => {
          if (input.trim().length === 0) {
            return 'Output path is required';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'iconsPath',
        message: 'Enter icons directory path:',
        default: ICONS_DIR,
        validate: (input) => {
          if (input.trim().length === 0) {
            return 'Output path is required';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'ignoreFiles',
        message: 'Enter files to ignore (comma separated):',
        default: IGNORE_FILE.join(','),
        filter: (input) =>
          input
            .split(',')
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0),
      },
      {
        type: 'confirm',
        name: 'verbose',
        message: 'Enable verbose output?',
        default: false,
      },
    ]);

    return answers;
  }

  public async execute(): Promise<void> {
    const config: OptimizeIconsOptions =
      this.options.outputPath || this.options.verbose
        ? {
            outputPath: this.options.outputPath || OUTPUT_DIR,
            iconsPath: this.options.iconsPath || ICONS_DIR,
            ignoreFiles: this.options.ignoreFiles || IGNORE_FILE,
            verbose: this.options.verbose || VERBOSE_DEFAULT,
          }
        : await this.promptUserInput();

    const optimizer = new IconOptimizer(config);
    await optimizer.optimize();
  }

  public displayCommand(options: OptimizeIconsOptions): void {
    const command = `optimize-icons -o ${options.outputPath} -i ${options.iconsPath} ${
      options.ignoreFiles && options.ignoreFiles.length > 0
        ? `-I ${options.ignoreFiles.join(' ')}`
        : ''
    } ${options.verbose ? '-v' : ''}`;

    console.log(
      boxen(chalk.green('Suggested command:\n\n') + chalk.yellow(command), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
      })
    );
  }
}
