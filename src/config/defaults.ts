import type { MarkdownConfig } from "../types";

export const DEFAULT_CONFIG: MarkdownConfig = {
    theme: 'default',
    styles: {
        codeBlock: {
            backgroundColor: '#f6f8fa',
            border: '1px solid #e1e4e8',
            borderRadius: '6px',
            padding: '16px',
            fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
            fontSize: '14px',
            lineHeight: '1.45',
            color: '#24292f'
        },
        inlineCode: {
            backgroundColor: 'rgba(175,184,193,0.2)',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
            fontSize: '85%'
        },
        heading: {
            h1: { 
                fontSize: '32px', 
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 16px 0',
                lineHeight: '1.25'
            },
            h2: { 
                fontSize: '24px', 
                fontWeight: '600',
                color: '#374151',
                margin: '24px 0 16px 0',
                lineHeight: '1.25'
            },
            h3: { 
                fontSize: '20px', 
                fontWeight: '600',
                color: '#4b5563',
                margin: '24px 0 16px 0',
                lineHeight: '1.25'
            },
            h4: { 
                fontSize: '16px', 
                fontWeight: '600',
                color: '#6b7280',
                margin: '24px 0 16px 0',
                lineHeight: '1.25'
            },
            h5: { 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#6b7280',
                margin: '24px 0 16px 0',
                lineHeight: '1.25'
            },
            h6: { 
                fontSize: '13px', 
                fontWeight: '600',
                color: '#6b7280',
                margin: '24px 0 16px 0',
                lineHeight: '1.25'
            }
        },
        paragraph: {
            margin: '0 0 16px 0',
            lineHeight: '1.6',
            color: '#24292f'
        },
        link: {
            color: '#0969da',
            textDecoration: 'underline'
        },
        bold: {
            fontWeight: '600'
        },
        italic: {
            fontStyle: 'italic'
        },
        list: {
            margin: '0 0 16px 0'
        },
        listItem: {
            margin: '0.25em 0'
        }
    }
};