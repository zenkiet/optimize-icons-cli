import boxen from 'boxen';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { OUTPUT_DIR } from '../constants';
import IconOptimizer from '../core/icon-optimize';
import { OptimizeIconsOptions, SvgFileSelection } from '../core/types';
import { FileSystemManager } from '../utils/fileSystem';
import { BaseCommand } from './base-command';

export class OptimizeCommand implements BaseCommand {
  constructor(private options: Partial<OptimizeIconsOptions>) {}

  public async promptUserInput(): Promise<OptimizeIconsOptions> {
    const outputPathAnswer = await inquirer.prompt([
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
    ]);

    const iconsPathAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'iconsPath',
        message: 'Enter icons directory path:',
        default: `${outputPathAnswer.outputPath}/assets/icons`,
        validate: (input) => {
          if (input.trim().length === 0) {
            return 'Output path is required';
          }
          return true;
        },
      },
    ]);

    const svgFiles = await this.findSvgFiles(iconsPathAnswer.iconsPath);
    if (svgFiles.length === 0) {
      throw new Error(chalk.red('No SVG files found in the specified directory.'));
    }

    // Let user select SVG files
    const fileSelectionAnswer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedFiles',
        message: 'Select SVG files to optimize:',
        choices: svgFiles.map((file) => ({
          name: file,
          value: file,
        })),
        default: true,
        validate: (answer) => {
          if (answer.length === 0) {
            return 'You must choose at least one file';
          }
          return true;
        },
      },
    ]);

    const svgSelection: SvgFileSelection[] = [];

    for (const file of fileSelectionAnswer.selectedFiles) {
      const nameAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'customName',
          message: `Enter name for ${file}:`,
          default: this.convertToUnderscoreName(file),
          validate: (input) => {
            if (input.trim().length === 0) {
              return 'Name is required';
            }
            return true;
          },
        },
      ]);
      svgSelection.push({ filename: file, customName: nameAnswer.customName });
    }

    // Final verbose option
    const verboseAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'verbose',
        message: 'Enable verbose output?',
        default: false,
      },
    ]);

    return {
      outputPath: outputPathAnswer.outputPath,
      iconsPath: iconsPathAnswer.iconsPath,
      names: svgSelection.map((selection) => selection.customName).join(','),
      ignoreFiles: svgFiles
        .filter((file) => !fileSelectionAnswer.selectedFiles.includes(file))
        .join(','),
      verbose: verboseAnswer.verbose,
    };
  }

  public async execute(): Promise<void> {
    const config: OptimizeIconsOptions = this.options.outputPath
      ? {
          outputPath: this.options.outputPath || OUTPUT_DIR,
          iconsPath: this.options.iconsPath || `${OUTPUT_DIR}/assets/icons`,
          names: this.options.names || '',
          ignoreFiles: this.options.ignoreFiles,
          verbose: this.options.verbose,
        }
      : await this.promptUserInput();

    const optimizer = new IconOptimizer(config);
    await optimizer.optimize();
  }

  public displayCommand(options: OptimizeIconsOptions): void {
    const command = `optimize-icons -o ${options.outputPath} -i ${options.iconsPath} ${
      options?.names.length ? `-n ${options.names}` : ''
    } ${
      options.ignoreFiles?.length ? `-I ${options.ignoreFiles} ` : ''
    }  ${options.verbose ? '-v' : ''}`;

    console.log(
      boxen(chalk.green('Suggested command:\n\n') + chalk.yellow(command), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
      })
    );
  }

  private async findSvgFiles(iconsPath: string): Promise<string[]> {
    try {
      const files = await FileSystemManager.findFiles(`${iconsPath}/*.svg`);
      return files.map((file) => path.basename(file));
    } catch (error) {
      console.error(chalk.red('Error finding SVG files:'), error);
      return [];
    }
  }

  private convertToUnderscoreName(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/\.svg$/, '')
      .replace(/[-\s]/g, '_');
  }
}
