// src/MarkdownRenderer.tsx
import React, { useState, useEffect } from 'react';
import { MarkdownLexer } from './lexer';
import { MarkdownParser } from './parser';
import { MarkdownRenderer as Renderer } from './renderer/Renderer';
import { ConfigLoader } from './config/loader';
import type { MarkdownConfig, DocumentNode } from './types';
import { DEFAULT_CONFIG } from './config/defaults';

interface MarkdownRendererProps {
  content: string;
  configPath?: string;
  config?: Partial<MarkdownConfig>;
  className?: string;
  style?: React.CSSProperties;
  onError?: (error: Error) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  configPath,
  config: userConfig,
  className,
  style,
  onError
}) => {
  const [config, setConfig] = useState<MarkdownConfig>(DEFAULT_CONFIG);
  const [ast, setAst] = useState<DocumentNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfigAndParse = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load configuration
        const configLoader = new ConfigLoader();
        let loadedConfig = DEFAULT_CONFIG;

        if (configPath) {
          loadedConfig = await configLoader.loadConfig(configPath);
        }

        // Merge with user-provided config
        if (userConfig) {
          loadedConfig = {
            theme: userConfig.theme || loadedConfig.theme,
            styles: {
              ...loadedConfig.styles,
              ...userConfig.styles,
              heading: {
                ...loadedConfig.styles.heading,
                ...userConfig.styles?.heading
              }
            }
          };
        }

        setConfig(loadedConfig);

        // Parse markdown
        const lexer = new MarkdownLexer(content);
        const tokens = lexer.tokenize();
        
        const parser = new MarkdownParser(tokens);
        const parsedAst = parser.parse();
        
        setAst(parsedAst);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while parsing markdown';
        setError(errorMessage);
        
        if (onError && err instanceof Error) {
          onError(err);
        } else {
          console.error('Error parsing markdown:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (content) {
      loadConfigAndParse();
    } else {
      setLoading(false);
      setAst(null);
    }
  }, [content, configPath, userConfig, onError]);

  if (loading) {
    return (
      <div className={className} style={style}>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className} style={style}>
        <div style={{ 
          padding: '20px', 
          color: '#dc2626', 
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!content || !ast) {
    return (
      <div className={className} style={style}>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No content to render
        </div>
      </div>
    );
  }

  const renderer = new Renderer(config);
  
  return (
    <div className={`markdown-content ${className || ''}`} style={style}>
      {renderer.render(ast)}
    </div>
  );
};

export default MarkdownRenderer;