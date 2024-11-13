import * as prettier from 'prettier';

export class SvgFormatter {
  private readonly prettierConfig: prettier.Options = {
    parser: 'html',
    printWidth: 120,
    htmlWhitespaceSensitivity: 'ignore',
    tabWidth: 2,
  };

  /**
   * Format SVG content using prettier
   */
  async formatContent(content: string): Promise<string> {
    try {
      return await prettier.format(content, this.prettierConfig);
    } catch (error) {
      console.warn('Failed to format SVG content:', error);
      return content;
    }
  }

  /**
   * Clean and normalize essential SVG attributes
   */
  cleanAttributes(attrs: string, id: string): string {
    const essentialAttrs = ['viewBox', 'fill'];
    const attrRegex = /([a-zA-Z0-9-]+)="([^"]+)"/g;
    const cleanedAttrs = [`id="${id}"`];

    let match: RegExpExecArray | null;
    while ((match = attrRegex.exec(attrs)) !== null) {
      const [, name, value] = match;
      if (essentialAttrs.includes(name)) {
        cleanedAttrs.push(`${name}="${value}"`);
      }
    }

    return cleanedAttrs.join(' ');
  }
}

// Export singleton instance
export const svgFormatter = new SvgFormatter();
