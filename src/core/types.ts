export interface OptimizeIconsOptions {
  outputPath: string;
  verbose?: boolean;
}

export interface OptimizationStats {
  totalIcons: number;
  removedIcons: number;
  savedBytes: number;
}

export interface ProcessSvgResult {
  optimizedContent: string;
  removedCount: number;
  totalCount: number;
}
