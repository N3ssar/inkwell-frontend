import React from "react";
import { ContentBlock, InlineNode } from "@/types/article";

function renderInline(nodes: InlineNode[], keyPrefix: string): React.ReactNode {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}-${i}`;

    if (node.type === "link") {
      return (
        <a key={key} href={node.url} target="_blank" rel="noopener noreferrer">
          {renderInline(node.children, key)}
        </a>
      );
    }

    // text node — apply modifiers bottom-up
    let el: React.ReactNode = node.text;
    if (node.code)          el = <code key={`${key}-c`}>{el}</code>;
    if (node.bold)          el = <strong key={`${key}-b`}>{el}</strong>;
    if (node.italic)        el = <em key={`${key}-i`}>{el}</em>;
    if (node.underline)     el = <u key={`${key}-u`}>{el}</u>;
    if (node.strikethrough) el = <s key={`${key}-s`}>{el}</s>;

    return <span key={key}>{el}</span>;
  });
}

interface ArticleBlocksProps {
  blocks?: ContentBlock[];
  apiBase?: string;
}

export default function ArticleBlocks({ blocks, apiBase = "" }: ArticleBlocksProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, i) => {
        const key = `block-${i}`;

        switch (block.type) {
          case "paragraph": {
            const text = block.children.map((c) => ("text" in c ? c.text : "")).join("");
            if (!text.trim()) return null; // skip empty paragraphs
            return <p key={key}>{renderInline(block.children, key)}</p>;
          }

          case "heading": {
            const Tag = `h${block.level}` as React.ElementType;
            return <Tag key={key}>{renderInline(block.children, key)}</Tag>;
          }

          case "quote":
            return (
              <blockquote key={key}>
                {renderInline(block.children, key)}
              </blockquote>
            );

          case "code":
            return (
              <pre key={key}>
                <code>{block.children.map((c) => ("text" in c ? c.text : "")).join("")}</code>
              </pre>
            );

          case "list": {
            const Tag = block.format === "ordered" ? "ol" : "ul";
            return (
              <Tag key={key}>
                {block.children.map((item, j) => (
                  <li key={`${key}-${j}`}>{renderInline(item.children, `${key}-${j}`)}</li>
                ))}
              </Tag>
            );
          }

          case "image": {
            const src = block.image.url.startsWith("http")
              ? block.image.url
              : `${apiBase}${block.image.url}`;
            return (
              <img
                key={key}
                src={src}
                alt={block.image.alternativeText ?? ""}
                width={block.image.width}
                height={block.image.height}
              />
            );
          }

          default:
            return null;
        }
      })}
    </>
  );
}
