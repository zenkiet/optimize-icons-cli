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
      .option('-i, --icons-path <path>', 'Path to icons directory')
      .option('-n, --names <names>', 'Custom names for SVG files (comma-separated)')
      .option('-I, --ignore-file <file...>', 'Files to ignore')
      .option('-v, --verbose', 'Show verbose output')
      .addHelpText(
        'after',
        `
Examples:
  $ optimize-icons -o dist/browser
  $ optimize-icons -o dist/browser -i dist/browser/icons -I icon1.svg icon2.svg
  $ optimize-icons -o dist/browser -i dist/browser/icons -v
  $ optimize-icons -o dist/browser -i dist/browser/icons -n custom_icon1,custom_icon2
  $ optimize-icons -o dist/browser -i dist/browser/icons -n "icon_one,icon_two" -v`
      );
  }

  public async executeCommand(): Promise<void> {
    this.program.parse();

    const options = this.program.opts<Partial<OptimizeIconsOptions>>();

    if (Object.keys(options).length === 0) {
      const optimizeCommand = new OptimizeCommand({});
      const answers = await optimizeCommand.promptUserInput();
      optimizeCommand.displayCommand(answers);
    } else {
      const optimizeCommand = new OptimizeCommand(options);
      await optimizeCommand.execute();
    }
  }
}
