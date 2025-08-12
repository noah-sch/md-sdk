import React from 'react';
import type { CodeBlockNode } from '../../types';

interface CodeBlockProps {
  node: CodeBlockNode;
  styles: React.CSSProperties;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ node, styles }) => {
  return (
    <pre style={styles}>
      <code>{node.value}</code>
    </pre>
  );
};