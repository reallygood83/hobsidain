export type LLMProvider = "openrouter" | "anthropic" | "openai" | "gemini" | "cerebras";

export interface HobsidainSettings {
  outputFolder: string;
  defaultTemplatePath: string;
  baseFontFamily: string;
  baseFontSize: number;
  lineSpacing: number;
  tableHeaderColor: string;
  tableHeaderTextColor: string;
  llmProvider: LLMProvider;
  llmModel: string;
}

export const DEFAULT_SETTINGS: HobsidainSettings = {
  outputFolder: "HWPX-Exports",
  defaultTemplatePath: "",
  baseFontFamily: "맑은 고딕",
  baseFontSize: 11,
  lineSpacing: 160,
  tableHeaderColor: "#2B579A",
  tableHeaderTextColor: "#FFFFFF",
  llmProvider: "openrouter",
  llmModel: "anthropic/claude-sonnet-4.5-20260215",

};

export interface InlineFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  highlightColor?: string;
}

export interface ParagraphStyle {
  alignment?: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";
  lineSpacing?: number;
  marginLeft?: number;
  marginRight?: number;
  indent?: number;
}

export interface TableCell {
  text: string;
  formatting?: InlineFormatting;
  backgroundColor?: string;
  colSpan?: number;
  rowSpan?: number;
}

export interface TableStyle {
  headerBackgroundColor?: string;
  headerTextColor?: string;
  headerBold?: boolean;
  alternateRowColor?: string;
  borderColor?: string;
  width?: number;
}

export type ContentBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; text: string; formatting?: InlineFormatting }
  | { type: "paragraph"; text: string; formatting?: InlineFormatting; paragraphStyle?: ParagraphStyle }
  | { type: "table"; headers: TableCell[]; rows: TableCell[][]; tableStyle?: TableStyle }
  | { type: "pagebreak" };

export const LLM_MODELS: Record<LLMProvider, string[]> = {
  openrouter: [
    "anthropic/claude-sonnet-4.5-20260215",
    "anthropic/claude-sonnet-4-20250514",
    "anthropic/claude-opus-4-20250514",
    "openai/gpt-5.2",
    "openai/gpt-4.1",
    "openai/o3-mini",
    "google/gemini-3-flash",
    "google/gemini-2.5-pro",
    "google/gemini-2.5-flash",
  ],
  anthropic: [
    "claude-sonnet-4.5-20260215",
    "claude-sonnet-4-20250514",
    "claude-opus-4-20250514",
  ],
  openai: [
    "gpt-5.2",
    "gpt-4.1",
    "o3-mini",
  ],
  gemini: [
    "gemini-3-flash",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
  ],
  cerebras: [
    "llama-4-scout-17b-16e-instruct",
    "llama3.3-70b",
    "qwen-3-32b",
    "llama3.1-8b",
  ],
};
