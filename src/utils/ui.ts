import boxen from 'boxen';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import figlet from 'figlet';

export class UI {
  private progressBar: cliProgress.SingleBar;

  constructor() {
    this.progressBar = new cliProgress.SingleBar({
      format: `${chalk.cyan('{bar}')} ${chalk.green('{percentage}%')} | ${chalk.yellow('{value}/{total}')} Files | ${chalk.blue('{text}')}`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    });
  }

  showWelcome(): void {
    console.log(
      '\n' +
        chalk.cyan(
          figlet.textSync('Icon Optimizer', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default',
          })
        )
    );

    console.log(
      boxen(
        `${chalk.green('Welcome to Icon Optimizer!')}\n\n` +
          `${chalk.yellow('✨ Optimize your SVG icons efficiently')}\n` +
          `${chalk.yellow('🚀 Remove unused icons automatically')}\n` +
          `${chalk.yellow('💾 Reduce file size and improve performance')}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'cyan',
        }
      )
    );
  }

  startProgress(total: number): void {
    this.progressBar.start(total, 0, { text: 'Starting...' });
  }

  updateProgress(current: number, text: string): void {
    this.progressBar.update(current, { text });
  }

  stopProgress(): void {
    this.progressBar.stop();
  }

  showSection(title: string): void {
    console.log(
      '\n' + chalk.cyan('━'.repeat(20)) + chalk.white(` ${title} `) + chalk.cyan('━'.repeat(20))
    );
  }
}

export const ui = new UI();
