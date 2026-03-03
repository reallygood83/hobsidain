/**
 * HWPX OPC-style package handling.
 * Ported from Python hwpx/package.py - uses JSZip for async ZIP I/O.
 */
interface RootFile {
    fullPath: string;
    mediaType: string | null;
}
declare class HwpxPackage {
    static readonly MIMETYPE_PATH = "mimetype";
    static readonly CONTAINER_PATH = "META-INF/container.xml";
    static readonly MANIFEST_PATH = "Contents/content.hpf";
    static readonly HEADER_PATH = "Contents/header.xml";
    static readonly VERSION_PATH = "version.xml";
    private static _warningHandler;
    private _parts;
    private _manifestTree;
    private _spineCache;
    private _sectionPathsCache;
    private _headerPathsCache;
    private _masterPagePathsCache;
    private _historyPathsCache;
    private _versionPathCache;
    private _versionPathCacheResolved;
    private _rootfilesCache;
    private _closed;
    constructor(parts: Map<string, Uint8Array>);
    static setWarningHandler(handler: ((message: string) => void) | null): void;
    private _warn;
    private _validateOpenStructure;
    private _assertOpen;
    get closed(): boolean;
    close(): void;
    /** Open an HWPX package from a Uint8Array or ArrayBuffer. */
    static open(source: Uint8Array | ArrayBuffer): Promise<HwpxPackage>;
    partNames(): string[];
    toJSON(): {
        partCount: number;
        sectionCount: number;
        headerCount: number;
        hasManifest: boolean;
        hasMimetype: boolean;
    };
    toString(): string;
    hasPart(partName: string): boolean;
    getPart(partName: string): Uint8Array;
    setPart(partName: string, payload: Uint8Array | string): void;
    getXml(partName: string): Element;
    setXml(partName: string, element: Element): void;
    getText(partName: string): string;
    rootfiles(): RootFile[];
    mainRootFile(): RootFile;
    private manifestTree;
    private manifestItems;
    private resolveManifestHref;
    private resolveSpinePaths;
    sectionPaths(): string[];
    headerPaths(): string[];
    masterPagePaths(): string[];
    historyPaths(): string[];
    versionPath(): string | null;
    /**
     * Add a binary item (image, etc.) to the package.
     * Stores the data in BinData/ and registers it in the manifest.
     * Returns the binaryItemIDRef to use in <hc:img>.
     */
    addBinaryItem(data: Uint8Array, opts: {
        mediaType: string;
        extension?: string;
    }): string;
    save(updates?: Record<string, Uint8Array | string>): Promise<Uint8Array>;
}

interface BorderStyle {
    type: string;
    width: string;
    color: string;
}
interface BorderFillInfo {
    left: BorderStyle;
    right: BorderStyle;
    top: BorderStyle;
    bottom: BorderStyle;
    diagonal: BorderStyle;
    backgroundColor: string | null;
}

/**
 * Type definitions and helper functions for the HWPX OXML document model.
 */
interface PageSize {
    width: number;
    height: number;
    orientation: string;
    gutterType: string;
}
interface PageMargins {
    left: number;
    right: number;
    top: number;
    bottom: number;
    header: number;
    footer: number;
    gutter: number;
}
interface SectionStartNumbering {
    pageStartsOn: string;
    page: number;
    picture: number;
    table: number;
    equation: number;
}
interface ColumnLayout {
    /** Column type: "NEWSPAPER", "PARALLEL", "BALANCE_NEWSPAPER", "BALANCE_PARALLEL" */
    type: string;
    /** Column layout direction: "LEFT", "RIGHT", "MIRROR" */
    layout: string;
    /** Number of columns */
    colCount: number;
    /** Whether all columns have the same width */
    sameSz: boolean;
    /** Gap between columns in hwpUnits (used when sameSz is true) */
    sameGap: number;
    /** Per-column width and gap (used when sameSz is false) */
    columns?: {
        width: number;
        gap: number;
    }[];
}
interface DocumentNumbering {
    page: number;
    footnote: number;
    endnote: number;
    picture: number;
    table: number;
    equation: number;
}
interface RunStyle {
    id: string;
    attributes: Record<string, string>;
    childAttributes: Record<string, Record<string, string>>;
}

/**
 * Table-related OXML classes: HwpxOxmlTableCell, HwpxOxmlTableRow, HwpxOxmlTable.
 */

