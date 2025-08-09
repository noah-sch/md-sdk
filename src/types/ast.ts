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