import type {
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
    ListItemNode,
    ListNode,
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