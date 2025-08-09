// src/types/index.ts
export * from './tokens';
export * from './ast';
export * from './config';

// src/types/tokens.ts
export enum TokenType {
  HEADING = 'HEADING',
  PARAGRAPH = 'PARAGRAPH',
  CODE_BLOCK = 'CODE_BLOCK',
  INLINE_CODE = 'INLINE_CODE',
  BOLD = 'BOLD',
  ITALIC = 'ITALIC',
  LINK = 'LINK',
  TEXT = 'TEXT',
  NEWLINE = 'NEWLINE',
  LIST_ITEM = 'LIST_ITEM',
  EOF = 'EOF'
}

export interface Position {
  start: number;
  end: number;
  line: number;
  column: number;
}

export interface Token {
  type: TokenType;
  value: string;
  position: Position;
  metadata?: Record<string, any>;
}

// src/types/ast.ts
export interface ASTNode {
  type: string;
  children?: ASTNode[];
  value?: string;
  metadata?: Record<string, any>;
}

export interface DocumentNode extends ASTNode {
  type: 'document';
  children: ASTNode[];
}

export interface HeadingNode extends ASTNode {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ASTNode[];
}

export interface ParagraphNode extends ASTNode {
  type: 'paragraph';
  children: ASTNode[];
}

export interface CodeBlockNode extends ASTNode {
  type: 'codeBlock';
  language?: string;
  value: string;
}

export interface InlineCodeNode extends ASTNode {
  type: 'inlineCode';
  value: string;
}

export interface TextNode extends ASTNode {
  type: 'text';
  value: string;
}

export interface BoldNode extends ASTNode {
  type: 'bold';
  children: ASTNode[];
}

export interface ItalicNode extends ASTNode {
  type: 'italic';
  children: ASTNode[];
}

export interface LinkNode extends ASTNode {
  type: 'link';
  url: string;
  title?: string;
  children: ASTNode[];
}

export interface ListNode extends ASTNode {
  type: 'list';
  ordered: boolean;
  children: ListItemNode[];
}

export interface ListItemNode extends ASTNode {
  type: 'listItem';
  children: ASTNode[];
}

export type MarkdownASTNode = 
  | DocumentNode 
  | HeadingNode 
  | ParagraphNode 
  | CodeBlockNode 
  | InlineCodeNode 
  | TextNode 
  | BoldNode 
  | ItalicNode 
  | LinkNode 
  | ListNode 
  | ListItemNode;

// src/types/config.ts
export interface StyleConfig {
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontFamily?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
  textDecoration?: string;
  lineHeight?: string | number;
  fontWeight?: string | number;
}

export interface HeadingStyles {
  h1?: StyleConfig;
  h2?: StyleConfig;
  h3?: StyleConfig;
  h4?: StyleConfig;
  h5?: StyleConfig;
  h6?: StyleConfig;
}

export interface MarkdownConfig {
  theme: string;
  styles: {
    codeBlock?: StyleConfig;
    inlineCode?: StyleConfig;
    heading?: HeadingStyles;
    paragraph?: StyleConfig;
    link?: StyleConfig;
    bold?: StyleConfig;
    italic?: StyleConfig;
    list?: StyleConfig;
    listItem?: StyleConfig;
  };
}

// src/lexer/rules.ts
import { TokenType } from '../types';

export interface LexerRule {
  type: TokenType;
  pattern: RegExp;
  handler?: (match: RegExpMatchArray, input: string, position: number) => any;
}

