import React from 'react';
import type { ListNode, ListItemNode } from '../../types';
import { MarkdownRenderer } from '../Renderer';

interface ListProps {
  node: ListNode;
  styles: React.CSSProperties;
  itemStyles: React.CSSProperties;
  renderer: MarkdownRenderer;
}

export const List: React.FC<ListProps> = ({ node, styles, itemStyles, renderer }) => {
  const Tag = node.ordered ? 'ol' : 'ul';
  
  return (
    <Tag style={styles}>
      {node.children.map((item, index) => (
        <li key={index} style={itemStyles}>
          {item.children.map((child, childIndex) => 
            renderer.renderNode(child, childIndex)
          )}
        </li>
      ))}
    </Tag>
  );
};