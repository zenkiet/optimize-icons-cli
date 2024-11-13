import { OptimizationStats } from "../core/types";
import { blue, red, green, yellow, bold } from "colorette";
import ora, { Ora } from "ora";

export class Logger {
  private _spinner: Ora;

  constructor(private verbose: boolean = false) {
    this._spinner = ora();
  }

  startSpinner(text: string): void {
    this._spinner.start(blue(text));
  }

  stopSpinner(success: boolean, text?: string): void {
    if (success) {
      this._spinner.succeed(green(text || "Complete"));
    } else {
      this._spinner.fail(red(text || "Failed"));
    }
  }

  log(message: string, isVerbose = false): void {
    if (!isVerbose || this.verbose) {
      console.log(blue(message));
    }
  }

  error(message: string, error?: Error): void {
    console.error(message);
    if (error && this.verbose) {
      console.error(red(error.stack!));
    }
  }

  warning(message: string): void {
    console.warn(yellow(message));
  }

  success(message: string): void {
    console.log(green(message));
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  printSummary(stats: OptimizationStats): void {
    console.log("\n" + bold("Optimization Summary:"));
    console.log(blue(`Total icons processed: ${stats.totalIcons}`));
    console.log(yellow(`Icons removed: ${stats.removedIcons}`));
    console.log(green(`Bytes saved: ${this.formatBytes(stats.savedBytes)}`));
  }
}