/** Margin values (top, bottom, left, right) in hwpUnits. */
interface HwpxMargin {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
declare class HwpxOxmlTableCell {
    element: Element;
    table: HwpxOxmlTable;
    private _rowElement;
    constructor(element: Element, table: HwpxOxmlTable, rowElement: Element);
    private _addrElement;
    private _spanElement;
    private _sizeElement;
    get address(): [number, number];
    get span(): [number, number];
    setSpan(rowSpan: number, colSpan: number): void;
    get width(): number;
    get height(): number;
    setSize(width?: number, height?: number): void;
    get text(): string;
    set text(value: string);
    /** Get cell margin (cellMargin element). */
    getMargin(): HwpxMargin;
    /** Set cell margin (cellMargin element). */
    setMargin(margin: Partial<HwpxMargin>): void;
    get borderFillIDRef(): string | null;
    set borderFillIDRef(id: string);
    get vertAlign(): string;
    set vertAlign(value: string);
    remove(): void;
    private _ensureTextElement;
}
interface HwpxTableGridPosition {
    row: number;
    column: number;
    cell: HwpxOxmlTableCell;
    anchor: [number, number];
    span: [number, number];
}
declare class HwpxOxmlTableRow {
    element: Element;
    table: HwpxOxmlTable;
    constructor(element: Element, table: HwpxOxmlTable);
    get cells(): HwpxOxmlTableCell[];
}
declare class HwpxOxmlTable {
    element: Element;
    paragraph: HwpxOxmlParagraph;
    constructor(element: Element, paragraph: HwpxOxmlParagraph);
    markDirty(): void;
    get borderFillIDRef(): string | null;
    set borderFillIDRef(id: string);
    /** Table width in hwpUnits. */
    get width(): number;
    /** Table height in hwpUnits. */
    get height(): number;
    /** Set table size (width and/or height in hwpUnits). */
    setSize(width?: number, height?: number): void;
    /** Get table outer margin (outMargin element). */
    getOutMargin(): HwpxMargin;
    /** Set table outer margin (outMargin element). */
    setOutMargin(margin: Partial<HwpxMargin>): void;
    /** Get table inner cell margin (inMargin element). */
    getInMargin(): HwpxMargin;
    /** Set table inner cell margin (inMargin element). */
    setInMargin(margin: Partial<HwpxMargin>): void;
    /** Set the width of a column (updates all cells in that column). */
    setColumnWidth(colIdx: number, width: number): void;
    /** Page break mode: "CELL" (split at cell), "NONE" (no split), or other HWPX values. */
    get pageBreak(): string;
    set pageBreak(value: string);
    /** Whether the header row repeats on each page ("0" = no, "1" = yes). */
    get repeatHeader(): boolean;
    set repeatHeader(value: boolean);
    get rowCount(): number;
    get columnCount(): number;
    get rows(): HwpxOxmlTableRow[];
    cell(rowIndex: number, colIndex: number): HwpxOxmlTableCell;
    setCellText(rowIndex: number, colIndex: number, text: string): void;
    private _buildCellGrid;
    private _gridEntry;
    iterGrid(): HwpxTableGridPosition[];
    getCellMap(): HwpxTableGridPosition[][];
    private _createCell;
    insertRow(atIndex: number, position: "before" | "after"): void;
    deleteRow(rowIndex: number): void;
    insertColumn(atIndex: number, position: "before" | "after"): void;
    deleteColumn(colIndex: number): void;
    mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void;
    splitCell(row: number, col: number): void;
    remove(): void;
    static create(doc: Document, rows: number, cols: number, opts: {
        width?: number;
        height?: number;
        borderFillIdRef: string | number;
    }): Element;
}

/**
 * Paragraph and Run OXML classes: HwpxOxmlRun, HwpxOxmlParagraph.
 */

declare class HwpxOxmlRun {
    element: Element;
    paragraph: HwpxOxmlParagraph;
    constructor(element: Element, paragraph: HwpxOxmlParagraph);
    get charPrIdRef(): string | null;
    set charPrIdRef(value: string | number | null);
    get text(): string;
    set text(value: string);
    get style(): RunStyle | null;
    replaceText(search: string, replacement: string, count?: number): number;
    remove(): void;
    private _plainTextNodes;
    private _ensurePlainTextNode;
}
declare class HwpxOxmlParagraph {
    element: Element;
    section: HwpxOxmlSection;
    constructor(element: Element, section: HwpxOxmlSection);
    get runs(): HwpxOxmlRun[];
    get text(): string;
    set text(value: string);
    get tables(): HwpxOxmlTable[];
    get paraPrIdRef(): string | null;
    set paraPrIdRef(value: string | number | null);
    /** Whether this paragraph forces a column break before it. */
    get columnBreak(): boolean;
    set columnBreak(value: boolean);
    /** Whether this paragraph forces a page break before it. */
    get pageBreak(): boolean;
    set pageBreak(value: boolean);
    get styleIdRef(): string | null;
    set styleIdRef(value: string | number | null);
    /** Get the bullet ID reference for list formatting. */
    get bulletIdRef(): string | null;
    /** Set the bullet ID reference for list formatting. */
    set bulletIdRef(value: string | number | null);
    /** Get the outline level for numbered list (1-9, or 0 for no outline). */
    get outlineLevel(): number;
    /** Set the outline level for numbered list. */
    set outlineLevel(value: number);
    get charPrIdRef(): string | null;
    set charPrIdRef(value: string | number | null);
    addRun(text?: string, opts?: {
        charPrIdRef?: string | number;
        attributes?: Record<string, string>;
    }): HwpxOxmlRun;
    /** Insert a tab character at the end of the paragraph. */
    addTab(opts?: {
        charPrIdRef?: string | number;
        /** Tab position in hwpUnit (optional, defaults to auto-position) */
        width?: number;
        /** Tab leader style for TOC entries: "DOT" | "HYPHEN" | "UNDERLINE" | "NONE" */
        tabLeader?: "DOT" | "HYPHEN" | "UNDERLINE" | "NONE";
    }): void;
    addTable(rows: number, cols: number, opts?: {
        width?: number;
        height?: number;
        borderFillIdRef?: string | number;
    }): HwpxOxmlTable;
    /**
     * Add a picture (image) element to this paragraph.
     * @param binaryItemIdRef - The binary item ID returned by HwpxPackage.addBinaryItem()
     * @param opts - width/height in hwpUnits (7200 = 1 inch). Use mmToHwp() to convert from mm.
     */
    addPicture(binaryItemIdRef: string, opts: {
        width: number;
        height: number;
        textWrap?: string;
        treatAsChar?: boolean;
    }): Element;
    /** Return all <pic> elements across all runs. */
    get pictures(): Element[];
    /**
     * Set the size of a picture element (by index) in hwpUnits.
     * Updates curSz, sz, imgRect, imgClip, imgDim, and rotationInfo.
     */
    setPictureSize(pictureIndex: number, width: number, height: number): void;
    /** Get picture outer margin by index. */
    getPictureOutMargin(pictureIndex: number): HwpxMargin;
    /** Set picture outer margin by index. */
    setPictureOutMargin(pictureIndex: number, margin: Partial<HwpxMargin>): void;
    /** Get picture inner margin by index. */
    getPictureInMargin(pictureIndex: number): HwpxMargin;
    /** Set picture inner margin by index. */
    setPictureInMargin(pictureIndex: number, margin: Partial<HwpxMargin>): void;
    /**
     * Add an equation element to this paragraph.
     * The script uses HWP equation scripting language (e.g. "rmCH _{3} COOH").
     *
     * @param script - HWP equation script text
     * @param opts - Optional configuration:
     *   - width/height in hwpUnits (estimated size; Hangul recalculates on open)
     *   - textColor: equation text color (default "#000000")
     *   - font: equation font (default "HancomEQN")
     *   - baseUnit: base unit size (default 1000)
     *   - baseLine: baseline percentage (default 85)
     *   - charPrIdRef: character property ID for the enclosing run
     */
    addEquation(script: string, opts?: {
        width?: number;
        height?: number;
        textColor?: string;
        font?: string;
        baseUnit?: number;
        baseLine?: number;
        charPrIdRef?: string | number;
    }): Element;
    /** Return all <equation> elements across all runs. */
    get equations(): Element[];
    /**
     * Add a text box (drawText) element to this paragraph.
     * @param text - The text content of the text box
     * @param opts - width/height in hwpUnits
     */
    addTextBox(text: string, opts: {
        width: number;
        height: number;
        x?: number;
        y?: number;
        textWrap?: string;
        borderColor?: string;
        fillColor?: string;
        charPrIdRef?: string | number;
    }): Element;
    /** Return all <drawText> (text box) elements across all runs. */
    get textBoxes(): Element[];
    /** Get text box size. */
    getTextBoxSize(index: number): {
        width: number;
        height: number;
    };
    /** Set text box size. */
    setTextBoxSize(index: number, width: number, height: number): void;
    /** Get text box text content. */
    getTextBoxText(index: number): string;
    /** Set text box text content. */
    setTextBoxText(index: number, text: string): void;
    remove(): void;
    /**
     * Apply a character property to a specific text range.
     * This will split runs as needed to apply formatting only to the selected range.
     * @param startOffset - Start character offset (0-based)
     * @param endOffset - End character offset (exclusive)
     * @param charPrIdRef - The character property ID to apply
     */
    applyCharFormatToRange(startOffset: number, endOffset: number, charPrIdRef: string | number): void;
    private _ensureRun;
}

/**
 * Memo-related OXML classes: HwpxOxmlMemo, HwpxOxmlMemoGroup.
 */

declare class HwpxOxmlMemo {
    element: Element;
    group: HwpxOxmlMemoGroup;
    constructor(element: Element, group: HwpxOxmlMemoGroup);
    get id(): string | null;
    set id(value: string | null);
    get memoShapeIdRef(): string | null;
    set memoShapeIdRef(value: string | number | null);
    get text(): string;
    set text(value: string);
    setText(value: string, charPrIdRef?: string | number | null): void;
    get paragraphs(): HwpxOxmlParagraph[];
    remove(): void;
}
declare class HwpxOxmlMemoGroup {
    element: Element;
    section: HwpxOxmlSection;
    constructor(element: Element, section: HwpxOxmlSection);
    get memos(): HwpxOxmlMemo[];
    addMemo(text?: string, opts?: {
        memoShapeIdRef?: string | number;
        memoId?: string;
        charPrIdRef?: string | number;
        attributes?: Record<string, string>;
    }): HwpxOxmlMemo;
    _cleanup(): void;
}

/**
 * Section-related OXML classes: HwpxOxmlSectionHeaderFooter,
 * HwpxOxmlSectionProperties, HwpxOxmlSection.
 */

declare class HwpxOxmlSectionHeaderFooter {
    element: Element;
    private _properties;
    private _applyElement;
    constructor(element: Element, properties: HwpxOxmlSectionProperties, applyElement?: Element | null);
    get applyElement(): Element | null;
    get id(): string | null;
    set id(value: string | null);
    get applyPageType(): string;
    set applyPageType(value: string);
    private _applyIdAttributes;
    private _updateApplyReference;
    get text(): string;
    set text(value: string);
    private _ensureTextElement;
}
declare class HwpxOxmlSectionProperties {
    element: Element;
    section: HwpxOxmlSection;
    constructor(element: Element, section: HwpxOxmlSection);
    private _pagePrElement;
    private _marginElement;
    get pageSize(): PageSize;
    setPageSize(opts: {
        width?: number;
        height?: number;
        orientation?: string;
        gutterType?: string;
    }): void;
    get pageMargins(): PageMargins;
    setPageMargins(opts: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
        header?: number;
        footer?: number;
        gutter?: number;
    }): void;
    get startNumbering(): SectionStartNumbering;
    setStartNumbering(opts: {
        pageStartsOn?: string;
        page?: number;
        picture?: number;
        table?: number;
        equation?: number;
    }): void;
    /**
     * Find the colPr element which lives in a ctrl element that is a sibling
     * of secPr inside the same run element.
     */
    private _findColPrElement;
    /**
     * Ensure the colPr element exists, creating the ctrl wrapper if needed.
     */
    private _ensureColPrElement;
    get columnLayout(): ColumnLayout;
    setColumnLayout(opts: {
        type?: string;
        layout?: string;
        colCount?: number;
        sameGap?: number;
        columns?: {
            width: number;
            gap: number;
        }[];
    }): void;
    get headers(): HwpxOxmlSectionHeaderFooter[];
    get footers(): HwpxOxmlSectionHeaderFooter[];
    getHeader(pageType?: string): HwpxOxmlSectionHeaderFooter | null;
    getFooter(pageType?: string): HwpxOxmlSectionHeaderFooter | null;
    setHeaderText(text: string, pageType?: string): HwpxOxmlSectionHeaderFooter;
    setFooterText(text: string, pageType?: string): HwpxOxmlSectionHeaderFooter;
    removeHeader(pageType?: string): void;
    removeFooter(pageType?: string): void;
    private _findHeaderFooter;
    private _ensureHeaderFooter;
    private _applyIdAttributes;
    private _applyElements;
    private _applyReference;
    private _matchApplyForElement;
    private _ensureHeaderFooterApply;
    private _removeHeaderFooterApply;
}
declare class HwpxOxmlSection {
    partName: string;
    _element: Element;
    private _dirty;
    private _propertiesCache;
    private _document;
    constructor(partName: string, element: Element, document?: HwpxOxmlDocument | null);
    get element(): Element;
    get document(): HwpxOxmlDocument | null;
    attachDocument(document: HwpxOxmlDocument): void;
    get properties(): HwpxOxmlSectionProperties;
    get paragraphs(): HwpxOxmlParagraph[];
    get memoGroup(): HwpxOxmlMemoGroup | null;
    get memos(): HwpxOxmlMemo[];
    addMemo(text?: string, opts?: {
        memoShapeIdRef?: string | number;
        memoId?: string;
        charPrIdRef?: string | number;
        attributes?: Record<string, string>;
    }): HwpxOxmlMemo;
    addParagraph(text?: string, opts?: {
        paraPrIdRef?: string | number;
        styleIdRef?: string | number;
        charPrIdRef?: string | number;
        runAttributes?: Record<string, string>;
        includeRun?: boolean;
    }): HwpxOxmlParagraph;
    insertParagraphAt(index: number, text?: string, opts?: {
        paraPrIdRef?: string | number;
        styleIdRef?: string | number;
        charPrIdRef?: string | number;
        runAttributes?: Record<string, string>;
        includeRun?: boolean;
    }): HwpxOxmlParagraph;
    /**
     * Insert a pre-created paragraph element at the specified index.
     * Used internally by TOC generation and other features.
     */
    insertParagraph(paragraphElement: Element, index: number): HwpxOxmlParagraph;
    removeParagraph(index: number): void;
    replaceElement(newElement: Element): void;
    markDirty(): void;
    get dirty(): boolean;
    resetDirty(): void;
    toBytes(): string;
}

