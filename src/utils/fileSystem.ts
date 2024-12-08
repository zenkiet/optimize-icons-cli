import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';

export class FileSystemManager {
  /**
   * Read file
   */
  public static async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
  }

  /**
   * Write file
   */
  public static async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error}`);
    }
  }

  /**
   * Copy file or folder
   */
  public static async copy(src: string, dest: string): Promise<void> {
    try {
      await fs.copy(src, dest);
    } catch (error) {
      throw new Error(`Failed to copy from ${src} to ${dest}: ${error}`);
    }
  }

  /**
   * Remove file or folder
   */
  public static async remove(pathToRemove: string): Promise<void> {
    try {
      await fs.remove(pathToRemove);
    } catch (error) {
      throw new Error(`Failed to remove ${pathToRemove}: ${error}`);
    }
  }

  /**
   * Find files with pattern
   */
  public static async findFiles(
    patterns: string | string[],
    options?: fg.Options
  ): Promise<string[]> {
    try {
      return await fg(patterns, { dot: true, ...options });
    } catch (error) {
      throw new Error(`Failed to find files with pattern ${patterns}: ${error}`);
    }
  }

  /**
   * Kiểm tra file hoặc thư mục có tồn tại không
   */
  public static async exists(filePath: string): Promise<boolean> {
    return await fs.pathExists(filePath);
  }

  /**
   * Create directory if not exists
   */
  public static async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.ensureDir(dirPath);
    } catch (error) {
      throw new Error(`Failed to create directory ${dirPath}: ${error}`);
    }
  }

  /**
   * Read content of directory
   */
  public static async readDirectory(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch (error) {
      throw new Error(`Failed to read directory ${dirPath}: ${error}`);
    }
  }

  /**
   * get stats of file or directory
   */
  public static async getStats(filePath: string): Promise<fs.Stats> {
    try {
      return await fs.stat(filePath);
    } catch (error) {
      throw new Error(`Failed to get stats for ${filePath}: ${error}`);
    }
  }
}
