import type { inlineElements } from "../types/inlineElements";

function inlineParsing(line: string): inlineElements[] {
    let remaining: string = line; 
    let parsedLineElements: inlineElements[] = [];

    // Seekers

    const inlineCodeSeeker = (text: string): [inlineElements | null, string] => {
        const match: RegExpMatchArray | null = text.match(/^`([^`]+)`/);
        if (match) {
            return [{type: 'code', content: match[1]}, text.slice(match[0].length)];
        }
        return [null, text];
    };

    const boldSeekerRec = (text: string): [inlineElements | null, string] => {
        const match: RegExpMatchArray | null = text.match(/^\*\*([^*]+)\*\*/);
        if (match) {
            const content = inlineParsing(match[1]);
            return [{type: 'bold', content}, text.slice(match[0].length)];
        }
        return [null, text];
    };

    const italicSeekerRec = (text: string): [inlineElements | null, string] => {
        const match = text.match(/^\*([^*]+)\*/);
        if (match) {
            const content = inlineParsing(match[1]);
            return [{ type: 'italic', content }, text.slice(match[0].length)];
        }
        return [null, text];
    };

    const linkSeekerRec = (text: string): [inlineElements | null, string] => {
        const match = text.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
            const content = inlineParsing(match[1]);
            return [{ type: 'link', content, href: match[2] }, text.slice(match[0].length)];
        }
        return [null, text];
    };

    // Runing over the line 
    while (remaining.length > 0) {
        let result: [inlineElements | null, string];

        result = inlineCodeSeeker(remaining);
        if (result[0]) {
            parsedLineElements.push(result[0]);
            remaining = result[1];
            continue;
        }

        result = boldSeekerRec(remaining);
        if (result[0]) {
            parsedLineElements.push(result[0]);
            remaining = result[1];
            continue;
        }

        result = italicSeekerRec(remaining);
        if (result[0]) {
            parsedLineElements.push(result[0]);
            remaining = result[1];
            continue;
        }

        result = linkSeekerRec(remaining);
        if (result[0]) {
            parsedLineElements.push(result[0]);
            remaining = result[1];
            continue;
        }

        // Nothing found ? -> 
        const nextSpecialChar = remaining.search(/[`\[*]/);
        if (nextSpecialChar === -1) {
            parsedLineElements.push({ type: 'text', content: remaining }); 
            break; 
        } else if (nextSpecialChar > 0) {
            parsedLineElements.push({type: 'text', content: remaining.slice(0, nextSpecialChar) });
            remaining = remaining.slice(nextSpecialChar);
        } else {
            // DEBUG 
            parsedLineElements.push({ type: 'text', content: remaining[0] });
            remaining.slice(1);
        }
    }

    return parsedLineElements;
}

export default inlineParsing;