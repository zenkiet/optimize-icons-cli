import * as path from 'path';
import { FileSystemManager } from '../utils/fileSystem';
import { svgFormatter } from '../utils/formatter';
import { Logger } from '../utils/logger';
import { ui } from '../utils/ui';
import { OptimizationStats, OptimizeIconsOptions, ProcessSvgResult } from './types';

export class IconOptimizer {
  private usedIcons = new Set<string>();
  private stats: OptimizationStats = {
    totalIcons: 0,
    removedIcons: 0,
    savedBytes: 0,
  };
  private logger: Logger;

  constructor(private options: OptimizeIconsOptions) {
    this.logger = new Logger(options.verbose);
  }

  /**
   * Main optimization process
   */
  async optimize(): Promise<void> {
    try {
      this.logger.startSpinner('Starting optimization...');

      await this.findUsedIcons();
      await this.processIconFiles();

      this.logger.stopSpinner(true, 'Optimization completed');

      this.logger.printSummary(this.stats);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Find all used icons in JS and HTML files
   */
  private async findUsedIcons(): Promise<void> {
    const files = await FileSystemManager.findFiles(`${this.options.outputPath}/**/*.{js,html}`);

    const names = this.options.names.split(',').map((name) => name.trim());
    if (names.length === 0) {
      this.logger.error('No custom names provided');
      return;
    }

    const namesPattern = names.map((name) => `${name}:[a-zA-Z0-9_-]+`).join('|');
    const iconRegex = new RegExp(namesPattern, 'g');

    for (const file of files) {
      const content = await FileSystemManager.readFile(file);
      const iconMatches = content.match(iconRegex) || [];

      iconMatches.forEach((match) => {
        const [, iconId] = match.split(':');
        if (iconId) this.usedIcons.add(iconId);
      });
    }

    this.logger.log(
      `Found ${this.usedIcons.size} used icons for specified names: ${names.join(', ')}`
    );
  }

  /**
   * Process all SVG icon files
   */
  private async processIconFiles(): Promise<void> {
    const iconPath = this.options.iconsPath;
    let svgFiles = await FileSystemManager.findFiles(`${iconPath}/*.svg`);

    if (svgFiles.length === 0) {
      this.logger.warning(`No SVG files found in ${iconPath}`);
      return;
    }

    // const filteredSvgFiles = svgFiles.filter((file) => {
    //   const fileName = file.match(/[^\\]+$/)?.[0] || '';
    //   return !this.options.ignoreFiles?.includes(fileName);
    // });

    // ui.startProgress(filteredSvgFiles.length);

    for (let i = 0; i < svgFiles.length; i++) {
      const file = svgFiles[i];
      const fileName = path.basename(file);
      ui.updateProgress(i + 1, `Processing ${fileName}`);
      await this.optimizeSvgFile(file);
    }

    ui.stopProgress();
  }

  /**
   * Optimize individual SVG file
   */
  private async optimizeSvgFile(filePath: string): Promise<void> {
    const fileName = path.basename(filePath);

    try {
      const content = await FileSystemManager.readFile(filePath);
      this.logger.log(`\nProcessing ${fileName}...`);

      const { optimizedContent, removedCount, totalCount } = await this.processSvgContent(content);

      if (removedCount > 0) {
        this.updateStats(content.length, optimizedContent.length, totalCount, removedCount);
        await FileSystemManager.writeFile(filePath, optimizedContent);
        this.logger.log(`Successfully optimized ${fileName} (removed ${removedCount} icons)`);
      } else {
        this.logger.log(`No changes needed for ${fileName}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process ${fileName}:`);
      throw error;
    }
  }

  /**
   * Process SVG content and optimize it
   */
  private async processSvgContent(content: string): Promise<ProcessSvgResult> {
    const iconRegex = /<(svg|symbol)\s+([^>]*?id="([^"]+)"[^>]*?)>([\s\S]*?)<\/(svg|symbol)>/g;
    let match: RegExpExecArray | null;
    let totalCount = 0;
    let removedCount = 0;

    const svgStart = content.match(/<svg[^>]*>/)?.[0] || '';
    const icons: string[] = [];

    while ((match = iconRegex.exec(content)) !== null) {
      const [, tagType, attrs, id, paths] = match;
      totalCount++;

      if (this.usedIcons.has(id)) {
        icons.push(`    <${tagType} ${attrs}>${paths}</${tagType}>`);
      } else {
        removedCount++;
        this.logger.log(`Removed unused icon: ${id}`, true);
      }
    }

    const optimizedContent = await this.buildOptimizedContent(svgStart, icons);
    return { optimizedContent, removedCount, totalCount };
  }

  /**
   * Build optimized SVG content
   */
  private async buildOptimizedContent(svgStart: string, icons: string[]): Promise<string> {
    const content = [
      '<!-- @formatter:off -->',
      svgStart,
      '  <defs>',
      icons.join('\n'),
      '  </defs>',
      '</svg>',
    ].join('\n');

    return await svgFormatter.formatContent(content);
  }

  /**
   * Update optimization statistics
   */
  private updateStats(
    originalLength: number,
    optimizedLength: number,
    totalCount: number,
    removedCount: number
  ): void {
    this.stats.totalIcons += totalCount;
    this.stats.removedIcons += removedCount;
    this.stats.savedBytes += originalLength - optimizedLength;
  }

  /**
   * Handle errors during optimization
   */
  private handleError(error: unknown): void {
    if (error instanceof URIError) {
      this.logger.error(error.message);
    } else if (error instanceof Error) {
      this.logger.error('Build failed:', error);
    } else {
      this.logger.error('An unknown error occurred during build');
    }
    process.exit(1);
  }
}

export default IconOptimizer;