export const LEXER_RULES: LexerRule[] = [
  // Code blocks (must come before headings)
  {
    type: TokenType.CODE_BLOCK,
    pattern: /^```(\w+)?\n([\s\S]*?)\n```/,
    handler: (match) => ({
      language: match[1] || '',
      code: match[2]
    })
  },
  
  // Headings
  {
    type: TokenType.HEADING,
    pattern: /^(#{1,6})\s+(.+)$/,
    handler: (match) => ({
      level: match[1].length,
      text: match[2]
    })
  },
  
  // Inline code
  {
    type: TokenType.INLINE_CODE,
    pattern: /`([^`]+)`/,
    handler: (match) => ({ code: match[1] })
  },
  
  // Bold
  {
    type: TokenType.BOLD,
    pattern: /\*\*([^*]+)\*\*/,
    handler: (match) => ({ text: match[1] })
  },
  
  // Italic
  {
    type: TokenType.ITALIC,
    pattern: /\*([^*]+)\*/,
    handler: (match) => ({ text: match[1] })
  },
  
  // Links
  {
    type: TokenType.LINK,
    pattern: /\[([^\]]+)\]\(([^)]+)\)/,
    handler: (match) => ({
      text: match[1],
      url: match[2]
    })
  },
  
  // List items
  {
    type: TokenType.LIST_ITEM,
    pattern: /^[-*+]\s+(.+)$/,
    handler: (match) => ({ text: match[1] })
  },
  
  // Newlines
  {
    type: TokenType.NEWLINE,
    pattern: /\n/
  },
  
  // Text (fallback)
  {
    type: TokenType.TEXT,
    pattern: /[^\n]+/
  }
];

// src/lexer/index.ts
import { Token, TokenType, Position } from '../types';
import { LEXER_RULES } from './rules';

export class MarkdownLexer {
  private input: string;
  private position: number;
  private line: number;
  private column: number;

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.position < this.input.length) {
      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }
    
    tokens.push({
      type: TokenType.EOF,
      value: '',
      position: this.getCurrentPosition()
    });
    
    return tokens;
  }

  private nextToken(): Token | null {
    if (this.position >= this.input.length) {
      return null;
    }

    const remaining = this.input.slice(this.position);
    
    for (const rule of LEXER_RULES) {
      const match = remaining.match(rule.pattern);
      if (match && match.index === 0) {
        const value = match[0];
        const startPos = this.getCurrentPosition();
        
        this.advance(value.length);
        
        const token: Token = {
          type: rule.type,
          value,
          position: startPos,
          metadata: rule.handler ? rule.handler(match, this.input, this.position) : undefined
        };
        
        return token;
      }
    }
    
    // Si aucune règle ne matche, avancer d'un caractère
    this.advance(1);
    return null;
  }

  private getCurrentPosition(): Position {
    return {
      start: this.position,
      end: this.position,
      line: this.line,
      column: this.column
    };
  }

  private advance(count: number): void {
    for (let i = 0; i < count && this.position < this.input.length; i++) {
      if (this.input[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }
}

// src/parser/ast-builder.ts
import { 
  ASTNode, 
  DocumentNode, 
  HeadingNode, 
  ParagraphNode, 
  CodeBlockNode,
  InlineCodeNode,
  TextNode,
  BoldNode,
  ItalicNode,
  LinkNode,
  ListNode,
  ListItemNode,
  MarkdownASTNode
} from '../types';

export class ASTBuilder {
  createDocument(children: ASTNode[]): DocumentNode {
    return {
      type: 'document',
      children
    };
  }

  createHeading(level: 1 | 2 | 3 | 4 | 5 | 6, children: ASTNode[]): HeadingNode {
    return {
      type: 'heading',
      level,
      children
    };
  }

  createParagraph(children: ASTNode[]): ParagraphNode {
    return {
      type: 'paragraph',
      children
    };
  }

  createCodeBlock(code: string, language?: string): CodeBlockNode {
    return {
      type: 'codeBlock',
      value: code,
      language
    };
  }

  createInlineCode(code: string): InlineCodeNode {
    return {
      type: 'inlineCode',
      value: code
    };
  }

  createText(text: string): TextNode {
    return {
      type: 'text',
      value: text
    };
  }

  createBold(children: ASTNode[]): BoldNode {
    return {
      type: 'bold',
      children
    };
  }

  createItalic(children: ASTNode[]): ItalicNode {
    return {
      type: 'italic',
      children
    };
  }

  createLink(url: string, children: ASTNode[], title?: string): LinkNode {
    return {
      type: 'link',
      url,
      title,
      children
    };
  }

  createList(ordered: boolean, items: ListItemNode[]): ListNode {
    return {
      type: 'list',
      ordered,
      children: items
    };
  }

  createListItem(children: ASTNode[]): ListItemNode {
    return {
      type: 'listItem',
      children
    };
  }
}

// src/parser/index.ts
import { Token, TokenType, MarkdownASTNode, DocumentNode } from '../types';
import { ASTBuilder } from './ast-builder';

export class MarkdownParser {
  private tokens: Token[];
  private position: number;
  private builder: ASTBuilder;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.position = 0;
    this.builder = new ASTBuilder();
  }

  parse(): DocumentNode {
    const children: MarkdownASTNode[] = [];
    
    while (!this.isAtEnd()) {
      const node = this.parseNode();
      if (node) {
        children.push(node);
      }
    }
    
    return this.builder.createDocument(children);
  }

  private parseNode(): MarkdownASTNode | null {
    const token = this.peek();
    if (!token) return null;

    switch (token.type) {
      case TokenType.HEADING:
        return this.parseHeading();
      case TokenType.CODE_BLOCK:
        return this.parseCodeBlock();
      case TokenType.LIST_ITEM:
        return this.parseList();
      case TokenType.NEWLINE:
        this.advance();
        return null;
      default:
        return this.parseParagraph();
    }
  }

  private parseHeading(): MarkdownASTNode {
    const token = this.advance();
    const level = token.metadata?.level as (1 | 2 | 3 | 4 | 5 | 6);
    const text = token.metadata?.text as string;
    
    const children = this.parseInlineContent(text);
    return this.builder.createHeading(level, children);
  }

  private parseCodeBlock(): MarkdownASTNode {
    const token = this.advance();
    const language = token.metadata?.language as string;
    const code = token.metadata?.code as string;
    
    return this.builder.createCodeBlock(code, language);
  }

  private parseList(): MarkdownASTNode {
    const items: any[] = [];
    
    while (this.peek()?.type === TokenType.LIST_ITEM) {
      const token = this.advance();
      const text = token.metadata?.text as string;
      const children = this.parseInlineContent(text);
      items.push(this.builder.createListItem(children));
    }
    
    return this.builder.createList(false, items);
  }

  private parseParagraph(): MarkdownASTNode {
    const tokens: Token[] = [];
    
    while (!this.isAtEnd() && 
           this.peek()?.type !== TokenType.HEADING &&
           this.peek()?.type !== TokenType.CODE_BLOCK &&
           this.peek()?.type !== TokenType.LIST_ITEM &&
           this.peek()?.type !== TokenType.NEWLINE) {
      tokens.push(this.advance());
    }
    
    if (tokens.length === 0) {
      return this.builder.createText('');
    }
    
    const content = tokens.map(t => t.value).join('');
    const children = this.parseInlineContent(content);
    
    return this.builder.createParagraph(children);
  }

  private parseInlineContent(content: string): MarkdownASTNode[] {
    // Simple parsing for inline content
    const children: MarkdownASTNode[] = [];
    let remaining = content;
    
    while (remaining.length > 0) {
      // Check for inline code
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        children.push(this.builder.createInlineCode(codeMatch[1]));
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }
      
      // Check for bold
      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
      if (boldMatch) {
        children.push(this.builder.createBold([this.builder.createText(boldMatch[1])]));
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }
      
      // Check for italic
      const italicMatch = remaining.match(/^\*([^*]+)\*/);
      if (italicMatch) {
        children.push(this.builder.createItalic([this.builder.createText(italicMatch[1])]));
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }
      
      // Check for links
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        children.push(this.builder.createLink(
          linkMatch[2], 
          [this.builder.createText(linkMatch[1])]
        ));
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }
      
      // Default to text
      const textMatch = remaining.match(/^[^*`\[]+/);
      if (textMatch) {
        children.push(this.builder.createText(textMatch[0]));
        remaining = remaining.slice(textMatch[0].length);
      } else {
        children.push(this.builder.createText(remaining[0]));
        remaining = remaining.slice(1);
      }
    }
    
    return children;
  }

  private peek(): Token | null {
    return this.position < this.tokens.length ? this.tokens[this.position] : null;
  }

  private advance(): Token {
    const token = this.tokens[this.position];
    this.position++;
    return token;
  }

  private isAtEnd(): boolean {
    const token = this.peek();
    return !token || token.type === TokenType.EOF;
  }
}

