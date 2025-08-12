import React from 'react';
import type { ParagraphNode } from '../../types';
import { MarkdownRenderer } from '../Renderer';

interface ParagraphProps {
  node: ParagraphNode;
  styles: React.CSSProperties;
  renderer: MarkdownRenderer;
}

export const Paragraph: React.FC<ParagraphProps> = ({ node, styles, renderer }) => {
  return (
    <p style={styles}>
      {node.children.map((child, index) => 
        renderer.renderNode(child, index)
      )}
    </p>
  );
};