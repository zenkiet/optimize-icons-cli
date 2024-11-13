import inquirer from 'inquirer';
import { OUTPUT_DIR, VERBOSE_DEFAULT } from '../constants';
import IconOptimizer from '../core/icon-optimize';
import { OptimizeIconsOptions } from '../core/types';
import { BaseCommand } from './base-command';

export class OptimizeCommand implements BaseCommand {
  constructor(private options: Partial<OptimizeIconsOptions>) {}

  private async promptUserInput(): Promise<OptimizeIconsOptions> {
    const answers = await inquirer.prompt<OptimizeIconsOptions>([
      {
        type: 'input',
        name: 'outputPath',
        message: 'Enter output path:',
        default: 'dist/browser',
        validate: (input) => {
          if (input.trim().length === 0) {
            return 'Output path is required';
          }
          return true;
        },
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
            verbose: this.options.verbose || VERBOSE_DEFAULT,
          }
        : await this.promptUserInput();

    const optimizer = new IconOptimizer(config);
    await optimizer.optimize();
  }
}