/**
 * Header part OXML class: HwpxOxmlHeader.
 */

declare class HwpxOxmlHeader {
    partName: string;
    private _element;
    private _dirty;
    private _document;
    constructor(partName: string, element: Element, document?: HwpxOxmlDocument | null);
    get element(): Element;
    get document(): HwpxOxmlDocument | null;
    attachDocument(document: HwpxOxmlDocument): void;
    private _refListElement;
    private _borderFillsElement;
    private _charPropertiesElement;
    findBasicBorderFillId(): string | null;
    ensureBasicBorderFill(): string;
    getBorderFillInfo(id: string | number): BorderFillInfo | null;
    ensureBorderFill(opts: {
        baseBorderFillId?: string | number;
        sides?: {
            left?: BorderStyle;
            right?: BorderStyle;
            top?: BorderStyle;
            bottom?: BorderStyle;
        };
        backgroundColor?: string | null;
    }): string;
    ensureCharProperty(opts: {
        predicate?: (el: Element) => boolean;
        modifier?: (el: Element) => void;
        baseCharPrId?: string | number;
        preferredId?: string | number;
    }): Element;
    private _fontFacesElement;
    /**
     * Ensure a font exists in all fontface lang groups (HANGUL, LATIN, etc.)
     * and return the numeric font ID for the HANGUL group.
     * If the font already exists, returns its existing ID.
     */
    ensureFontFace(fontName: string): string;
    get beginNumbering(): DocumentNumbering;
    private _paraPropertiesElement;
    ensureParaProperty(opts: {
        predicate?: (el: Element) => boolean;
        modifier?: (el: Element) => void;
        baseParaPrId?: string | number;
    }): Element;
    private _allocateParaPropertyId;
    private _updateParaPropertiesItemCount;
    replaceElement(newElement: Element): void;
    get dirty(): boolean;
    markDirty(): void;
    resetDirty(): void;
    toBytes(): string;
    private _allocateCharPropertyId;
    private _allocateBorderFillId;
    private _updateCharPropertiesItemCount;
    private _updateBorderFillsItemCount;
}

