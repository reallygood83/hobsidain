import { requestUrl } from "obsidian";
import type { ContentBlock, HobsidainSettings, LLMProvider } from "./types";

const FORMATTING_SYSTEM_PROMPT = `You are a Korean document formatting expert.
Given markdown notes, produce a structured JSON array of ContentBlocks for HWPX document generation.

You MUST decide appropriate formatting:
- Heading font sizes (H1: 20-24pt, H2: 16-18pt, H3: 13-15pt)
- Body text size (10-12pt)
- Bold for emphasis, key terms, table headers
- Table header background color (professional: #2B579A, #1A5276, #4472C4)
- Table header text color (#FFFFFF for dark backgrounds)
- Alternating row colors for readability (#F2F2F2 or #F5F5F5)
- Cell background colors for status/progress indicators:
  - Green (#E8F5E9) for complete/positive
  - Yellow (#FFF3E0) for in-progress/warning
  - Red (#FFEBEE) for critical/negative
- Paragraph alignment (CENTER for titles, JUSTIFY for body)
- Line spacing (150-180 for readability)

Output ONLY a valid JSON object with a "blocks" key containing an array of ContentBlock objects.

ContentBlock types:
- { "type": "heading", "level": 1-6, "text": "...", "formatting": { "bold": true, "fontSize": 22, "fontFamily": "맑은 고딕" } }
- { "type": "paragraph", "text": "...", "formatting": { "fontSize": 11 }, "paragraphStyle": { "lineSpacing": 160 } }
- { "type": "table", "headers": [{ "text": "...", "backgroundColor": "#2B579A", "formatting": { "textColor": "#FFFFFF", "bold": true } }], "rows": [[{ "text": "..." }]], "tableStyle": { "alternateRowColor": "#F5F5F5" } }
- { "type": "pagebreak" }`;

interface LLMEndpointConfig {
  url: string;
  headers: Record<string, string>;
  bodyTransform: (model: string, messages: { role: string; content: string }[]) => unknown;
  parseResponse: (data: unknown) => string;
}

function getEndpointConfig(provider: LLMProvider, apiKey: string): LLMEndpointConfig {
  switch (provider) {
    case "openrouter":
      return {
        url: "https://openrouter.ai/api/v1/chat/completions",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/reallygood83/hobsidain",
          "X-Title": "hobsidain",
        },
        bodyTransform: (model, messages) => ({
          model,
          messages,
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
        parseResponse: (data: any) => data.choices?.[0]?.message?.content ?? "",
      };

    case "anthropic":
      return {
        url: "https://api.anthropic.com/v1/messages",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        bodyTransform: (model, messages) => {
          const systemMsg = messages.find((m) => m.role === "system");
          const userMsgs = messages.filter((m) => m.role !== "system");
          return {
            model,
            max_tokens: 8192,
            system: systemMsg?.content ?? "",
            messages: userMsgs.map((m) => ({ role: m.role, content: m.content })),
          };
        },
        parseResponse: (data: any) => {
          const content = data.content;
          if (Array.isArray(content)) {
            const textBlock = content.find((b: any) => b.type === "text");
            return textBlock?.text ?? "";
          }
          return "";
        },
      };

    case "openai":
      return {
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        bodyTransform: (model, messages) => ({
          model,
          messages,
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
        parseResponse: (data: any) => data.choices?.[0]?.message?.content ?? "",
      };
  }
}

function extractJsonFromResponse(text: string): ContentBlock[] {
  const trimmed = text.trim();
  let parsed: any;

  try {
    parsed = JSON.parse(trimmed);
  } catch {
    const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1]!.trim());
    } else {
      throw new Error("LLM response is not valid JSON");
    }
  }

  if (Array.isArray(parsed)) return parsed;
  if (parsed.blocks && Array.isArray(parsed.blocks)) return parsed.blocks;
  throw new Error("LLM response does not contain a blocks array");
}

export async function generateFormattedBlocks(
  noteContents: string[],
  settings: HobsidainSettings,
  apiKey: string,
): Promise<ContentBlock[]> {
  const config = getEndpointConfig(settings.llmProvider, apiKey);

  const userContent = noteContents.length === 1
    ? `Convert this note to a professionally formatted HWPX document:\n\n${noteContents[0]}`
    : `Convert these ${noteContents.length} notes into a single professionally formatted HWPX document:\n\n${noteContents.map((c, i) => `--- Note ${i + 1} ---\n${c}`).join("\n\n")}`;

  const messages = [
    { role: "system", content: FORMATTING_SYSTEM_PROMPT },
    { role: "user", content: userContent },
  ];

  const body = config.bodyTransform(settings.llmModel, messages);

  const response = await requestUrl({
    url: config.url,
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(body),
  });

  if (response.status !== 200) {
    throw new Error(`LLM API error (${response.status}): ${response.text}`);
  }

  const responseText = config.parseResponse(response.json);
  return extractJsonFromResponse(responseText);
}
