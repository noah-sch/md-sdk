import React from 'react';
import type { LinkNode } from '../../types';
import { MarkdownRenderer } from '../Renderer';

interface LinkProps {
  node: LinkNode;
  styles: React.CSSProperties;
  renderer: MarkdownRenderer;
}

export const Link: React.FC<LinkProps> = ({ node, styles, renderer }) => {
  return (
    <a href={node.url} title={node.title} style={styles}>
      {node.children.map((child, index) => 
        renderer.renderNode(child, index)
      )}
    </a>
  );
};