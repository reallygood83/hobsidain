import { Notice, Plugin, TFile } from "obsidian";
import { DEFAULT_SETTINGS, type HobsidainSettings } from "./types";
import { HobsidainSettingTab, getApiKey } from "./settings";
import { convertMarkdownToHwpx, blocksToHwpxBuffer } from "./converter";
import { generateFormattedBlocks } from "./llm-client";
import { NoteSelectorModal } from "./note-selector-modal";
import { TemplateSelectorModal } from "./template-selector-modal";

export default class HobsidainPlugin extends Plugin {
  settings: HobsidainSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new HobsidainSettingTab(this.app, this));

    this.addRibbonIcon("file-output", "Export to HWPX", async () => {
      await this.exportCurrentNote();
    });

    this.addCommand({
      id: "export-to-hwpx",
      name: "Export to HWPX",
      callback: async () => { await this.exportCurrentNote(); },
    });

    this.addCommand({
      id: "export-to-hwpx-with-template",
      name: "Export to HWPX (with template)",
      callback: async () => { await this.exportWithTemplate(); },
    });

    this.addCommand({
      id: "export-multiple-to-hwpx",
      name: "Export multiple notes to HWPX",
      callback: async () => {
        new NoteSelectorModal(this.app, async (notes) => {
          await this.exportNotes(notes);
        }).open();
      },
    });

    this.addCommand({
      id: "ai-assisted-hwpx-export",
      name: "AI-assisted HWPX export",
      callback: async () => { await this.aiAssistedExport(); },
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  showNotice(message: string) {
    new Notice(message);
  }

  private async exportCurrentNote() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile || activeFile.extension !== "md") {
      this.showNotice("No active markdown file");
      return;
    }

    try {
      const content = await this.app.vault.read(activeFile);
      const buffer = await convertMarkdownToHwpx(content, this.settings);
      const outputPath = this.getOutputPath(activeFile.basename);
      await this.saveHwpxToVault(outputPath, buffer);
      this.showNotice(`Exported: ${outputPath}`);
    } catch (e) {
      this.showNotice(`Export failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  private async exportWithTemplate() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile || activeFile.extension !== "md") {
      this.showNotice("No active markdown file");
      return;
    }

    new TemplateSelectorModal(this.app, async (template) => {
      if (template) {
        this.showNotice("Template-based export is not yet supported for .hwpx templates in-vault. Use direct export.");
        return;
      }
      await this.exportCurrentNote();
    }).open();
  }

  private async exportNotes(notes: TFile[]) {
    if (notes.length === 0) {
      this.showNotice("No notes selected");
      return;
    }

    try {
      const contents: string[] = [];
      for (const note of notes) {
        contents.push(await this.app.vault.read(note));
      }
      const combined = contents.join("\n\n---\n\n");
      const buffer = await convertMarkdownToHwpx(combined, this.settings);
      const name = notes.length === 1 ? notes[0]!.basename : `combined-${notes.length}-notes`;
      const outputPath = this.getOutputPath(name);
      await this.saveHwpxToVault(outputPath, buffer);
      this.showNotice(`Exported ${notes.length} note(s): ${outputPath}`);
    } catch (e) {
      this.showNotice(`Export failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  private async aiAssistedExport() {
    const apiKey = getApiKey(this);
    if (!apiKey) {
      this.showNotice("Please set your API key in HWPX Export settings");
      return;
    }

    new NoteSelectorModal(this.app, async (notes) => {
      if (notes.length === 0) return;

      this.showNotice("Generating formatted document with AI...");

      try {
        const contents: string[] = [];
        for (const note of notes) {
          contents.push(await this.app.vault.read(note));
        }

        const blocks = await generateFormattedBlocks(contents, this.settings, apiKey);
        const buffer = await blocksToHwpxBuffer(blocks);
        const name = notes.length === 1 ? notes[0]!.basename : `ai-formatted-${notes.length}-notes`;
        const outputPath = this.getOutputPath(name);
        await this.saveHwpxToVault(outputPath, buffer);
        this.showNotice(`AI export complete: ${outputPath}`);
      } catch (e) {
        this.showNotice(`AI export failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    }).open();
  }

  private getOutputPath(baseName: string): string {
    const folder = this.settings.outputFolder || "HWPX-Exports";
    return `${folder}/${baseName}.hwpx`;
  }

  private async saveHwpxToVault(path: string, buffer: Uint8Array): Promise<void> {
    const folder = path.substring(0, path.lastIndexOf("/"));
    if (folder && !this.app.vault.getAbstractFileByPath(folder)) {
      await this.app.vault.createFolder(folder);
    }
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof TFile) {
      await this.app.vault.modifyBinary(existing, buffer.buffer as ArrayBuffer);
    } else {
      await this.app.vault.createBinary(path, buffer.buffer as ArrayBuffer);
    }
  }
}
