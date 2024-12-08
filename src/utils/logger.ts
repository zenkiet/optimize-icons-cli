import boxen from 'boxen';
import chalk from 'chalk';
import ora from 'ora';
import { OptimizationStats } from '../core/types.js';

export class Logger {
  private _spinner: ora.Ora;

  constructor(private verbose: boolean = false) {
    this._spinner = ora({
      color: 'cyan',
    });
  }

  startSpinner(text: string): void {
    this._spinner.start(chalk.blue(text));
  }

  stopSpinner(success: boolean, text?: string): void {
    if (success) {
      this._spinner.succeed(chalk.green(text || 'Complete'));
    } else {
      this._spinner.fail(chalk.red(text || 'Failed'));
    }
  }

  log(message: string, isVerbose = false): void {
    if (!isVerbose || this.verbose) {
      console.log(chalk.blue('→'), message);
    }
  }

  error(message: string, error?: Error): void {
    console.error(chalk.red('✖'), message);
    if (error && this.verbose) {
      console.error(chalk.red(error.stack!));
    }
  }

  warning(message: string): void {
    console.warn(chalk.yellow('⚠'), message);
  }

  success(message: string): void {
    console.log(chalk.green('✔'), message);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  printSummary(stats: OptimizationStats): void {
    console.log(
      boxen(
        chalk.bold('Optimization Summary\n\n') +
          `${chalk.blue('Total icons processed:')} ${stats.totalIcons}\n` +
          `${chalk.yellow('Icons removed:')} ${stats.removedIcons}\n` +
          `${chalk.green('Bytes saved:')} ${this.formatBytes(stats.savedBytes)}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green',
        }
      )
    );
  }
}
