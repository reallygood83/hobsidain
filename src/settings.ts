import { App, PluginSettingTab, Setting } from "obsidian";
import type HobsidainPlugin from "./main";
import { LLM_MODELS, type LLMProvider } from "./types";

export class HobsidainSettingTab extends PluginSettingTab {
  plugin: HobsidainPlugin;

  constructor(app: App, plugin: HobsidainPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "HWPX Export Settings" });

    new Setting(containerEl)
      .setName("Output folder")
      .setDesc("Folder where exported .hwpx files will be saved")
      .addText((text) =>
        text
          .setPlaceholder("HWPX-Exports")
          .setValue(this.plugin.settings.outputFolder)
          .onChange(async (value) => {
            this.plugin.settings.outputFolder = value || "HWPX-Exports";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Default template")
      .setDesc("Path to default .hwpx template file (leave empty for none)")
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.defaultTemplatePath)
          .onChange(async (value) => {
            this.plugin.settings.defaultTemplatePath = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: "Document Defaults" });

    new Setting(containerEl)
      .setName("Base font")
      .addDropdown((dropdown) =>
        dropdown
          .addOptions({
            "맑은 고딕": "맑은 고딕",
            "바탕": "바탕",
            "돋움": "돋움",
            "굴림": "굴림",
            "나눔고딕": "나눔고딕",
            "나눔명조": "나눔명조",
          })
          .setValue(this.plugin.settings.baseFontFamily)
          .onChange(async (value) => {
            this.plugin.settings.baseFontFamily = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Base font size (pt)")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.baseFontSize))
          .onChange(async (value) => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num > 0 && num <= 72) {
              this.plugin.settings.baseFontSize = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Line spacing (%)")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.lineSpacing))
          .onChange(async (value) => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num >= 100 && num <= 300) {
              this.plugin.settings.lineSpacing = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Table header color")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.tableHeaderColor)
          .onChange(async (value) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
              this.plugin.settings.tableHeaderColor = value;
              await this.plugin.saveSettings();
            }
          })
      );

    containerEl.createEl("h3", { text: "AI Settings" });

    new Setting(containerEl)
      .setName("LLM Provider")
      .addDropdown((dropdown) =>
        dropdown
          .addOptions({
            openrouter: "OpenRouter",
            anthropic: "Anthropic",
            openai: "OpenAI",
            gemini: "Google Gemini",
            cerebras: "Cerebras",
          })
          .setValue(this.plugin.settings.llmProvider)
          .onChange(async (value) => {
            this.plugin.settings.llmProvider = value as LLMProvider;
            const models = LLM_MODELS[this.plugin.settings.llmProvider];
            this.plugin.settings.llmModel = models[0] ?? "";
            await this.plugin.saveSettings();
            this.display();
          })
      );

    new Setting(containerEl)
      .setName("Model")
      .addDropdown((dropdown) => {
        const models = LLM_MODELS[this.plugin.settings.llmProvider];
        const options: Record<string, string> = {};
        for (const m of models) options[m] = m;
        dropdown
          .addOptions(options)
          .setValue(this.plugin.settings.llmModel)
          .onChange(async (value) => {
            this.plugin.settings.llmModel = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("API Key")
      .setDesc("Stored in plugin data (data.json)")
      .addText((text) => {
        text.inputEl.type = "password";
        text
          .setPlaceholder("Enter API key...")
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          });
      });
  }
}

export function getApiKey(plugin: HobsidainPlugin): string | null {
  return plugin.settings.apiKey || null;
}
