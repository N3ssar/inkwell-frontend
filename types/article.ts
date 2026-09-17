export type CoverFormat = {
  url: string;
  width: number;
  height: number;
};

export type Article = {
  id: number;
  Title: string;
  Description?: string;
  SLug: string;
  Covor?: {
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: CoverFormat;
      small?: CoverFormat;
      medium?: CoverFormat;
      large?: CoverFormat;
    };
  };
  category?: {
    id: number;
    Name: string;
    Description?: string;
  };
  users_permissions_user?: {
    id: number;
    username: string;
    email: string;
    Bio?: string;
  };
};

export type TextNode = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

export type LinkNode = {
  type: "link";
  url: string;
  children: TextNode[];
};

export type InlineNode = TextNode | LinkNode;

export type ParagraphBlock = { type: "paragraph"; children: InlineNode[] };
export type HeadingBlock   = { type: "heading"; level: 1|2|3|4|5|6; children: InlineNode[] };
export type QuoteBlock     = { type: "quote"; children: InlineNode[] };
export type CodeBlock      = { type: "code"; children: InlineNode[] };
export type ListItemBlock  = { type: "list-item"; children: InlineNode[] };
export type ListBlock      = { type: "list"; format: "ordered"|"unordered"; children: ListItemBlock[] };
export type ImageBlock     = {
  type: "image";
  image: { url: string; alternativeText?: string | null; width?: number; height?: number };
  children: InlineNode[];
};

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | QuoteBlock
  | CodeBlock
  | ListBlock
  | ImageBlock;

export type ArticleDetail = Article & {
  createdAt?: string;
  Content?: ContentBlock[];
};