/**
 * Simple OXML part classes: SimplePart, MasterPage, History, Version.
 */

declare class HwpxOxmlSimplePart {
    partName: string;
    protected _element: Element;
    protected _document: HwpxOxmlDocument | null;
    protected _dirty: boolean;
    constructor(partName: string, element: Element, document?: HwpxOxmlDocument | null);
    get element(): Element;
    get document(): HwpxOxmlDocument | null;
    attachDocument(document: HwpxOxmlDocument): void;
    get dirty(): boolean;
    markDirty(): void;
    resetDirty(): void;
    replaceElement(element: Element): void;
    toBytes(): string;
}
declare class HwpxOxmlMasterPage extends HwpxOxmlSimplePart {
}
declare class HwpxOxmlHistory extends HwpxOxmlSimplePart {
}
declare class HwpxOxmlVersion extends HwpxOxmlSimplePart {
}

declare class HwpxOxmlDocument {
    private _manifest;
    private _sections;
    private _headers;
    private _masterPages;
    private _histories;
    private _version;
    private _charPropertyCache;
    constructor(manifest: Element, sections: HwpxOxmlSection[], headers: HwpxOxmlHeader[], opts?: {
        masterPages?: HwpxOxmlMasterPage[];
        histories?: HwpxOxmlHistory[];
        version?: HwpxOxmlVersion | null;
    });
    static fromPackage(pkg: HwpxPackage): HwpxOxmlDocument;
    get manifest(): Element;
    get sections(): HwpxOxmlSection[];
    get headers(): HwpxOxmlHeader[];
    get masterPages(): HwpxOxmlMasterPage[];
    get histories(): HwpxOxmlHistory[];
    get version(): HwpxOxmlVersion | null;
    private _ensureCharPropertyCache;
    invalidateCharPropertyCache(): void;
    /**
     * Resolve a numeric font ID to a font face name.
     * @param fontId - numeric font ID string (e.g. "7")
     * @param lang - language group (default "HANGUL")
     * @returns font face name or null
     */
    fontFaceName(fontId: string | number | null, lang?: string): string | null;
    get charProperties(): Record<string, RunStyle>;
    charProperty(charPrIdRef: string | number | null): RunStyle | null;
    ensureRunStyle(opts: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strikethrough?: boolean;
        fontFamily?: string;
        fontSize?: number;
        textColor?: string;
        highlightColor?: string;
        baseCharPrId?: string | number;
    }): string;
    ensureParaStyle(opts: {
        alignment?: string;
        lineSpacingValue?: number;
        marginLeft?: number;
        marginRight?: number;
        indent?: number;
        baseParaPrId?: string | number;
    }): string;
    ensureBasicBorderFill(): string;
    getBorderFillInfo(id: string | number): BorderFillInfo | null;
    ensureBorderFillStyle(opts: {
        baseBorderFillId?: string | number;
        sides?: {
            left?: BorderStyle;
            right?: BorderStyle;
            top?: BorderStyle;
            bottom?: BorderStyle;
        };
        backgroundColor?: string | null;
    }): string;
    get paragraphs(): HwpxOxmlParagraph[];
    addParagraph(text?: string, opts?: {
        section?: HwpxOxmlSection;
        sectionIndex?: number;
        paraPrIdRef?: string | number;
        styleIdRef?: string | number;
        charPrIdRef?: string | number;
        runAttributes?: Record<string, string>;
        includeRun?: boolean;
    }): HwpxOxmlParagraph;
    insertParagraphAt(sectionIndex: number, paragraphIndex: number, text?: string, opts?: {
        paraPrIdRef?: string | number;
        styleIdRef?: string | number;
        charPrIdRef?: string | number;
        runAttributes?: Record<string, string>;
        includeRun?: boolean;
    }): HwpxOxmlParagraph;
    removeParagraph(sectionIndex: number, paragraphIndex: number): void;
    serialize(): Record<string, string>;
    resetDirty(): void;
}

