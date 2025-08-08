

function textBlockLineParsing(line: string): [string, string] {
    let parsedLine: [string, string] = ['text_line', line];

    // Title management  
    if (line.startsWith('# ')) {
        return ['#', line.slice(2)];
    }
    if (line.startsWith('## ')) {
        return ['##', line.slice(3)]; 
    }
    if (line.startsWith('### ')) {
        return ['###', line.slice(4)];
    }
    if (line.startsWith('#### ')) {
        return ['####', line.slice(5)];
    }
    if (line.startsWith('##### ')) {
        return ['#####', line.slice(6)];
    }
    if (line.startsWith('###### ')) {
        return ['######', line.slice(7)];
    }

    // Blockquotes management
    if (line.startsWith('> ')) {
        return ['>', line.slice(2)];
    }

    // Unordered lists management 
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
        return ['* ', line.slice(2)];
    }

    // Ordered lists management 
    // #TODO

    // Line management 
    if (line.trim() === '---' || line.trim() === '***') {
        return ['---', ''];
    }

    

    return parsedLine;
}

export default textBlockLineParsing;