import { promises as fs } from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import { svgFormatter } from '../utils/formatter';
import { Logger } from '../utils/logger';
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
    const files = await glob(`${this.options.outputPath}/**/*.{js,html}`);

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const iconMatches = content.match(/[a-zA-Z_]+:[a-zA-Z0-9_-]+/g) || [];

      iconMatches.forEach((match) => {
        const [, iconId] = match.split(':');
        if (iconId) this.usedIcons.add(iconId);
      });
    }

    this.logger.log(`Found ${this.usedIcons.size} used icons`);
  }

  /**
   * Process all SVG icon files
   */
  private async processIconFiles(): Promise<void> {
    const iconPath = this.options.iconsPath || path.join(this.options.outputPath, 'icons');
    let svgFiles = await glob(`${iconPath}/*.svg`);

    if (svgFiles.length === 0) {
      this.logger.warning(`No SVG files found in ${iconPath}`);
      return;
    }

    const filteredSvgFiles = svgFiles.filter((file) => {
      const fileName = file.match(/[^\\]+$/)?.[0] || '';
      return !this.options.ignoreFiles?.includes(fileName);
    });

    for (const file of filteredSvgFiles) {
      await this.optimizeSvgFile(file);
    }
  }

  /**
   * Optimize individual SVG file
   */
  private async optimizeSvgFile(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf8');
    const fileName = path.basename(filePath);

    this.logger.log(`\nProcessing ${fileName}...`);

    const { optimizedContent, removedCount, totalCount } = await this.processSvgContent(content);

    this.updateStats(content.length, optimizedContent.length, totalCount, removedCount);
    await fs.writeFile(filePath, optimizedContent);
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