/**
 * High-level HwpxDocument API.
 * Ported from Python hwpx/document.py
 */

interface DocumentVersionInfo {
    path: string | null;
    targetApplication: string | null;
    major: number | null;
    minor: number | null;
    micro: number | null;
    buildNumber: number | null;
    os: number | null;
    xmlVersion: string | null;
    application: string | null;
    appVersion: string | null;
}
declare class HwpxDocument {
    private _package;
    private _oxml;
    private _closed;
    constructor(pkg: HwpxPackage, oxml: HwpxOxmlDocument);
    private _assertOpen;
    /** Open an HWPX document from a Uint8Array or ArrayBuffer. */
    static open(source: Uint8Array | ArrayBuffer): Promise<HwpxDocument>;
    /** Return the underlying package. */
    get package(): HwpxPackage;
    /** Return the OXML document object model. */
    get oxml(): HwpxOxmlDocument;
    get closed(): boolean;
    get libraryVersion(): string;
    get documentVersionInfo(): DocumentVersionInfo | null;
    close(): void;
    toJSON(): {
        sectionCount: number;
        paragraphCount: number;
        tableCount: number;
        memoCount: number;
        headerCount: number;
        textPreview: string;
    };
    toString(): string;
    /** Return the sections in this document. */
    get sections(): HwpxOxmlSection[];
    /** Return the number of sections. */
    get sectionCount(): number;
    /** Return a specific section by index. */
    section(index?: number): HwpxOxmlSection;
    /** Return all paragraphs across all sections. */
    get paragraphs(): HwpxOxmlParagraph[];
    /** Append a new paragraph to the last section (or specified section). */
    addParagraph(text?: string, opts?: {
        sectionIndex?: number;
        paraPrIdRef?: string | number;
        styleIdRef?: string | number;
        charPrIdRef?: string | number;
    }): HwpxOxmlParagraph;
    /** Insert a new paragraph at a specific position within a section. */
    insertParagraphAt(sectionIndex: number, paragraphIndex: number, text?: string, opts?: {
        paraPrIdRef?: string | number;
        styleIdRef?: string | number;
        charPrIdRef?: string | number;
    }): HwpxOxmlParagraph;
    /** Remove a paragraph by section and paragraph index. */
    removeParagraph(sectionIndex: number, paragraphIndex: number): void;
    /** Return the full text of the document (all paragraphs joined). */
    get text(): string;
    /** Replace text across all paragraphs. */
    replaceText(search: string, replacement: string, count?: number): number;
    /** Return all tables across all sections. */
    get tables(): HwpxOxmlTable[];
    /** Return the OXML header objects. */
    get headers(): HwpxOxmlHeader[];
    /** Get character properties map. */
    get charProperties(): Record<string, RunStyle>;
    /** Look up a character property by ID. */
    charProperty(charPrIdRef: string | number | null): RunStyle | null;
    /** Resolve a numeric font ID to its face name. */
    fontFaceName(fontId: string | number | null, lang?: string): string | null;
    /** Ensure a run style with the given formatting exists. */
    ensureRunStyle(opts: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strikethrough?: boolean;
        fontFamily?: string;
        fontSize?: number;
        textColor?: string;
        highlightColor?: string;
        baseCharPrId?: string | number;
    }): string;
    /** Ensure a paragraph style with the given formatting exists. */
    ensureParaStyle(opts: {
        alignment?: string;
        lineSpacingValue?: number;
        marginLeft?: number;
        marginRight?: number;
        indent?: number;
        baseParaPrId?: string | number;
    }): string;
    /** Ensure a basic border fill exists and return its ID. */
    ensureBasicBorderFill(): string;
    /**
     * Add an image to the document.
     * @param imageData - The image binary data as Uint8Array
     * @param opts - mediaType, width/height in mm (or hwpUnits if useHwpUnits=true)
     * @returns The paragraph containing the image
     */
    addImage(imageData: Uint8Array, opts: {
        mediaType: string;
        widthMm: number;
        heightMm: number;
        sectionIndex?: number;
        textWrap?: string;
        treatAsChar?: boolean;
    }): HwpxOxmlParagraph;
    /**
     * Add an equation to the document using HWP equation script notation.
     *
     * Script examples (from Hancom equation spec):
     *   - "rmCH _{3} COOH"         → CH₃COOH (Roman chemistry)
     *   - "1 over 2"               → ½ (fraction)
     *   - "sqrt 2"                 → √2 (square root)
     *   - "E=mc^2"                 → E=mc² (superscript)
     *   - "rm 2H_2 O = 2H_2 + O_2" → 2H₂O = 2H₂ + O₂
     *   - "sum_{x=0} ^{inf}"       → Σ (summation with bounds)
     *   - "int _1 ^2 {3x^2}dx"    → integral
     *   - "alpha beta Gamma"       → Greek letters
     *
     * @param script - HWP equation script text
     * @param opts - Optional: sectionIndex, textColor, font, baseUnit, baseLine, width/height in hwpUnits
     * @returns The paragraph containing the equation
     */
    addEquation(script: string, opts?: {
        sectionIndex?: number;
        textColor?: string;
        font?: string;
        baseUnit?: number;
        baseLine?: number;
        width?: number;
        height?: number;
    }): HwpxOxmlParagraph;
    /** Return all memos across all sections. */
    get memos(): HwpxOxmlMemo[];
    saveToBuffer(): Promise<Uint8Array>;
    saveToBlob(): Promise<Blob>;
    saveToPath(path: string): Promise<void>;
    /** Save the document, returning the HWPX file as a Uint8Array. */
    save(): Promise<Uint8Array>;
}

