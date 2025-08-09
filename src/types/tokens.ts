

export const TokenType = {
  HEADING: 'HEADING',
  PARAGRAPH: 'PARAGRAPH',
  CODE_BLOCK: 'CODE_BLOCK',
  INLINE_CODE: 'INLINE_CODE',
  BOLD: 'BOLD',
  ITALIC: 'ITALIC',
  LINK: 'LINK',
  TEXT: 'TEXT',
  NEWLINE: 'NEWLINE',
  LIST_ITEM: 'LIST_ITEM',
  EOF: 'EOF'
} as const;

export type TokenType = typeof TokenType[keyof typeof TokenType];

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