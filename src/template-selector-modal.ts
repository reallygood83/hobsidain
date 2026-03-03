import { App, FuzzySuggestModal, TFile } from "obsidian";

export class TemplateSelectorModal extends FuzzySuggestModal<TFile | null> {
  private onSubmit: (template: TFile | null) => void;

  constructor(app: App, onSubmit: (template: TFile | null) => void) {
    super(app);
    this.onSubmit = onSubmit;
    this.setPlaceholder("Select a .hwpx template or press Escape for auto-generate");
  }

  getItems(): (TFile | null)[] {
    const hwpxFiles = this.app.vault.getFiles().filter((f) => f.extension === "hwpx");
    return [null, ...hwpxFiles];
  }

  getItemText(item: TFile | null): string {
    if (item === null) return "[Auto-generate without template]";
    return item.path;
  }

  onChooseItem(item: TFile | null): void {
    this.onSubmit(item);
  }
}
