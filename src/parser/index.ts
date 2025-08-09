import {
    type Token,
    TokenType,
    type MarkdownASTNode,
    type DocumentNode,
    type ASTNode
} from '../types';
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

        while (!this.isCompletelySeen()) {
            const node = this.parseNode();
            
            if (node) {
                children.push(node);
            }
        }

        return this.builder.createDocument(children);
    }

    private parseNode(): MarkdownASTNode | null {
        const token = this.pk();
        if (!token) {
            return null;
        }

        switch (token.type) {
            case TokenType.HEADING: 
                return this.parseHeading();
            case TokenType.CODE_BLOCK: 
                return this.parseCodeBlock();
            case TokenType.LIST_ITEM: 
                return this.parseListItem();
            case TokenType.NEWLINE: 
                this.advance();
                return null;
            default :
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

    private parseListItem(): MarkdownASTNode {
        const items: any[] = []; 
        
        while (this.pk()?.type === TokenType.LIST_ITEM) {
            const token = this.advance();
            const text = token.metadata?.text as string; 
            const children = this.parseInlineContent(text); 

            items.push(this.builder.createListItem(children));
        }

        return this.builder.createList(false, items);
    }

    private parseParagraph(): MarkdownASTNode {
        const tokens: Token[] = [];
        
        while (!this.isCompletelySeen() &&
            this.pk()?.type !== TokenType.HEADING &&
            this.pk()?.type !== TokenType.CODE_BLOCK &&
            this.pk()?.type !== TokenType.LIST_ITEM &&
            this.pk()?.type !== TokenType.NEWLINE
        ) {
            tokens.push(this.advance());
        }
        
        if (tokens.length === 0) {
            return this.builder.createText('');
        }

        const content = tokens.map(txt => txt.value).join('');
        const children = this.parseInlineContent(content);

        return this.builder.createParagraph(children);
    }

    private parseInlineContent(content: string): MarkdownASTNode[] {
        const children: MarkdownASTNode[] = [];
        let remaining = content;

        while (remaining.length > 0) {

            const inlineCodeMatch = remaining.match(/^`([^`]+)`/);
            if (inlineCodeMatch) {
                children.push(this.builder.createInlineCode(inlineCodeMatch[1]));
                remaining = remaining.slice(inlineCodeMatch[0].length);
                continue;
            }

            const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
            if (boldMatch) {
                children.push(this.builder.createBold([this.builder.createText(boldMatch[1])]));
                remaining = remaining.slice(boldMatch[0].length);
                continue;
            }

            const italicMatch = remaining.match(/^\*([^*]+)\*/);
            if (italicMatch) {
                children.push(this.builder.createItalic([this.builder.createText(italicMatch[1])]));
                remaining = remaining.slice(italicMatch[0].length);
                continue;
            }

            const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
                children.push(this.builder.createLink(
                    linkMatch[2],
                    [this.builder.createText(linkMatch[1])]
                ));
                remaining = remaining.slice(linkMatch[0].length);
                continue;
            }

            const textMatch = remaining.match(/^[^*`\[]+/);
            if (textMatch) {
                children.push(this.builder.createText(textMatch[0]));
                remaining = remaining.slice(textMatch[0].length);
            } else {
                children.push(this.builder.createText(remaining[0]));
                remaining.slice(1);
            }
        }

        return children;
    }

    private pk(): Token | null {
        return this.position < this.tokens.length ? this.tokens[this.position] : null; 
    }

    private advance() : Token {
        const token = this.tokens[this.position];
        this.position++;
        return token;
    }

    private isCompletelySeen(): boolean {
        const token = this.pk(); 
        return !token || token.type === TokenType.EOF;
    }
}