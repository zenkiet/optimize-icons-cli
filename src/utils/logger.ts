import { OptimizationStats } from "../core/types";

export class Logger {
    constructor(private verbose: boolean = false) {}

    log(message: string, isVerbose = false): void {
        if (!isVerbose || this.verbose) {
            console.log(message);
        }
    }

    error(message: string, error?: Error): void {
        console.error(message);
        if (error && this.verbose) {
            console.error(error);
        }
    }

    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    printSummary(stats: OptimizationStats): void {
        console.log('\nOptimization Summary:');
        console.log(`Total icons processed: ${stats.totalIcons}`);
        console.log(`Icons removed: ${stats.removedIcons}`);
        console.log(`Bytes saved: ${this.formatBytes(stats.savedBytes)}`);
    }
}