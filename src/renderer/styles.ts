import { list } from "postcss";
import type { MarkdownConfig, StyleConfig } from "../types";

export const applyStyles = (config: MarkdownConfig) => {
    return {
        codeBlock: (config.styles.codeBlock || {}) as React.CSSProperties,
        inlineCode: (config.styles.inlineCode || {}) as React.CSSProperties,
        heading: {
            h1: (config.styles.heading?.h1 || {}) as React.CSSProperties,
            h2: (config.styles.heading?.h2 || {}) as React.CSSProperties,
            h3: (config.styles.heading?.h3 || {}) as React.CSSProperties,
            h4: (config.styles.heading?.h4 || {}) as React.CSSProperties,
            h5: (config.styles.heading?.h5 || {}) as React.CSSProperties,
            h6: (config.styles.heading?.h6 || {}) as React.CSSProperties,
        },
        paragraph: (config.styles.paragraph || {}) as React.CSSProperties,
        link: (config.styles.link || {}) as React.CSSProperties,
        bold: (config.styles.bold || {}) as React.CSSProperties,
        italic: (config.styles.italic || {}) as React.CSSProperties,
        list: (config.styles.list || {}) as React.CSSProperties,
        listItems: (config.styles.listItem || {}) as React.CSSProperties,
    };
};