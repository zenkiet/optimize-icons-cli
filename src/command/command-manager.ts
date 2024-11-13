import { Command } from 'commander';
import { OptimizeIconsOptions } from '../core/types';
import { OptimizeCommand } from './optimize-command';

export class CommandManager {
  constructor(private program: Command) {
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .option('-o, --output-path <path>', 'Output path containing the built files')
      .option('-v, --verbose', 'Show verbose output')
      .addHelpText(
        'after',
        `
Examples:
  $ optimize-icons -o dist/browser
  $ optimize-icons -o dist/browser -v`
      );
  }

  public async executeCommand(): Promise<void> {
    this.program.parse();
    const options = this.program.opts<Partial<OptimizeIconsOptions>>();
    const optimizeCommand = new OptimizeCommand(options);
    await optimizeCommand.execute();
  }
}