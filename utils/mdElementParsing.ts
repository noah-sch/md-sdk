import type { TextBlock } from '../types/textBlock';
import type { CodeBlock } from '../types/codeBlock';
import type { mdElements } from '../types/mdElements';


function mdElementParsing(markdown: string): mdElements {
    const lines: string[] = markdown.split('\n');
    let textBlock: TextBlock = {type: 'text'};
    let codeBlock: CodeBlock = {type: 'code'};
    let intraCodeBlock: boolean = false;
    let elements: mdElements = []; 
    let key: number = 0;

    // Loop on all lines
    for (let line of lines) {
        if (line.startsWith('```')){
            if (intraCodeBlock) {
                elements.push(codeBlock);
                textBlock = {type: 'text'};
            } else {
                elements.push(textBlock);
                codeBlock = {type: 'code', language: line.slice(3).trim()};
            }
            intraCodeBlock = !intraCodeBlock;

        } else {
            if (intraCodeBlock) {
                codeBlock[key] = line;
            } else {
                textBlock[key] = line;
            }
            key++; 

        }
    }

    return elements;
}

export default mdElementParsing;