// src/config/default.ts
import { MarkdownConfig } from '../types';

export const DEFAULT_CONFIG: MarkdownConfig = {
  theme: 'default',
  styles: {
    codeBlock: {
      backgroundColor: '#f6f8fa',
      border: '1px solid #e1e4e8',
      borderRadius: '6px',
      padding: '16px',
      fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
      fontSize: '14px',
      lineHeight: '1.45',
      color: '#24292f'
    },
    inlineCode: {
      backgroundColor: 'rgba(175,184,193,0.2)',
      padding: '2px 4px',
      borderRadius: '4px',
      fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
      fontSize: '85%'
    },
    heading: {
      h1: { 
        fontSize: '32px', 
        fontWeight: '600',
        color: '#1f2937',
        margin: '0 0 16px 0',
        lineHeight: '1.25'
      },
      h2: { 
        fontSize: '24px', 
        fontWeight: '600',
        color: '#374151',
        margin: '24px 0 16px 0',
        lineHeight: '1.25'
      },
      h3: { 
        fontSize: '20px', 
        fontWeight: '600',
        color: '#4b5563',
        margin: '24px 0 16px 0',
        lineHeight: '1.25'
      },
      h4: { 
        fontSize: '16px', 
        fontWeight: '600',
        color: '#6b7280',
        margin: '24px 0 16px 0',
        lineHeight: '1.25'
      },
      h5: { 
        fontSize: '14px', 
        fontWeight: '600',
        color: '#6b7280',
        margin: '24px 0 16px 0',
        lineHeight: '1.25'
      },
      h6: { 
        fontSize: '13px', 
        fontWeight: '600',
        color: '#6b7280',
        margin: '24px 0 16px 0',
        lineHeight: '1.25'
      }
    },
    paragraph: {
      margin: '0 0 16px 0',
      lineHeight: '1.6',
      color: '#24292f'
    },
    link: {
      color: '#0969da',
      textDecoration: 'underline'
    },
    bold: {
      fontWeight: '600'
    },
    italic: {
      fontStyle: 'italic'
    },
    list: {
      margin: '0 0 16px 0',
      paddingLeft: '2em'
    },
    listItem: {
      margin: '0.25em 0'
    }
  }
};

