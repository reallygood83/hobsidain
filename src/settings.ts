import { App, PluginSettingTab, Setting } from "obsidian";
import type HobsidainPlugin from "./main";
import { LLM_MODELS, type LLMProvider } from "./types";

const API_KEY_STORAGE_KEY = "hobsidain-api-key";

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

    const apiKeySetting = new Setting(containerEl)
      .setName("API Key")
      .setDesc("Stored securely in OS keychain via Obsidian Secret Storage");

    apiKeySetting.addText((text) => {
      text.inputEl.type = "password";
      text.setPlaceholder("Enter API key...");

      this.loadApiKey().then((key) => {
        if (key) text.setValue(key);
      });

      text.onChange(() => {});
      return text;
    });

    apiKeySetting.addButton((btn) =>
      btn.setButtonText("Save").onClick(async () => {
        const input = apiKeySetting.controlEl.querySelector("input");
        const value = input?.value ?? "";
        if (value) {
          await this.saveApiKey(value);
          this.plugin.showNotice("API key saved securely");
        }
      })
    );

    apiKeySetting.addButton((btn) =>
      btn.setButtonText("Delete").onClick(async () => {
        await this.deleteApiKey();
        const input = apiKeySetting.controlEl.querySelector("input");
        if (input) (input as HTMLInputElement).value = "";
        this.plugin.showNotice("API key deleted");
      })
    );

    containerEl.createEl("p", {
      text: "API key is stored securely in OS keychain via Obsidian's Secret Storage API.",
      cls: "setting-item-description",
    });
  }

  async loadApiKey(): Promise<string | null> {
    try {
      return await (this.app.vault as any).secretStorage?.get(API_KEY_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  async saveApiKey(key: string): Promise<void> {
    await (this.app.vault as any).secretStorage?.set(API_KEY_STORAGE_KEY, key);
  }

  async deleteApiKey(): Promise<void> {
    await (this.app.vault as any).secretStorage?.delete(API_KEY_STORAGE_KEY);
  }
}

export async function getApiKey(app: App): Promise<string | null> {
  try {
    return await (app.vault as any).secretStorage?.get(API_KEY_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}