interface VersionResolveInput {
    metadataVersion?: string | null;
    envVersion?: string | null;
    injectedVersion?: string | null;
}
declare function resolveLibraryVersion(input?: VersionResolveInput): string;
declare const __version__: string;

/**
 * Skeleton.hwpx template loading.
 *
 * Browser: call setSkeletonHwpx() or fetchSkeletonHwpx() before calling loadSkeletonHwpx().
 * Node (CommonJS): loadSkeletonHwpx() reads from the packaged assets directory.
 *
 * Note: Node ESM does not provide `require()`; consumers should call setSkeletonHwpx()
 * or pass the template bytes directly to HwpxDocument.open().
 */
/**
 * Load the Skeleton.hwpx template as a Uint8Array.
 * Caches the result for subsequent calls.
 */
declare function loadSkeletonHwpx(): Uint8Array;
/**
 * Set the Skeleton.hwpx template from a provided Uint8Array.
 * Use this in browser environments (or Node ESM) where fs/require is not available.
 */
declare function setSkeletonHwpx(data: Uint8Array): void;
/**
 * Fetch and cache the Skeleton.hwpx template from a URL.
 * Convenience method for browser environments.
 */
declare function fetchSkeletonHwpx(url: string): Promise<Uint8Array>;

/**
 * Cross-platform XML DOM abstraction layer.
 * Uses @xmldom/xmldom in Node.js and native DOMParser/XMLSerializer in browsers.
 *
 * The global DOM lib types (Element, Document, Node) are used as the public API.
 * Internally, xmldom returns compatible objects — we cast at the boundary.
 */
/** Parse an XML string into a Document. */
declare function parseXml(xml: string): Document;
/** Serialize an Element (or Document) back to an XML string. */
declare function serializeXml(node: Node): string;
/** Return the local (namespace-stripped) tag name for a node. */
declare function localName(node: Element): string;
/** Create a namespaced element. If ns is null, creates without namespace. */
declare function createElement(doc: Document, ns: string | null, name: string, attributes?: Record<string, string>): Element;
/** Return attributes as a plain Record<string, string>. */
declare function getAttributes(node: Element): Record<string, string>;
/** Return an array of child Element nodes (skipping text, comments, etc.). */
declare function childElements(node: Element): Element[];
/** Get the text content of a node (equivalent to lxml .text). */
declare function getTextContent(node: Element): string | null;
/** Get the "tail" text (text after the closing tag, before the next sibling).
 *  In W3C DOM this is the nextSibling text node. */
declare function getTailText(node: Element): string;
/** Set direct text content of an element (replaces only text node children). */
declare function setTextContent(node: Element, text: string | null): void;

/**
 * Common element types for OXML models.
 * Ported from Python hwpx/oxml/common.py
 */
/** Fallback representation for XML elements without a specialised model. */
interface GenericElement {
    name: string;
    tag: string | null;
    attributes: Record<string, string>;
    children: GenericElement[];
    text: string | null;
}

/**
 * Body element models: Paragraph, Run, TextSpan, Control, InlineObject, Table.
 * Ported from Python hwpx/oxml/body.py
 */

type InlineMark = GenericElement | TrackChangeMark;
type RunChild = GenericElement | Control | Table | InlineObject | TextSpan;
type ParagraphChild = Run | GenericElement;
interface TrackChangeMark {
    tag: string;
    name: string;
    changeType: string;
    isBegin: boolean;
    paraEnd: boolean | null;
    tcId: number | null;
    id: number | null;
    attributes: Record<string, string>;
}
interface TextMarkup {
    element: InlineMark;
    trailingText: string;
}
interface TextSpan {
    tag: string;
    leadingText: string;
    marks: TextMarkup[];
    attributes: Record<string, string>;
}
interface Control {
    tag: string;
    controlType: string | null;
    attributes: Record<string, string>;
    children: GenericElement[];
}
interface InlineObject {
    tag: string;
    name: string;
    attributes: Record<string, string>;
    children: GenericElement[];
}
interface Table {
    tag: string;
    attributes: Record<string, string>;
    children: GenericElement[];
}
interface Run {
    tag: string;
    charPrIdRef: number | null;
    sectionProperties: GenericElement[];
    controls: Control[];
    tables: Table[];
    inlineObjects: InlineObject[];
    textSpans: TextSpan[];
    otherChildren: GenericElement[];
    attributes: Record<string, string>;
    content: RunChild[];
}
interface Paragraph {
    tag: string;
    id: number | null;
    paraPrIdRef: number | null;
    styleIdRef: number | null;
    pageBreak: boolean | null;
    columnBreak: boolean | null;
    merged: boolean | null;
    runs: Run[];
    attributes: Record<string, string>;
    otherChildren: GenericElement[];
    content: ParagraphChild[];
}
interface Section {
    tag: string;
    attributes: Record<string, string>;
    paragraphs: Paragraph[];
    otherChildren: GenericElement[];
}

/**
 * Header reference list models and parsing.
 * Ported from Python hwpx/oxml/header.py
 */

