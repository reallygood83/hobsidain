import {
  HwpxDocument,
  setSkeletonHwpx,
} from "@masteroflearning/hwpxcore";
import type { HwpxOxmlTable } from "@masteroflearning/hwpxcore";
import { getSkeletonBytes } from "./skeleton-data";
import type {
  ContentBlock,
  InlineFormatting,
  ParagraphStyle,
  HobsidainSettings,
} from "./types";

const HEADING_FONT_SIZES: Record<number, number> = {
  1: 22, 2: 18, 3: 14, 4: 12, 5: 11, 6: 10,
};

function ensureRunStyleFromFormatting(
  doc: HwpxDocument,
  formatting: InlineFormatting | undefined,
): string | undefined {
  if (!formatting) return undefined;
  const hasAny =
    formatting.bold != null || formatting.italic != null ||
    formatting.underline != null || formatting.strikethrough != null ||
    formatting.fontSize != null || formatting.fontFamily != null ||
    formatting.textColor != null || formatting.highlightColor != null;
  if (!hasAny) return undefined;
  return doc.ensureRunStyle({
    bold: formatting.bold,
    italic: formatting.italic,
    underline: formatting.underline,
    strikethrough: formatting.strikethrough,
    fontSize: formatting.fontSize,
    fontFamily: formatting.fontFamily,
    textColor: formatting.textColor,
    highlightColor: formatting.highlightColor,
  });
}

function ensureParaStyleFromStyle(
  doc: HwpxDocument,
  style: ParagraphStyle | undefined,
): string | undefined {
  if (!style) return undefined;
  const hasAny =
    style.alignment != null || style.lineSpacing != null ||
    style.marginLeft != null || style.marginRight != null ||
    style.indent != null;
  if (!hasAny) return undefined;
  return doc.ensureParaStyle({
    alignment: style.alignment,
    lineSpacingValue: style.lineSpacing,
    marginLeft: style.marginLeft,
    marginRight: style.marginRight,
    indent: style.indent,
  });
}

function applyCellBackground(doc: HwpxDocument, table: HwpxOxmlTable, row: number, col: number, bgColor: string): void {
  const borderFillId = doc.oxml.ensureBorderFillStyle({ backgroundColor: bgColor });
  table.cell(row, col).borderFillIDRef = borderFillId;
}

function applyCellFormatting(
  doc: HwpxDocument,
  table: HwpxOxmlTable,
  row: number,
  col: number,
  text: string,
  formatting?: InlineFormatting,
): void {
  const charPrIdRef = ensureRunStyleFromFormatting(doc, formatting);
  table.setCellText(row, col, text);
  if (charPrIdRef) {
    const cell = table.cell(row, col);
    const elements = cell.element.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el && (el.localName === "run" || el.tagName?.endsWith(":run"))) {
        el.setAttribute("charPrIDRef", charPrIdRef);
        break;
      }
    }
  }
}

function stripInlineMarkers(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/~~(.+?)~~/g, "$1");
}

function parseTableLine(line: string): string[] {
  return line.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
}

function isSeparatorLine(line: string): boolean {
  return /^\|?\s*[-:]+[-|:\s]*\|?\s*$/.test(line);
}

export function markdownToBlocks(
  markdown: string,
  settings: HobsidainSettings,
): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = markdown.split("\n");

  const baseFormatting: InlineFormatting = {
    fontSize: settings.baseFontSize,
    fontFamily: settings.baseFontFamily,
  };
  const baseParagraphStyle: ParagraphStyle = {
    lineSpacing: settings.lineSpacing,
  };

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i]!.trim();

    if (trimmed === "") { i++; continue; }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: "pagebreak" });
      i++; continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]!.length as 1 | 2 | 3 | 4 | 5 | 6;
      blocks.push({
        type: "heading",
        level,
        text: stripInlineMarkers(headingMatch[2]!),
        formatting: {
          bold: true,
          fontSize: HEADING_FONT_SIZES[level] ?? 12,
          fontFamily: settings.baseFontFamily,
        },
      });
      i++; continue;
    }

    if (trimmed.startsWith("|") && i + 1 < lines.length && isSeparatorLine(lines[i + 1]!.trim())) {
      const headerCells = parseTableLine(trimmed);
      i += 2;
      const rows: { text: string }[][] = [];
      while (i < lines.length && lines[i]!.trim().startsWith("|")) {
        rows.push(parseTableLine(lines[i]!.trim()).map((t) => ({ text: stripInlineMarkers(t) })));
        i++;
      }
      blocks.push({
        type: "table",
        headers: headerCells.map((t) => ({
          text: stripInlineMarkers(t),
          backgroundColor: settings.tableHeaderColor,
          formatting: { bold: true, textColor: settings.tableHeaderTextColor },
        })),
        rows,
        tableStyle: {
          headerBackgroundColor: settings.tableHeaderColor,
          headerTextColor: settings.tableHeaderTextColor,
          headerBold: true,
        },
      });
      continue;
    }

    const ulMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (ulMatch) {
      blocks.push({
        type: "paragraph",
        text: "\u2022 " + stripInlineMarkers(ulMatch[1]!),
        formatting: baseFormatting,
        paragraphStyle: baseParagraphStyle,
      });
      i++; continue;
    }

    const olMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (olMatch) {
      blocks.push({
        type: "paragraph",
        text: `${olMatch[1]}. ${stripInlineMarkers(olMatch[2]!)}`,
        formatting: baseFormatting,
        paragraphStyle: baseParagraphStyle,
      });
      i++; continue;
    }

    const bqMatch = trimmed.match(/^>\s*(.*)$/);
    if (bqMatch) {
      blocks.push({
        type: "paragraph",
        text: stripInlineMarkers(bqMatch[1] ?? ""),
        formatting: { ...baseFormatting, italic: true },
        paragraphStyle: { ...baseParagraphStyle, marginLeft: 800 },
      });
      i++; continue;
    }

    blocks.push({
      type: "paragraph",
      text: stripInlineMarkers(trimmed),
      formatting: baseFormatting,
      paragraphStyle: baseParagraphStyle,
    });
    i++;
  }

  return blocks;
}

