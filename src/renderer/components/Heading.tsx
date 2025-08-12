import React from "react";

type HeadingProps = {
    node: { level: number; children: any[] };
    styles?: React.CSSProperties;
    renderer: { renderNode: (node: any, index: number) => React.ReactNode };
};

export const Heading = ({ node, styles, renderer }: HeadingProps) => {
    const headings = [null, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
    const Tag = headings[node.level] ?? 'p';
    
    return <Tag style={styles}>{node.children.map((c, i) => renderer.renderNode(c, i))}</Tag>;
};