interface BeginNum {
    page: number;
    footnote: number;
    endnote: number;
    pic: number;
    tbl: number;
    equation: number;
}
interface LinkInfo {
    path: string;
    pageInherit: boolean;
    footnoteInherit: boolean;
}
interface LicenseMark {
    type: number;
    flag: number;
    lang: number | null;
}
interface DocOption {
    linkInfo: LinkInfo;
    licenseMark: LicenseMark | null;
}
interface KeyDerivation {
    algorithm: string | null;
    size: number | null;
    count: number | null;
    salt: string | null;
}
interface KeyEncryption {
    derivationKey: KeyDerivation;
    hashValue: string;
}
interface TrackChangeConfig {
    flags: number | null;
    encryption: KeyEncryption | null;
}
interface FontSubstitution {
    face: string;
    type: string;
    isEmbedded: boolean;
    binaryItemIdRef: string | null;
}
interface FontTypeInfo {
    attributes: Record<string, string>;
}
interface Font {
    id: number | null;
    face: string;
    type: string | null;
    isEmbedded: boolean;
    binaryItemIdRef: string | null;
    substitution: FontSubstitution | null;
    typeInfo: FontTypeInfo | null;
    otherChildren: Record<string, GenericElement[]>;
}
interface FontFace {
    lang: string | null;
    fontCnt: number | null;
    fonts: Font[];
    attributes: Record<string, string>;
}
interface FontFaceList {
    itemCnt: number | null;
    fontfaces: FontFace[];
}
interface BorderFillList {
    itemCnt: number | null;
    fills: GenericElement[];
}
interface TabProperties {
    itemCnt: number | null;
    tabs: GenericElement[];
}
interface NumberingList {
    itemCnt: number | null;
    numberings: GenericElement[];
}
interface CharProperty {
    id: number | null;
    attributes: Record<string, string>;
    childAttributes: Record<string, Record<string, string>>;
    childElements: Record<string, GenericElement[]>;
}
interface CharPropertyList {
    itemCnt: number | null;
    properties: CharProperty[];
}
interface ForbiddenWordList {
    itemCnt: number | null;
    words: string[];
}
interface MemoShape {
    id: number | null;
    width: number | null;
    lineWidth: string | null;
    lineType: string | null;
    lineColor: string | null;
    fillColor: string | null;
    activeColor: string | null;
    memoType: string | null;
    attributes: Record<string, string>;
}
interface MemoProperties {
    itemCnt: number | null;
    memoShapes: MemoShape[];
    attributes: Record<string, string>;
}
interface BulletParaHead {
    text: string;
    level: number | null;
    start: number | null;
    align: string | null;
    useInstWidth: boolean | null;
    autoIndent: boolean | null;
    widthAdjust: number | null;
    textOffsetType: string | null;
    textOffset: number | null;
    attributes: Record<string, string>;
}
interface Bullet {
    id: number | null;
    rawId: string | null;
    char: string;
    checkedChar: string | null;
    useImage: boolean;
    paraHead: BulletParaHead;
    image: GenericElement | null;
    attributes: Record<string, string>;
    otherChildren: Record<string, GenericElement[]>;
}
interface BulletList {
    itemCnt: number | null;
    bullets: Bullet[];
}
interface ParagraphAlignment {
    horizontal: string | null;
    vertical: string | null;
    attributes: Record<string, string>;
}
interface ParagraphHeading {
    type: string | null;
    idRef: number | null;
    level: number | null;
    attributes: Record<string, string>;
}
interface ParagraphBreakSetting {
    breakLatinWord: string | null;
    breakNonLatinWord: string | null;
    widowOrphan: boolean | null;
    keepWithNext: boolean | null;
    keepLines: boolean | null;
    pageBreakBefore: boolean | null;
    lineWrap: string | null;
    attributes: Record<string, string>;
}
interface ParagraphMargin {
    intent: string | null;
    left: string | null;
    right: string | null;
    prev: string | null;
    next: string | null;
    otherChildren: Record<string, GenericElement[]>;
}
interface ParagraphLineSpacing {
    spacingType: string | null;
    value: number | null;
    unit: string | null;
    attributes: Record<string, string>;
}
interface ParagraphBorder {
    borderFillIdRef: number | null;
    offsetLeft: number | null;
    offsetRight: number | null;
    offsetTop: number | null;
    offsetBottom: number | null;
    connect: boolean | null;
    ignoreMargin: boolean | null;
    attributes: Record<string, string>;
}
interface ParagraphAutoSpacing {
    eAsianEng: boolean | null;
    eAsianNum: boolean | null;
    attributes: Record<string, string>;
}
interface ParagraphProperty {
    id: number | null;
    rawId: string | null;
    tabPrIdRef: number | null;
    condense: number | null;
    fontLineHeight: boolean | null;
    snapToGrid: boolean | null;
    suppressLineNumbers: boolean | null;
    checked: boolean | null;
    align: ParagraphAlignment | null;
    heading: ParagraphHeading | null;
    breakSetting: ParagraphBreakSetting | null;
    margin: ParagraphMargin | null;
    lineSpacing: ParagraphLineSpacing | null;
    border: ParagraphBorder | null;
    autoSpacing: ParagraphAutoSpacing | null;
    attributes: Record<string, string>;
    otherChildren: Record<string, GenericElement[]>;
}
interface ParagraphPropertyList {
    itemCnt: number | null;
    properties: ParagraphProperty[];
}
interface Style {
    id: number | null;
    rawId: string | null;
    type: string | null;
    name: string | null;
    engName: string | null;
    paraPrIdRef: number | null;
    charPrIdRef: number | null;
    nextStyleIdRef: number | null;
    langId: number | null;
    lockForm: boolean | null;
    attributes: Record<string, string>;
}
interface StyleList {
    itemCnt: number | null;
    styles: Style[];
}
interface TrackChange {
    id: number | null;
    rawId: string | null;
    changeType: string | null;
    date: string | null;
    authorId: number | null;
    charShapeId: number | null;
    paraShapeId: number | null;
    hide: boolean | null;
    attributes: Record<string, string>;
}
interface TrackChangeList {
    itemCnt: number | null;
    changes: TrackChange[];
}
interface TrackChangeAuthor {
    id: number | null;
    rawId: string | null;
    name: string | null;
    mark: boolean | null;
    color: string | null;
    attributes: Record<string, string>;
}
interface TrackChangeAuthorList {
    itemCnt: number | null;
    authors: TrackChangeAuthor[];
}
interface RefList {
    fontfaces: FontFaceList | null;
    borderFills: BorderFillList | null;
    charProperties: CharPropertyList | null;
    tabProperties: TabProperties | null;
    numberings: NumberingList | null;
    bullets: BulletList | null;
    paraProperties: ParagraphPropertyList | null;
    styles: StyleList | null;
    memoProperties: MemoProperties | null;
    trackChanges: TrackChangeList | null;
    trackChangeAuthors: TrackChangeAuthorList | null;
    otherCollections: Record<string, GenericElement[]>;
}
interface Header {
    version: string;
    secCnt: number;
    beginNum: BeginNum | null;
    refList: RefList | null;
    forbiddenWordList: ForbiddenWordList | null;
    compatibleDocument: GenericElement | null;
    docOption: DocOption | null;
    metaTag: string | null;
    trackChangeConfig: TrackChangeConfig | null;
    otherElements: Record<string, GenericElement[]>;
}