export async function blocksToHwpxBuffer(blocks: ContentBlock[]): Promise<Uint8Array> {
  const skeleton = getSkeletonBytes();
  setSkeletonHwpx(skeleton);
  const doc = await HwpxDocument.open(skeleton);

  for (const block of blocks) {
    switch (block.type) {
      case "heading": {
        const level = block.level;
        const mergedFormatting: InlineFormatting = {
          bold: true,
          fontSize: HEADING_FONT_SIZES[level] ?? 12,
          ...block.formatting,
        };
        const charPrIdRef = ensureRunStyleFromFormatting(doc, mergedFormatting);
        doc.addParagraph(block.text, { styleIdRef: String(level), charPrIdRef });
        break;
      }

      case "paragraph": {
        const charPrIdRef = ensureRunStyleFromFormatting(doc, block.formatting);
        const paraPrIdRef = ensureParaStyleFromStyle(doc, block.paragraphStyle);
        doc.addParagraph(block.text, { charPrIdRef, paraPrIdRef });
        break;
      }

      case "table": {
        const totalRows = (block.headers.length > 0 ? 1 : 0) + block.rows.length;
        const totalCols = block.headers.length > 0
          ? block.headers.length
          : (block.rows[0]?.length ?? 0);
        if (totalRows === 0 || totalCols === 0) break;

        const para = doc.addParagraph("");
        const table = para.addTable(totalRows, totalCols, { width: block.tableStyle?.width });
        let rowOffset = 0;

        if (block.headers.length > 0) {
          for (let c = 0; c < block.headers.length; c++) {
            const cell = block.headers[c]!;
            const cellFormatting: InlineFormatting = {
              ...(block.tableStyle?.headerBold !== false ? { bold: true } : {}),
              ...(block.tableStyle?.headerTextColor ? { textColor: block.tableStyle.headerTextColor } : {}),
              ...cell.formatting,
            };
            applyCellFormatting(doc, table, 0, c, cell.text, cellFormatting);
            const bgColor = cell.backgroundColor ?? block.tableStyle?.headerBackgroundColor;
            if (bgColor) applyCellBackground(doc, table, 0, c, bgColor);
          }
          rowOffset = 1;
        }

        for (let r = 0; r < block.rows.length; r++) {
          const row = block.rows[r]!;
          const tableRowIndex = r + rowOffset;
          for (let c = 0; c < row.length; c++) {
            const cell = row[c]!;
            applyCellFormatting(doc, table, tableRowIndex, c, cell.text, cell.formatting);
            let bgColor = cell.backgroundColor;
            if (!bgColor && block.tableStyle?.alternateRowColor && r % 2 === 1) {
              bgColor = block.tableStyle.alternateRowColor;
            }
            if (bgColor) applyCellBackground(doc, table, tableRowIndex, c, bgColor);
          }
        }
        break;
      }

      case "pagebreak": {
        const para = doc.addParagraph("");
        para.pageBreak = true;
        break;
      }
    }
  }

  const buffer = await doc.saveToBuffer();
  doc.close();
  return buffer;
}

export async function convertMarkdownToHwpx(
  markdown: string,
  settings: HobsidainSettings,
): Promise<Uint8Array> {
  const blocks = markdownToBlocks(markdown, settings);
  return blocksToHwpxBuffer(blocks);
}
