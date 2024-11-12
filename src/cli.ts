import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import IconOptimizer from './core/icon-optimize';
import inquirer  from 'inquirer';


async function promptUserInput() {
    const defaultOutputPath = 'dist/browser';

    return inquirer.prompt([
        {
            type: 'input',
            name: 'outputPath',
            message: 'Enter output path (press Enter for default):',
            default: defaultOutputPath,
            validate: (input: string) => {
                if (input.trim() === '') return true;
                return true;
            }
        },
        {
            type: 'confirm',
            name: 'verbose',
            message: 'Enable verbose output?',
            default: false
        }
    ])
}

async function main() {
    const cliArgs = await yargs(hideBin(process.argv))
        .option('outputPath', {
            alias: 'o',
            type: 'string',
            description: 'Output path containing the built files',
        })
        .option('verbose', {
            alias: 'v',
            type: 'boolean',
            description: 'Show verbose output',
        })
        .help()
        .argv;

    // Nếu không có arguments từ CLI, hỏi người dùng
    const config = cliArgs.outputPath || cliArgs.verbose
        ? cliArgs
        : await promptUserInput();

    const optimizer = new IconOptimizer({
        outputPath: config.outputPath,
        verbose: config.verbose
    });

    await optimizer.optimize();
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});