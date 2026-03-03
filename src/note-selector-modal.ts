import { App, FuzzySuggestModal, TFile } from "obsidian";

export class NoteSelectorModal extends FuzzySuggestModal<TFile> {
  private selectedNotes: TFile[] = [];
  private onSubmit: (notes: TFile[]) => void;
  private multiSelect: boolean;

  constructor(app: App, onSubmit: (notes: TFile[]) => void, multiSelect = true) {
    super(app);
    this.onSubmit = onSubmit;
    this.multiSelect = multiSelect;
    this.setPlaceholder(
      multiSelect
        ? "Select notes to export (press Enter to add, Escape when done)"
        : "Select a note to export"
    );
  }

  getItems(): TFile[] {
    return this.app.vault.getMarkdownFiles();
  }

  getItemText(item: TFile): string {
    return item.path;
  }

  onChooseItem(item: TFile): void {
    if (this.multiSelect) {
      this.selectedNotes.push(item);
      this.setPlaceholder(
        `${this.selectedNotes.length} note(s) selected. Select more or press Escape to proceed.`
      );
    } else {
      this.onSubmit([item]);
    }
  }

  onClose(): void {
    if (this.multiSelect && this.selectedNotes.length > 0) {
      this.onSubmit(this.selectedNotes);
    }
  }
}
