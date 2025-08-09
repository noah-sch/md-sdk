

export type TokenType =
  | 'HEADING'
  | 'PARAGRAPH'
  | 'CODE_BLOCK'
  | 'INLINE_CODE'
  | 'BOLD'
  | 'ITALIC'
  | 'TEXT'
  | 'NEWLINE'
  | 'LIST_ITEM'
  | 'EOF';

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