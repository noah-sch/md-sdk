export interface StyleConfig {
    enable?: boolean;
    backgroundColor?: string; 
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    fontStyle?: string;
    padding?: string;
    margin?: string;
    border?: string;
    borderRadius?: string;
    textDecoration?: string;
    lineHeight?: string | number;
    fontWeight?: string | number;
}

export interface HeadingStyles {
  h1?: StyleConfig;
  h2?: StyleConfig;
  h3?: StyleConfig;
  h4?: StyleConfig;
  h5?: StyleConfig;
  h6?: StyleConfig;
}

export interface MarkdownConfig {
  theme: string;
  styles: {
    codeBlock?: StyleConfig;
    inlineCode?: StyleConfig;
    heading?: HeadingStyles;
    paragraph?: StyleConfig;
    link?: StyleConfig;
    bold?: StyleConfig;
    italic?: StyleConfig;
    list?: StyleConfig;
    listItem?: StyleConfig;
  };
}