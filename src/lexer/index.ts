import type { Token, Position } from '../types';
import { TokenType } from '../types';

export class MarkdownLexer {
  private input: string;
  private position: number;
  private line: number;
  private column: number;
  private lines: string[];

  constructor(input: string) {
    this.input = input.trim();
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.lines = this.input.split('\n');
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const lineTokens = this.tokenizeLine(line, i + 1);
      tokens.push(...lineTokens);
    }
    
    tokens.push({
      type: TokenType.EOF,
      value: '',
      position: this.createPosition(this.input.length, this.input.length)
    });
    
    return tokens;
  }

  private tokenizeLine(line: string, lineNumber: number): Token[] {
    const tokens: Token[] = [];
    let remaining = line;
    let columnOffset = 0;

    // Empty line
    if (remaining.trim() === '') {
      tokens.push({
        type: TokenType.NEWLINE,
        value: '\n',
        position: this.createPosition(0, 0, lineNumber, 1)
      });
      return tokens;
    }

    // Check for code blocks first (multiline)
    if (remaining.startsWith('```')) {
      const codeBlockToken = this.parseCodeBlock(lineNumber);
      if (codeBlockToken) {
        tokens.push(codeBlockToken);
        return tokens;
      }
    }

    // Check for heading
    const headingMatch = remaining.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      tokens.push({
        type: TokenType.HEADING,
        value: headingMatch[0],
        position: this.createPosition(columnOffset, columnOffset + headingMatch[0].length, lineNumber),
        metadata: {
          level: headingMatch[1].length,
          text: headingMatch[2]
        }
      });
      return tokens;
    }

    // Check for list item
    const listMatch = remaining.match(/^[-*+]\s+(.+)$/);
    if (listMatch) {
      tokens.push({
        type: TokenType.LIST_ITEM,
        value: listMatch[0],
        position: this.createPosition(columnOffset, columnOffset + listMatch[0].length, lineNumber),
        metadata: {
          text: listMatch[1]
        }
      });
      return tokens;
    }

    // Parse inline content (paragraph)
    while (remaining.length > 0) {
      let matched = false;

      // Inline code
      const inlineCodeMatch = remaining.match(/^`([^`]+)`/);
      if (inlineCodeMatch) {
        tokens.push({
          type: TokenType.INLINE_CODE,
          value: inlineCodeMatch[0],
          position: this.createPosition(columnOffset, columnOffset + inlineCodeMatch[0].length, lineNumber),
          metadata: { code: inlineCodeMatch[1] }
        });
        remaining = remaining.slice(inlineCodeMatch[0].length);
        columnOffset += inlineCodeMatch[0].length;
        matched = true;
      }
      // Bold (must come before italic)
      else if (remaining.match(/^\*\*[^*]+\*\*/)) {
        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
          tokens.push({
            type: TokenType.BOLD,
            value: boldMatch[0],
            position: this.createPosition(columnOffset, columnOffset + boldMatch[0].length, lineNumber),
            metadata: { text: boldMatch[1] }
          });
          remaining = remaining.slice(boldMatch[0].length);
          columnOffset += boldMatch[0].length;
          matched = true;
        }
      }
      // Italic
      else if (remaining.match(/^\*[^*]+\*/)) {
        const italicMatch = remaining.match(/^\*([^*]+)\*/);
        if (italicMatch) {
          tokens.push({
            type: TokenType.ITALIC,
            value: italicMatch[0],
            position: this.createPosition(columnOffset, columnOffset + italicMatch[0].length, lineNumber),
            metadata: { text: italicMatch[1] }
          });
          remaining = remaining.slice(italicMatch[0].length);
          columnOffset += italicMatch[0].length;
          matched = true;
        }
      }
      // Links
      else if (remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)) {
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          tokens.push({
            type: TokenType.LINK,
            value: linkMatch[0],
            position: this.createPosition(columnOffset, columnOffset + linkMatch[0].length, lineNumber),
            metadata: {
              text: linkMatch[1],
              url: linkMatch[2]
            }
          });
          remaining = remaining.slice(linkMatch[0].length);
          columnOffset += linkMatch[0].length;
          matched = true;
        }
      }
      // Regular text
      else {
        // Find next special character or end of string
        const nextSpecial = remaining.search(/[`*\[]/);
        const textLength = nextSpecial === -1 ? remaining.length : nextSpecial;
        
        if (textLength > 0) {
          const textValue = remaining.slice(0, textLength);
          tokens.push({
            type: TokenType.TEXT,
            value: textValue,
            position: this.createPosition(columnOffset, columnOffset + textLength, lineNumber)
          });
          remaining = remaining.slice(textLength);
          columnOffset += textLength;
          matched = true;
        }
      }

      // Safety check to prevent infinite loop
      if (!matched) {
        // Take one character if nothing else matches
        const char = remaining[0];
        tokens.push({
          type: TokenType.TEXT,
          value: char,
          position: this.createPosition(columnOffset, columnOffset + 1, lineNumber)
        });
        remaining = remaining.slice(1);
        columnOffset += 1;
      }
    }

    return tokens;
  }

  private parseCodeBlock(startLine: number): Token | null {
    const firstLine = this.lines[startLine - 1];
    const codeBlockMatch = firstLine.match(/^```(\w+)?$/);
    
    if (!codeBlockMatch) {
      return null;
    }

    const language = codeBlockMatch[1] || '';
    let code = '';
    let endLine = startLine;

    // Find closing ```
    for (let i = startLine; i < this.lines.length; i++) {
      if (this.lines[i].trim() === '```') {
        endLine = i + 1;
        break;
      }
      if (i > startLine - 1) {
        code += (code ? '\n' : '') + this.lines[i];
      }
    }

    // Skip the lines we consumed
    for (let i = startLine; i < endLine; i++) {
      if (i < this.lines.length) {
        this.lines[i] = ''; // Mark as consumed
      }
    }

    return {
      type: TokenType.CODE_BLOCK,
      value: `\`\`\`${language}\n${code}\n\`\`\``,
      position: this.createPosition(0, 0, startLine),
      metadata: {
        language,
        code
      }
    };
  }

  private createPosition(start: number, end: number, line?: number, column?: number): Position {
    return {
      start,
      end,
      line: line || this.line,
      column: column || this.column
    };
  }
}
