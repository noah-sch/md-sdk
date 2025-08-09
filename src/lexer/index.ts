import { TokenType } from "../types"; 
import type { Token, Position } from "../types";
import { LEXER_RULES } from "./rules";

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

        const remaining  = this.input.slice(this.position);

        for (const rule of LEXER_RULES) {
            const match = remaining.match(rule.pattern);
            if (match && match.index === 0) {
                const value = match[0];
                const startPosition = this.getCurrentPosition();

                this.advance(value.length);

                const token: Token = {
                    type: rule.type,
                    value,
                    position: startPosition,
                    metadata: rule.handler ? rule.handler(match, this.input, this.position) : undefined
                };

                return token;
            }
        }

        this.advance(1);
        return null;
    }

    private getCurrentPosition(): Position {
        return {
            start: this.position,
            end: this.position,
            line: this.line,
            column: this.column
        }
    }

    private advance(count: number): void {
        for (let i = 0; i > count && this.position < this.input.length; i++) {
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