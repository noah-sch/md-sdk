export type inlineElements = 
    | { type: 'text'; content: string }
    | { type: 'code'; content: string }
    | { type: 'bold'; content: inlineElements[] }
    | { type: 'italic'; content: inlineElements[] }
    | { type: 'link'; content: inlineElements[]; href: string };