/**
 * Element factory registry and top-level XML parse helpers.
 * Ported from Python hwpx/oxml/parser.py
 */

/** Convert a DOM Element into the corresponding TypeScript model object. */
declare function elementToModel(node: Element): unknown;
/** Parse an XML string containing a `<head>` root element into a Header model. */
declare function parseHeaderXml(source: string): Header;
/** Parse an XML string containing a `<sec>` root element into a Section model. */
declare function parseSectionXml(source: string): Section;

/**
 * Text extraction from HWPX documents.
 * Ported from Python hwpx/tools/text_extractor.py
 */

interface SectionInfo {
    index: number;
    name: string;
    path: string;
}
interface ParagraphInfo {
    sectionIndex: number;
    paragraphIndex: number;
    text: string;
    attributes: Record<string, string>;
}
type HighlightBehavior = "ignore" | "markers";
type NoteBehavior = "ignore" | "placeholder" | "inline";
type HyperlinkBehavior = "ignore" | "placeholder" | "target";
type ControlBehavior = "ignore" | "placeholder" | "nested";
interface AnnotationOptions {
    highlight?: HighlightBehavior;
    highlightStart?: string;
    highlightEnd?: string;
    footnote?: NoteBehavior;
    endnote?: NoteBehavior;
    noteInlineFormat?: string;
    notePlaceholder?: string;
    hyperlink?: HyperlinkBehavior;
    hyperlinkTargetFormat?: string;
    hyperlinkPlaceholder?: string;
    control?: ControlBehavior;
    controlPlaceholder?: string;
}
declare class TextExtractor {
    private _pkg;
    private _annotationOptions;
    constructor(pkg: HwpxPackage, annotationOptions?: AnnotationOptions);
    /** Return sections found in the package. */
    sections(): SectionInfo[];
    /** Extract paragraphs from a section XML string or all sections. */
    extractParagraphs(sectionIndex?: number): ParagraphInfo[];
    /** Extract all text from the document as a single string. */
    extractText(separator?: string): string;
    /** Extract text section by section. */
    extractSectionTexts(separator?: string): Map<number, string>;
}

/**
 * Object finder for locating elements inside HWPX documents.
 * Ported from Python hwpx/tools/object_finder.py
 */

type AttrMatcher = string | string[] | RegExp | ((value: string) => boolean);
interface FoundElement {
    section: SectionInfo;
    path: string;
    element: Element;
}
interface AnnotationMatch {
    kind: string;
    element: FoundElement;
    value: string | null;
}
declare class ObjectFinder {
    private _pkg;
    private _namespaces;
    constructor(pkg: HwpxPackage, namespaces?: Record<string, string>);
    /** Return sections found in the package. */
    sections(): SectionInfo[];
    /** Find elements by local tag name. */
    findByTag(tagName: string, opts?: {
        sectionIndex?: number;
    }): FoundElement[];
    /** Find elements by attribute match. */
    findByAttribute(attributeName: string, matcher: AttrMatcher, opts?: {
        tagName?: string;
        sectionIndex?: number;
    }): FoundElement[];
    /** Find all tables in the document. */
    findTables(opts?: {
        sectionIndex?: number;
    }): FoundElement[];
    /** Find all pictures/images in the document. */
    findPictures(opts?: {
        sectionIndex?: number;
    }): FoundElement[];
    /** Find all controls in the document. */
    findControls(opts?: {
        controlType?: string;
        sectionIndex?: number;
    }): FoundElement[];
    /** Find annotations (highlights, footnotes, etc.) */
    findAnnotations(opts?: {
        kind?: string;
        sectionIndex?: number;
    }): AnnotationMatch[];
}

export { type BorderFillList, type Bullet, type CharProperty, type ColumnLayout, type Control, type DocumentNumbering, type Font, type FontFace, type GenericElement, type Header, HwpxDocument, type HwpxMargin, HwpxOxmlDocument, HwpxOxmlHeader, HwpxOxmlHistory, HwpxOxmlMasterPage, HwpxOxmlMemo, HwpxOxmlMemoGroup, HwpxOxmlParagraph, HwpxOxmlRun, HwpxOxmlSection, HwpxOxmlSectionHeaderFooter, HwpxOxmlSectionProperties, HwpxOxmlTable, HwpxOxmlTableCell, HwpxOxmlTableRow, HwpxOxmlVersion, HwpxPackage, type HwpxTableGridPosition, type InlineObject, type MemoProperties, type MemoShape, ObjectFinder, type PageMargins, type PageSize, type Paragraph, type ParagraphProperty, type RefList, type Run, type RunStyle, type Section, type SectionStartNumbering, type Style, type Table, TextExtractor, type TextSpan, type TrackChange, type TrackChangeAuthor, type TrackChangeMark, __version__, childElements, createElement, elementToModel, fetchSkeletonHwpx, getAttributes, getTailText, getTextContent, loadSkeletonHwpx, localName, parseHeaderXml, parseSectionXml, parseXml, resolveLibraryVersion, serializeXml, setSkeletonHwpx, setTextContent };
