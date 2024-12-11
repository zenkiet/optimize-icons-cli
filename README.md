# optimize-icons-cli

<p align="center">
  <img src="https://raw.githubusercontent.com/zenkiet/optimize-icons-cli/refs/heads/main/assets/logo.png" alt="Optimize Icons CLI" width="300" height="300"/>
</p>

<h1 align="center">optimize-icons-cli</h1>

<p align="center">
  <a href="https://github.com/zenkiet/optimize-icons-cli/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/zenkiet/optimize-icons-cli/main.yml" alt="GitHub Actions Build Status" />
  </a>
  <a href="https://www.npmjs.com/package/optimize-icons-cli">
    <img src="https://img.shields.io/npm/v/optimize-icons-cli.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/optimize-icons-cli">
    <img src="https://img.shields.io/npm/dm/optimize-icons-cli.svg" alt="npm downloads" />
  </a>
  <a href="https://github.com/zenkiet/optimize-icons-cli/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/optimize-icons-cli.svg" alt="license" />
  </a>
  <a href="https://github.com/zenkiet/optimize-icons-cli/stargazers">
    <img src="https://img.shields.io/github/stars/zenkiet/optimize-icons-cli" alt="stars" />
  </a>
</p>

<p align="center">
  A powerful CLI tool for optimizing icons in your web projects with focus on performance and simplicity.
</p>

A command-line tool for optimizing icons in your web projects. This tool helps reduce icon file sizes and improve loading performance.

## Features

- Optimizes SVG, PNG, and other icon formats
- Interactive CLI interface
- Configurable output paths
- Verbose mode for detailed optimization information
- Easy to use with minimal configuration

## Installation

```bash
# Using npm
npm install -g optimize-icons-cli

# Using yarn
yarn global add optimize-icons-cli

# Using pnpm
pnpm add -g optimize-icons-cli
```

## Usage

### Command Line

```bash
# Show version
optimize-icons --version

# Show help
optimize-icons --help
```

### Interactive Mode

If you run the command without any arguments, it will start in interactive mode:

```bash
optimize-icons
```

The tool will prompt you for:

- Output path (default: dist/browser)
- Icons path (default: dist/browser/icons)
- Custom name of icons svg file (example: material_outline, material_solid...)
- Icons to ignore (comma-separated)
- Verbose mode (yes/no)

### Options

| Option           | Alias | Description                                           |
| ---------------- | ----- | ----------------------------------------------------- |
| `--output-path`  | `-o`  | Specify the output dist directory for optimized icons |
| `--icons-path`   | `-i`  | Specify the icons directory for optimized icons       |
| `--ignore-files` | `-I`  | Specify icons to ignore (comma-separated)             |
| `--names`        | `-n`  | Specify the custom name of icons svg file             |
| `--verbose`      | `-v`  | Enable verbose output                                 |
| `--version`      | -     | Show version number                                   |
| `--help`         | -     | Show help                                             |

## Programmatic Usage

You can also use the tool programmatically in your Node.js projects:

```typescript
import CLI from 'optimize-icons-cli';

const cli = CLI.getInstance();
await cli.run();
```

## Configuration

The tool accepts the following configuration options:

```typescript
interface OptimizeIconsOptions {
  outputPath: string; // Path where optimized icons will be saved
  iconsPath: string; // Path where original icons are located
  names: string; //  Custom name of icons svg file (comma-separated)
  ignoreFiles: string; // Icons path to ignore (comma-separated)
  verbose: boolean; // Enable detailed logging
}
```

## 💫 Deployment

Add additional notes about how to deploy this on a live system.

---

<p align="center">Made with ❤️ by <a href="https://github.com/zenkiet">Kiet Le</a></p>
