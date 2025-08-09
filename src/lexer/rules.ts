import { TokenType } from "../types";

export interface LexerRule {
    type: TokenType;
    pattern: RegExp;
    handler?: (match: RegExpMatchArray, input: string, position: number) => any;
}

export const LEXER_RULES: LexerRule[] = [

    // CODE BLOCK
    {
        type: TokenType.CODE_BLOCK,
        pattern: /^```(\w+)?\n([\s\S]*?)\n```/,
        handler: (match) => ({
            language: match[1] || '',
            code: match[2]
        })
    },

    // HEADING
    {
        type: TokenType.HEADING,
        pattern: /^(#{1,6})\s+(.+)$/,
        handler: (match) => ({
            level: match[1].length,
            text: match[2]
        })
    },

    // INLINE CODE 
    {
        type: TokenType.INLINE_CODE,
        pattern: /`([^`]+)`/,
        handler: (match) => ({
            code: match[1]
        })
    },

    // BOLD 
    {
        type: TokenType.BOLD,
        pattern: /\*\*([^*]+)\*\*/, 
        handler: (match) => ({
            text: match[1]
        })
    },

    // ITALIC 
    {
        type: TokenType.ITALIC,
        pattern: /\*([^*]+)\*/,
        handler: (match) => ({
            text: match[1]
        })
    },

    // LINKS 
    {
        type: TokenType.LINK,
        pattern: /\[([^\]]+)\]\(([^)]+)\)/,
        handler: (match) => ({
            text: match[1],
            url: match[2]
        })
    },

    // LIST ITEM
    {
        type: TokenType.LIST_ITEM,
        pattern: /^[-*+]\s+(.+)$/,
        handler: (match) => ({
            text: match[1]
        })
    },

    // NEW LINES 
    {
        type: TokenType.NEWLINE,
        pattern: /\n/
    },

    // TEXT (FALLBACK CASE)
    {
        type: TokenType.TEXT,
        pattern: /[^\n]+/
    }
]