// src/config/loader.ts
import { MarkdownConfig } from '../types';
import { DEFAULT_CONFIG } from './default';

export class ConfigLoader {
  private config: MarkdownConfig = DEFAULT_CONFIG;

  async loadConfig(configPath?: string): Promise<MarkdownConfig> {
    if (!configPath) {
      return this.config;
    }

    try {
      const response = await fetch(configPath);
      if (!response.ok) {
        console.warn(`Could not load config from ${configPath}, using default`);
        return this.config;
      }
      
      const userConfig = await response.json();
      this.config = this.mergeConfigs(DEFAULT_CONFIG, userConfig);
      return this.config;
    } catch (error) {
      console.warn(`Error loading config from ${configPath}:`, error);
      return this.config;
    }
  }

  private mergeConfigs(defaultConfig: MarkdownConfig, userConfig: Partial<MarkdownConfig>): MarkdownConfig {
    return {
      theme: userConfig.theme || defaultConfig.theme,
      styles: {
        ...defaultConfig.styles,
        ...userConfig.styles,
        heading: {
          ...defaultConfig.styles.heading,
          ...userConfig.styles?.heading
        }
      }
    };
  }

  getConfig(): MarkdownConfig {
    return this.config;
  }
}

// src/renderer/styles.ts
import { MarkdownConfig, StyleConfig } from '../types';

export const applyStyles = (config: MarkdownConfig) => {
  return {
    codeBlock: (config.styles.codeBlock || {}) as React.CSSProperties,
    inlineCode: (config.styles.inlineCode || {}) as React.CSSProperties,
    heading: {
      h1: (config.styles.heading?.h1 || {}) as React.CSSProperties,
      h2: (config.styles.heading?.h2 || {}) as React.CSSProperties,
      h3: (config.styles.heading?.h3 || {}) as React.CSSProperties,
      h4: (config.styles.heading?.h4 || {}) as React.CSSProperties,
      h5: (config.styles.heading?.h5 || {}) as React.CSSProperties,
      h6: (config.styles.heading?.h6 || {}) as React.CSSProperties,
    },
    paragraph: (config.styles.paragraph || {}) as React.CSSProperties,
    link: (config.styles.link || {}) as React.CSSProperties,
    bold: (config.styles.bold || {}) as React.CSSProperties,
    italic: (config.styles.italic || {}) as React.CSSProperties,
    list: (config.styles.list || {}) as React.CSSProperties,