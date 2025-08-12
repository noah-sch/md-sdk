// src/renderer/Renderer.tsx
import React from 'react';
import type { 
  MarkdownASTNode,
  MarkdownConfig,
  HeadingNode,
  ParagraphNode,
  CodeBlockNode,
  InlineCodeNode,
  TextNode,
  BoldNode,
  ItalicNode,
  LinkNode,
  ListNode
} from '../types';
import { applyStyles } from './styles';
import { Heading } from './components/Heading';
import { CodeBlock } from './components/CodeBlock';
import { Paragraph } from './components/Paragraph';
import { List } from './components/List';
import { Link } from './components/Link';

export class MarkdownRenderer {
  private config: MarkdownConfig;
  private styles: ReturnType<typeof applyStyles>;

  constructor(config: MarkdownConfig) {
    this.config = config;
    this.styles = applyStyles(config);
  }

  render(ast: MarkdownASTNode): React.ReactNode {
    if (ast.type === 'document') {
      return (
        <div>
          {ast.children?.map((child, index) => 
            this.renderNode(child as MarkdownASTNode, index)
          )}
        </div>
      );
    }
    
    return this.renderNode(ast, 0);
  }

  renderNode(node: MarkdownASTNode, key: number): React.ReactNode {
    switch (node.type) {
      case 'heading':
        const headingNode = node as HeadingNode;
        const headingStyle = this.styles.heading[`h${headingNode.level}` as keyof typeof this.styles.heading];
        return <Heading key={key} node={headingNode} styles={headingStyle} renderer={this} />;

      case 'paragraph':
        return <Paragraph key={key} node={node as ParagraphNode} styles={this.styles.paragraph} renderer={this} />;

      case 'codeBlock':
        return <CodeBlock key={key} node={node as CodeBlockNode} styles={this.styles.codeBlock} />;

      case 'inlineCode':
        const inlineCodeNode = node as InlineCodeNode;
        return <code key={key} style={this.styles.inlineCode}>{inlineCodeNode.value}</code>;

      case 'text':
        const textNode = node as TextNode;
        return textNode.value;

      case 'bold':
        const boldNode = node as BoldNode;
        return (
          <strong key={key} style={this.styles.bold}>
            {boldNode.children?.map((child, index) => 
              this.renderNode(child as MarkdownASTNode, index)
            )}
          </strong>
        );

      case 'italic':
        const italicNode = node as ItalicNode;
        return (
          <em key={key} style={this.styles.italic}>
            {italicNode.children?.map((child, index) => 
              this.renderNode(child as MarkdownASTNode, index)
            )}
          </em>
        );

      case 'link':
        return <Link key={key} node={node as LinkNode} styles={this.styles.link} renderer={this} />;

      case 'list':
        return <List key={key} node={node as ListNode} styles={this.styles.list} itemStyles={this.styles.listItems} renderer={this} />;

      default:
        console.warn(`Unknown node type: ${node.type}`);
        return null;
    }
  }
}