"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  HwpxDocument: () => HwpxDocument,
  HwpxOxmlDocument: () => HwpxOxmlDocument,
  HwpxOxmlHeader: () => HwpxOxmlHeader,
  HwpxOxmlHistory: () => HwpxOxmlHistory,
  HwpxOxmlMasterPage: () => HwpxOxmlMasterPage,
  HwpxOxmlMemo: () => HwpxOxmlMemo,
  HwpxOxmlMemoGroup: () => HwpxOxmlMemoGroup,
  HwpxOxmlParagraph: () => HwpxOxmlParagraph,
  HwpxOxmlRun: () => HwpxOxmlRun,
  HwpxOxmlSection: () => HwpxOxmlSection,
  HwpxOxmlSectionHeaderFooter: () => HwpxOxmlSectionHeaderFooter,
  HwpxOxmlSectionProperties: () => HwpxOxmlSectionProperties,
  HwpxOxmlTable: () => HwpxOxmlTable,
  HwpxOxmlTableCell: () => HwpxOxmlTableCell,
  HwpxOxmlTableRow: () => HwpxOxmlTableRow,
  HwpxOxmlVersion: () => HwpxOxmlVersion,
  HwpxPackage: () => HwpxPackage,
  ObjectFinder: () => ObjectFinder,
  TextExtractor: () => TextExtractor,
  __version__: () => __version__,
  childElements: () => childElements,
  createElement: () => createElement,
  elementToModel: () => elementToModel,
  fetchSkeletonHwpx: () => fetchSkeletonHwpx,
  getAttributes: () => getAttributes,
  getTailText: () => getTailText,
  getTextContent: () => getTextContent,
  loadSkeletonHwpx: () => loadSkeletonHwpx,
  localName: () => localName,
  parseHeaderXml: () => parseHeaderXml,
  parseSectionXml: () => parseSectionXml,
  parseXml: () => parseXml,
  resolveLibraryVersion: () => resolveLibraryVersion,
  serializeXml: () => serializeXml,
  setSkeletonHwpx: () => setSkeletonHwpx,
  setTextContent: () => setTextContent
});
module.exports = __toCommonJS(index_exports);

// src/package.ts
var import_jszip = __toESM(require("jszip"), 1);

// src/xml/dom.ts
var import_xmldom = require("@xmldom/xmldom");
var _parser = new import_xmldom.DOMParser();
var _serializer = new import_xmldom.XMLSerializer();
var PREFERRED_NAMESPACE_PREFIX = {
  "http://www.hancom.co.kr/hwpml/2011/paragraph": "hp",
  "http://www.hancom.co.kr/hwpml/2016/paragraph": "hp10",
  "http://www.hancom.co.kr/hwpml/2011/section": "hs",
  "http://www.hancom.co.kr/hwpml/2011/core": "hc",
  "http://www.hancom.co.kr/hwpml/2011/head": "hh",
  "http://www.idpf.org/2007/opf/": "opf"
};
function parseXml(xml) {
  return _parser.parseFromString(xml, "text/xml");
}
function serializeXml(node) {
  return _serializer.serializeToString(node);
}
function localName(node) {
  if (node.localName) return node.localName;
  const tag = node.tagName;
  const idx = tag.indexOf(":");
  return idx >= 0 ? tag.substring(idx + 1) : tag;
}
function createElement(doc, ns, name, attributes) {
  let qualifiedName = name;
  if (ns && !name.includes(":")) {
    const preferred = PREFERRED_NAMESPACE_PREFIX[ns];
    if (preferred) {
      qualifiedName = `${preferred}:${name}`;
    }
  }
  const el = ns ? doc.createElementNS(ns, qualifiedName) : doc.createElement(qualifiedName);
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}
function getAttributes(node) {
  const attrs = {};
  const namedMap = node.attributes;
  if (namedMap) {
    for (let i = 0; i < namedMap.length; i++) {
      const attr = namedMap.item(i);
      if (attr) {
        attrs[attr.name] = attr.value;
      }
    }
  }
  return attrs;
}
function childElements(node) {
  const result = [];
  const children = node.childNodes;
  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    if (child && child.nodeType === 1) {
      result.push(child);
    }
  }
  return result;
}
function getTextContent(node) {
  let text = "";
  const children = node.childNodes;
  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    if (child && child.nodeType === 3) {
      text += child.nodeValue ?? "";
    }
  }
  return text || null;
}
function getTailText(node) {
  const sibling = node.nextSibling;
  if (sibling && sibling.nodeType === 3) {
    return sibling.nodeValue ?? "";
  }
  return "";
}
function setTextContent(node, text) {
  const children = node.childNodes;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children.item(i);
    if (child && child.nodeType === 3) {
      node.removeChild(child);
    }
  }
  if (text) {
    const doc = node.ownerDocument;
    if (doc) {
      const textNode = doc.createTextNode(text);
      const firstChild = node.firstChild;
      if (firstChild) {
        node.insertBefore(textNode, firstChild);
      } else {
        node.appendChild(textNode);
      }
    }
  }
}

// src/package.ts
var _OPF_NS = "http://www.idpf.org/2007/opf/";
var MEDIA_TYPE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/bmp": "bmp",
  "image/gif": "gif",
  "image/tiff": "tif",
  "image/svg+xml": "svg",
  "image/webp": "webp"
};
function mediaTypeToExtension(mediaType) {
  return MEDIA_TYPE_EXTENSIONS[mediaType.toLowerCase()] ?? "bin";
}
function normalizedManifestValue(element) {
  const parts = ["id", "href", "media-type", "properties"].map((attr) => (element.getAttribute(attr) ?? "").toLowerCase()).filter((v) => v);
  return parts.join(" ");
}
function manifestMatches(element, ...candidates) {
  const normalized = normalizedManifestValue(element);
  return candidates.some((c) => c && normalized.includes(c));
}
function ensureBytes(value) {
  if (value instanceof Uint8Array) return value;
  return new TextEncoder().encode(value);
}
function pathName(path) {
  const idx = path.lastIndexOf("/");
  return idx >= 0 ? path.substring(idx + 1) : path;
}
function pathDir(path) {
  const idx = path.lastIndexOf("/");
  return idx >= 0 ? path.substring(0, idx) : "";
}
function normalizePosixPath(path) {
  const parts = path.split("/");
  const normalized = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (normalized.length > 0) {
        normalized.pop();
      }
      continue;
    }
    normalized.push(part);
  }
  return normalized.join("/");
}
var HwpxPackage = class _HwpxPackage {
  static MIMETYPE_PATH = "mimetype";
  static CONTAINER_PATH = "META-INF/container.xml";
  static MANIFEST_PATH = "Contents/content.hpf";
  static HEADER_PATH = "Contents/header.xml";
  static VERSION_PATH = "version.xml";
  static _warningHandler = null;
  _parts;
  _manifestTree = null;
  _spineCache = null;
  _sectionPathsCache = null;
  _headerPathsCache = null;
  _masterPagePathsCache = null;
  _historyPathsCache = null;
  _versionPathCache = null;
  _versionPathCacheResolved = false;
  _rootfilesCache = null;
  _closed = false;
  constructor(parts) {
    this._parts = new Map(parts);
  }
  static setWarningHandler(handler) {
    _HwpxPackage._warningHandler = handler;
  }
  _warn(message) {
    _HwpxPackage._warningHandler?.(message);
  }
  _validateOpenStructure() {
    if (!this._parts.has(_HwpxPackage.MIMETYPE_PATH)) {
      throw new Error("HWPX package is missing mandatory mimetype part");
    }
    const mimetype = this.getText(_HwpxPackage.MIMETYPE_PATH).trim();
    if (mimetype !== "application/hwp+zip") {
      throw new Error(`Invalid HWPX mimetype: ${mimetype}`);
    }
    if (!this._parts.has(_HwpxPackage.CONTAINER_PATH)) {
      throw new Error("HWPX package is missing META-INF/container.xml");
    }
    if (this.rootfiles().length === 0) {
      throw new Error("container.xml does not declare any rootfiles");
    }
  }
  _assertOpen() {
    if (this._closed) {
      throw new Error("HwpxPackage is closed");
    }
  }
  get closed() {
    return this._closed;
  }
  close() {
    if (this._closed) return;
    this._parts.clear();
    this._manifestTree = null;
    this._spineCache = null;
    this._sectionPathsCache = null;
    this._headerPathsCache = null;
    this._masterPagePathsCache = null;
    this._historyPathsCache = null;
    this._versionPathCache = null;
    this._versionPathCacheResolved = false;
    this._rootfilesCache = null;
    this._closed = true;
  }
  /** Open an HWPX package from a Uint8Array or ArrayBuffer. */
  static async open(source) {
    const zip = await import_jszip.default.loadAsync(source);
    const parts = /* @__PURE__ */ new Map();
    const promises = [];
    zip.forEach((relativePath, file) => {
      if (!file.dir) {
        promises.push(
          file.async("uint8array").then((data) => {
            parts.set(relativePath, data);
          })
        );
      }
    });
    await Promise.all(promises);
    const pkg = new _HwpxPackage(parts);
    pkg._validateOpenStructure();
    return pkg;
  }
  // -- Accessors --
  partNames() {
    this._assertOpen();
    return Array.from(this._parts.keys());
  }
  toJSON() {
    return {
      partCount: this._parts.size,
      sectionCount: this.sectionPaths().length,
      headerCount: this.headerPaths().length,
      hasManifest: this.hasPart(_HwpxPackage.MANIFEST_PATH),
      hasMimetype: this.hasPart(_HwpxPackage.MIMETYPE_PATH)
    };
  }
  toString() {
    const summary = this.toJSON();
    return `HwpxPackage(parts=${summary.partCount}, sections=${summary.sectionCount}, headers=${summary.headerCount})`;
  }
  hasPart(partName) {
    this._assertOpen();
    return this._parts.has(partName);
  }
  getPart(partName) {
    this._assertOpen();
    const data = this._parts.get(partName);
    if (data == null) {
      this._warn(`missing part: ${partName}`);
      throw new Error(`Package does not contain part '${partName}'`);
    }
    return data;
  }
  setPart(partName, payload) {
    this._assertOpen();
    this._parts.set(partName, ensureBytes(payload));
    if (partName === _HwpxPackage.MANIFEST_PATH) {
      this._manifestTree = null;
      this._spineCache = null;
      this._sectionPathsCache = null;
      this._headerPathsCache = null;
      this._masterPagePathsCache = null;
      this._historyPathsCache = null;
      this._versionPathCache = null;
      this._versionPathCacheResolved = false;
    }
    if (partName === _HwpxPackage.CONTAINER_PATH) {
      this._rootfilesCache = null;
    }
  }
  getXml(partName) {
    this._assertOpen();
    const data = this.getPart(partName);
    const text = new TextDecoder().decode(data);
    const doc = parseXml(text);
    return doc.documentElement;
  }
  setXml(partName, element) {
    this._assertOpen();
    const xml = '<?xml version="1.0" encoding="UTF-8"?>' + serializeXml(element);
    this.setPart(partName, xml);
  }
  getText(partName) {
    this._assertOpen();
    return new TextDecoder().decode(this.getPart(partName));
  }
  rootfiles() {
    this._assertOpen();
    if (this._rootfilesCache == null) {
      const containerText = this.getText(_HwpxPackage.CONTAINER_PATH);
      const containerDoc = parseXml(containerText);
      const rootfiles = [];
      const walk = (node) => {
        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
          const child = children.item(i);
          if (child && child.nodeType === 1) {
            const el = child;
            const tag = el.localName ?? el.tagName;
            if (tag === "rootfile") {
              const fullPathAttr = el.getAttribute("full-path");
              const fullPath = fullPathAttr ?? el.getAttribute("fullPath") ?? el.getAttribute("full_path");
              if (!fullPath) {
                throw new Error("container.xml rootfile is missing full-path");
              }
              if (!fullPathAttr) {
                this._warn("container rootfile uses non-standard full-path attribute");
              }
              const mediaTypeAttr = el.getAttribute("media-type");
              const mediaType = mediaTypeAttr ?? el.getAttribute("mediaType") ?? el.getAttribute("media_type");
              if (mediaType && !mediaTypeAttr) {
                this._warn("container rootfile uses non-standard media-type attribute");
              }
              rootfiles.push({ fullPath, mediaType: mediaType ?? null });
            }
            walk(el);
          }
        }
      };
      walk(containerDoc.documentElement);
      this._rootfilesCache = rootfiles;
    }
    return this._rootfilesCache.map((r) => ({ ...r }));
  }
  mainRootFile() {
    this._assertOpen();
    const rootfiles = this.rootfiles();
    const standard = rootfiles.find((rootfile) => rootfile.mediaType === "application/hwpml-package+xml");
    if (standard) return standard;
    const fallback = rootfiles[0];
    if (!fallback) {
      throw new Error("container.xml does not declare any rootfiles");
    }
    this._warn(`main rootfile fallback: ${fallback.fullPath}`);
    return fallback;
  }
  // -- Manifest helpers --
  manifestTree() {
    this._assertOpen();
    if (this._manifestTree == null) {
      const data = this.getPart(_HwpxPackage.MANIFEST_PATH);
      const text = new TextDecoder().decode(data);
      this._manifestTree = parseXml(text);
    }
    return this._manifestTree;
  }
  manifestItems() {
    const doc = this.manifestTree();
    const root = doc.documentElement;
    const items = [];
    const walk = (node) => {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        const child = children.item(i);
        if (child && child.nodeType === 1) {
          const el = child;
          const tag = el.localName ?? el.tagName;
          if (tag === "item") {
            items.push(el);
          }
          walk(el);
        }
      }
    };
    walk(root);
    return items;
  }
  resolveManifestHref(href) {
    const candidate = href.trim().replace(/^\/+/, "");
    if (!candidate) return candidate;
    if (this._parts.has(candidate)) return candidate;
    const manifestDir = pathDir(_HwpxPackage.MANIFEST_PATH);
    const resolved = manifestDir ? normalizePosixPath(`${manifestDir}/${candidate}`) : normalizePosixPath(candidate);
    if (this._parts.has(resolved)) return resolved;
    return candidate;
  }
  resolveSpinePaths() {
    if (this._spineCache == null) {
      const doc = this.manifestTree();
      const root = doc.documentElement;
      const manifestItems = {};
      const findElements = (node, localNameTarget) => {
        const result = [];
        const walk = (n) => {
          const children = n.childNodes;
          for (let i = 0; i < children.length; i++) {
            const child = children.item(i);
            if (child && child.nodeType === 1) {
              const el = child;
              const tag = el.localName ?? el.tagName;
              if (tag === localNameTarget) {
                result.push(el);
              }
              walk(el);
            }
          }
        };
        walk(node);
        return result;
      };
      for (const item of findElements(root, "item")) {
        const id = item.getAttribute("id");
        const href = this.resolveManifestHref(item.getAttribute("href") ?? "");
        if (id && href) {
          manifestItems[id] = href;
        }
      }
      const spinePaths = [];
      for (const itemref of findElements(root, "itemref")) {
        const idref = itemref.getAttribute("idref");
        if (!idref) continue;
        const href = manifestItems[idref];
        if (href) {
          spinePaths.push(href);
        }
      }
      this._spineCache = spinePaths;
    }
    return this._spineCache;
  }
  sectionPaths() {
    this._assertOpen();
    if (this._sectionPathsCache == null) {
      let paths = this.resolveSpinePaths().filter(
        (p) => p && pathName(p).startsWith("section")
      );
      if (paths.length === 0) {
        this._warn("sectionPaths fallback: using filename scan instead of manifest spine");
        paths = Array.from(this._parts.keys()).filter(
          (name) => pathName(name).startsWith("section")
        );
      }
      this._sectionPathsCache = paths;
    }
    return [...this._sectionPathsCache];
  }
  headerPaths() {
    this._assertOpen();
    if (this._headerPathsCache == null) {
      let paths = this.resolveSpinePaths().filter(
        (p) => p && pathName(p).startsWith("header")
      );
      if (paths.length === 0 && this.hasPart(_HwpxPackage.HEADER_PATH)) {
        this._warn(`headerPaths fallback: using default header path ${_HwpxPackage.HEADER_PATH}`);
        paths = [_HwpxPackage.HEADER_PATH];
      }
      this._headerPathsCache = paths;
    }
    return [...this._headerPathsCache];
  }
  masterPagePaths() {
    this._assertOpen();
    if (this._masterPagePathsCache == null) {
      let paths = this.manifestItems().filter((item) => manifestMatches(item, "masterpage", "master-page")).map((item) => this.resolveManifestHref(item.getAttribute("href") ?? "")).filter((href) => href);
      if (paths.length === 0) {
        this._warn("masterPagePaths fallback: using filename scan instead of manifest metadata");
        paths = Array.from(this._parts.keys()).filter((name) => {
          const n = pathName(name).toLowerCase();
          return n.includes("master") && n.includes("page");
        });
      }
      this._masterPagePathsCache = paths;
    }
    return [...this._masterPagePathsCache];
  }
  historyPaths() {
    this._assertOpen();
    if (this._historyPathsCache == null) {
      let paths = this.manifestItems().filter((item) => manifestMatches(item, "history")).map((item) => this.resolveManifestHref(item.getAttribute("href") ?? "")).filter((href) => href);
      if (paths.length === 0) {
        this._warn("historyPaths fallback: using filename scan instead of manifest metadata");
        paths = Array.from(this._parts.keys()).filter(
          (name) => pathName(name).toLowerCase().includes("history")
        );
      }
      this._historyPathsCache = paths;
    }
    return [...this._historyPathsCache];
  }
  versionPath() {
    this._assertOpen();
    if (!this._versionPathCacheResolved) {
      let path = null;
      for (const item of this.manifestItems()) {
        if (manifestMatches(item, "version")) {
          const href = this.resolveManifestHref(item.getAttribute("href") ?? "").trim();
          if (href) {
            path = href;
            break;
          }
        }
      }
      if (path == null && this.hasPart(_HwpxPackage.VERSION_PATH)) {
        this._warn(`versionPath fallback: using default path ${_HwpxPackage.VERSION_PATH}`);
        path = _HwpxPackage.VERSION_PATH;
      }
      this._versionPathCache = path;
      this._versionPathCacheResolved = true;
    }
    return this._versionPathCache;
  }
  // -- Binary item management --
  /**
   * Add a binary item (image, etc.) to the package.
   * Stores the data in BinData/ and registers it in the manifest.
   * Returns the binaryItemIDRef to use in <hc:img>.
   */
  addBinaryItem(data, opts) {
    this._assertOpen();
    const ext = opts.extension ?? mediaTypeToExtension(opts.mediaType);
    const existingParts = this.partNames().filter((p) => p.startsWith("BinData/"));
    let maxNum = 0;
    for (const p of existingParts) {
      const match = /^BinData\/image(\d+)\./.exec(p);
      if (match?.[1]) {
        const n = parseInt(match[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    const nextNum = maxNum + 1;
    const itemId = `image${nextNum}`;
    const href = `BinData/${itemId}.${ext}`;
    this._parts.set(href, data);
    const manifestDoc = this.manifestTree();
    const root = manifestDoc.documentElement;
    let manifestEl = null;
    const walk = (node) => {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        const child = children.item(i);
        if (child && child.nodeType === 1) {
          const el = child;
          const tag = el.localName ?? el.tagName;
          if (tag === "manifest") {
            manifestEl = el;
            return;
          }
          walk(el);
        }
      }
    };
    walk(root);
    if (manifestEl) {
      const item = manifestDoc.createElementNS(_OPF_NS, "opf:item");
      item.setAttribute("id", itemId);
      item.setAttribute("href", href);
      item.setAttribute("media-type", opts.mediaType);
      item.setAttribute("isEmbeded", "1");
      manifestEl.appendChild(item);
      const xml = serializeXml(manifestDoc);
      this._parts.set(_HwpxPackage.MANIFEST_PATH, new TextEncoder().encode(xml));
    }
    this._spineCache = null;
    this._sectionPathsCache = null;
    this._headerPathsCache = null;
    this._masterPagePathsCache = null;
    this._historyPathsCache = null;
    this._versionPathCache = null;
    this._versionPathCacheResolved = false;
    return itemId;
  }
  // -- Saving --
  async save(updates) {
    this._assertOpen();
    if (updates) {
      for (const [partName, payload] of Object.entries(updates)) {
        this.setPart(partName, payload);
      }
    }
    const zip = new import_jszip.default();
    const mimetype = this._parts.get(_HwpxPackage.MIMETYPE_PATH);
    if (mimetype) {
      zip.file(_HwpxPackage.MIMETYPE_PATH, mimetype, { compression: "STORE" });
    }
    for (const [name, data] of this._parts.entries()) {
      if (name === _HwpxPackage.MIMETYPE_PATH) continue;
      zip.file(name, data, { compression: "DEFLATE" });
    }
    return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  }
};

// src/oxml/xml-utils.ts
var HP_NS = "http://www.hancom.co.kr/hwpml/2011/paragraph";
var HH_NS = "http://www.hancom.co.kr/hwpml/2011/head";
var DEFAULT_PARAGRAPH_ATTRS = {
  paraPrIDRef: "0",
  styleIDRef: "0",
  pageBreak: "0",
  columnBreak: "0",
  merged: "0"
};
var DEFAULT_CELL_WIDTH = 7200;
var DEFAULT_CELL_HEIGHT = 3600;
var BASIC_BORDER_FILL_ATTRIBUTES = {
  threeD: "0",
  shadow: "0",
  centerLine: "NONE",
  breakCellSeparateLine: "0"
};
var BASIC_BORDER_CHILDREN = [
  ["slash", { type: "NONE", Crooked: "0", isCounter: "0" }],
  ["backSlash", { type: "NONE", Crooked: "0", isCounter: "0" }],
  ["leftBorder", { type: "SOLID", width: "0.12 mm", color: "#000000" }],
  ["rightBorder", { type: "SOLID", width: "0.12 mm", color: "#000000" }],
  ["topBorder", { type: "SOLID", width: "0.12 mm", color: "#000000" }],
  ["bottomBorder", { type: "SOLID", width: "0.12 mm", color: "#000000" }],
  ["diagonal", { type: "SOLID", width: "0.1 mm", color: "#000000" }]
];
var LAYOUT_CACHE_ELEMENT_NAMES = /* @__PURE__ */ new Set(["linesegarray"]);
function generateId() {
  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const view = new DataView(bytes.buffer);
  return String(view.getUint32(0) >>> 0);
}
function paragraphId() {
  return generateId();
}
function objectId() {
  return generateId();
}
function memoId() {
  return generateId();
}
function serializeXmlBytes(element) {
  return '<?xml version="1.0" encoding="UTF-8"?>' + serializeXml(element);
}
function elementLocalName(node) {
  return localName(node);
}
function normalizeLength(value) {
  if (value == null) return "";
  return value.replace(/ /g, "").toLowerCase();
}
function getIntAttr(element, name, defaultValue = 0) {
  const value = element.getAttribute(name);
  if (value == null) return defaultValue;
  const n = parseInt(value, 10);
  return isNaN(n) ? defaultValue : n;
}
function clearParagraphLayoutCache(paragraph) {
  const children = paragraph.childNodes;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children.item(i);
    if (child && child.nodeType === 1) {
      const el = child;
      if (LAYOUT_CACHE_ELEMENT_NAMES.has(elementLocalName(el).toLowerCase())) {
        paragraph.removeChild(el);
      }
    }
  }
}
function distributeSize(total, parts) {
  if (parts <= 0) return [];
  const base = Math.floor(total / parts);
  let remainder = total - base * parts;
  const sizes = [];
  for (let i = 0; i < parts; i++) {
    let value = base;
    if (remainder > 0) {
      value += 1;
      remainder -= 1;
    }
    sizes.push(Math.max(value, 0));
  }
  return sizes;
}
function defaultCellAttributes(borderFillIdRef) {
  return {
    name: "",
    header: "0",
    hasMargin: "0",
    protect: "0",
    editable: "0",
    dirty: "0",
    borderFillIDRef: borderFillIdRef
  };
}
function defaultSublistAttributes() {
  return {
    id: "",
    textDirection: "HORIZONTAL",
    lineWrap: "BREAK",
    vertAlign: "CENTER",
    linkListIDRef: "0",
    linkListNextIDRef: "0",
    textWidth: "0",
    textHeight: "0",
    hasTextRef: "0",
    hasNumRef: "0"
  };
}
function defaultCellParagraphAttributes() {
  return { ...DEFAULT_PARAGRAPH_ATTRS, id: paragraphId() };
}
function defaultCellMarginAttributes() {
  return { left: "0", right: "0", top: "0", bottom: "0" };
}
function findChild(parent, ns, localNameStr) {
  const children = parent.childNodes;
  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    if (child && child.nodeType === 1) {
      const el = child;
      if (elementLocalName(el) === localNameStr) return el;
    }
  }
  return null;
}
function findAllChildren(parent, ns, localNameStr) {
  const result = [];
  const children = parent.childNodes;
  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    if (child && child.nodeType === 1) {
      const el = child;
      if (elementLocalName(el) === localNameStr) result.push(el);
    }
  }
  return result;
}
function findDescendant(parent, localNameStr) {
  const children = parent.childNodes;
  for (let i = 0; i < children.length; i++) {
    const child = children.item(i);
    if (child && child.nodeType === 1) {
      const el = child;
      if (elementLocalName(el) === localNameStr) return el;
      const result = findDescendant(el, localNameStr);
      if (result) return result;
    }
  }
  return null;
}
function findAllDescendants(parent, localNameStr) {
  const result = [];
  const walk = (node) => {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children.item(i);
      if (child && child.nodeType === 1) {
        const el = child;
        if (elementLocalName(el) === localNameStr) result.push(el);
        walk(el);
      }
    }
  };
  walk(parent);
  return result;
}
function createNsElement(doc, ns, localNameStr, attributes) {
  return createElement(doc, ns, localNameStr, attributes);
}
function subElement(parent, ns, localNameStr, attributes) {
  const doc = parent.ownerDocument;
  const el = createNsElement(doc, ns, localNameStr, attributes);
  parent.appendChild(el);
  return el;
}
function createParagraphElement(doc, text, options) {
  const opts = options ?? {};
  const attrs = { id: paragraphId(), ...DEFAULT_PARAGRAPH_ATTRS };
  if (opts.paragraphAttributes) Object.assign(attrs, opts.paragraphAttributes);
  if (opts.paraPrIdRef != null) attrs["paraPrIDRef"] = String(opts.paraPrIdRef);
  if (opts.styleIdRef != null) attrs["styleIDRef"] = String(opts.styleIdRef);
  const paragraph = createNsElement(doc, HP_NS, "p", attrs);
  const runAttrs = { ...opts.runAttributes ?? {} };
  if (opts.charPrIdRef != null) {
    if (!("charPrIDRef" in runAttrs)) runAttrs["charPrIDRef"] = String(opts.charPrIdRef);
  } else {
    if (!("charPrIDRef" in runAttrs)) runAttrs["charPrIDRef"] = "0";
  }
  const run = subElement(paragraph, HP_NS, "run", runAttrs);
  const t = subElement(run, HP_NS, "t");
  t.textContent = text;
  return paragraph;
}
var DEFAULT_BORDER_STYLE = { type: "NONE", width: "0.12 mm", color: "#000000" };
function parseBorderFillElement(element) {
  const readBorder = (name) => {
    const child = findChild(element, HH_NS, name);
    if (!child) return { ...DEFAULT_BORDER_STYLE };
    return {
      type: (child.getAttribute("type") ?? "NONE").toUpperCase(),
      width: child.getAttribute("width") ?? "0.12 mm",
      color: child.getAttribute("color") ?? "#000000"
    };
  };
  let backgroundColor = null;
  const fillBrush = findChild(element, HH_NS, "fillBrush");
  if (fillBrush) {
    const windowBrush = findChild(fillBrush, HH_NS, "windowBrush");
    if (windowBrush) {
      backgroundColor = windowBrush.getAttribute("faceColor") ?? null;
    }
  }
  return {
    left: readBorder("leftBorder"),
    right: readBorder("rightBorder"),
    top: readBorder("topBorder"),
    bottom: readBorder("bottomBorder"),
    diagonal: readBorder("diagonal"),
    backgroundColor
  };
}
function createBorderFillElement(doc, id, info) {
  const attrs = { id, ...BASIC_BORDER_FILL_ATTRIBUTES };
  const element = createNsElement(doc, HH_NS, "borderFill", attrs);
  const writeBorder = (name, style) => {
    const s = style ?? DEFAULT_BORDER_STYLE;
    subElement(element, HH_NS, name, { type: s.type, width: s.width, color: s.color });
  };
  subElement(element, HH_NS, "slash", { type: "NONE", Crooked: "0", isCounter: "0" });
  subElement(element, HH_NS, "backSlash", { type: "NONE", Crooked: "0", isCounter: "0" });
  writeBorder("leftBorder", info.left);
  writeBorder("rightBorder", info.right);
  writeBorder("topBorder", info.top);
  writeBorder("bottomBorder", info.bottom);
  writeBorder("diagonal", info.diagonal);
  if (info.backgroundColor != null) {
    const fb = subElement(element, HH_NS, "fillBrush");
    subElement(fb, HH_NS, "windowBrush", { faceColor: info.backgroundColor, hatchColor: "NONE", alpha: "0" });
  }
  return element;
}
function borderFillIsBasicSolidLine(element) {
  if (elementLocalName(element) !== "borderFill") return false;
  for (const [attr, expected] of Object.entries(BASIC_BORDER_FILL_ATTRIBUTES)) {
    const actual = element.getAttribute(attr);
    if (attr === "centerLine") {
      if ((actual ?? "").toUpperCase() !== expected) return false;
    } else {
      if (actual !== expected) return false;
    }
  }
  for (const [childName, childAttrs] of BASIC_BORDER_CHILDREN) {
    const child = findChild(element, HH_NS, childName);
    if (child == null) return false;
    for (const [attr, expected] of Object.entries(childAttrs)) {
      const actual = child.getAttribute(attr);
      if (attr === "type") {
        if ((actual ?? "").toUpperCase() !== expected) return false;
      } else if (attr === "width") {
        if (normalizeLength(actual) !== normalizeLength(expected)) return false;
      } else if (attr === "color") {
        if ((actual ?? "").toUpperCase() !== expected.toUpperCase()) return false;
      } else {
        if (actual !== expected) return false;
      }
    }
  }
  for (const child of childElements(element)) {
    if (elementLocalName(child) === "fillBrush") return false;
  }
  return true;
}
function createBasicBorderFillElement(doc, borderId) {
  const attrs = { id: borderId, ...BASIC_BORDER_FILL_ATTRIBUTES };
  const element = createNsElement(doc, HH_NS, "borderFill", attrs);
  for (const [childName, childAttrs] of BASIC_BORDER_CHILDREN) {
    subElement(element, HH_NS, childName, { ...childAttrs });
  }
  return element;
}

// src/oxml/types.ts
function charPropertiesFromHeader(element) {
  const mapping = {};
  const refList = findChild(element, HH_NS, "refList");
  if (!refList) return mapping;
  const charPropsElement = findChild(refList, HH_NS, "charProperties");
  if (!charPropsElement) return mapping;
  for (const child of findAllChildren(charPropsElement, HH_NS, "charPr")) {
    const charId = child.getAttribute("id");
    if (!charId) continue;
    const attributes = {};
    const namedMap = child.attributes;
    for (let i = 0; i < namedMap.length; i++) {
      const attr = namedMap.item(i);
      if (attr && attr.name !== "id") {
        attributes[attr.name] = attr.value;
      }
    }
    const childAttributes = {};
    for (const grandchild of childElements(child)) {
      if (childElements(grandchild).length === 0 && !grandchild.textContent?.trim()) {
        const gcAttrs = {};
        const gcNamedMap = grandchild.attributes;
        for (let i = 0; i < gcNamedMap.length; i++) {
          const attr = gcNamedMap.item(i);
          if (attr) gcAttrs[attr.name] = attr.value;
        }
        childAttributes[elementLocalName(grandchild)] = gcAttrs;
      }
    }
    const style = { id: charId, attributes, childAttributes };
    if (!(charId in mapping)) mapping[charId] = style;
    try {
      const normalized = String(parseInt(charId, 10));
      if (normalized && !(normalized in mapping)) mapping[normalized] = style;
    } catch {
    }
  }
  return mapping;
}

// src/oxml/schema.ts
var HC_NS = "http://www.hancom.co.kr/hwpml/2011/core";

// src/oxml/table.ts
var HwpxOxmlTableCell = class {
  element;
  table;
  _rowElement;
  constructor(element, table, rowElement) {
    this.element = element;
    this.table = table;
    this._rowElement = rowElement;
  }
  _addrElement() {
    return findChild(this.element, HP_NS, "cellAddr");
  }
  _spanElement() {
    let span = findChild(this.element, HP_NS, "cellSpan");
    if (!span) span = subElement(this.element, HP_NS, "cellSpan", { colSpan: "1", rowSpan: "1" });
    return span;
  }
  _sizeElement() {
    let size = findChild(this.element, HP_NS, "cellSz");
    if (!size) size = subElement(this.element, HP_NS, "cellSz", { width: "0", height: "0" });
    return size;
  }
  get address() {
    const addr = this._addrElement();
    if (!addr) return [0, 0];
    return [
      parseInt(addr.getAttribute("rowAddr") ?? "0", 10),
      parseInt(addr.getAttribute("colAddr") ?? "0", 10)
    ];
  }
  get span() {
    const span = this._spanElement();
    return [
      parseInt(span.getAttribute("rowSpan") ?? "1", 10),
      parseInt(span.getAttribute("colSpan") ?? "1", 10)
    ];
  }
  setSpan(rowSpan, colSpan) {
    const span = this._spanElement();
    span.setAttribute("rowSpan", String(Math.max(rowSpan, 1)));
    span.setAttribute("colSpan", String(Math.max(colSpan, 1)));
    this.table.markDirty();
  }
  get width() {
    return parseInt(this._sizeElement().getAttribute("width") ?? "0", 10);
  }
  get height() {
    return parseInt(this._sizeElement().getAttribute("height") ?? "0", 10);
  }
  setSize(width, height) {
    const size = this._sizeElement();
    if (width != null) size.setAttribute("width", String(Math.max(width, 0)));
    if (height != null) size.setAttribute("height", String(Math.max(height, 0)));
    this.table.markDirty();
  }
  get text() {
    const textEl = findDescendant(this.element, "t");
    if (!textEl || !textEl.textContent) return "";
    return textEl.textContent;
  }
  set text(value) {
    const textEl = this._ensureTextElement();
    textEl.textContent = value;
    this.element.setAttribute("dirty", "1");
    this.table.markDirty();
  }
  /** Get cell margin (cellMargin element). */
  getMargin() {
    const el = findChild(this.element, HP_NS, "cellMargin");
    if (!el) return { top: 0, bottom: 0, left: 0, right: 0 };
    return {
      top: parseInt(el.getAttribute("top") ?? "0", 10),
      bottom: parseInt(el.getAttribute("bottom") ?? "0", 10),
      left: parseInt(el.getAttribute("left") ?? "0", 10),
      right: parseInt(el.getAttribute("right") ?? "0", 10)
    };
  }
  /** Set cell margin (cellMargin element). */
  setMargin(margin) {
    let el = findChild(this.element, HP_NS, "cellMargin");
    if (!el) el = subElement(this.element, HP_NS, "cellMargin", defaultCellMarginAttributes());
    if (margin.top != null) el.setAttribute("top", String(Math.max(margin.top, 0)));
    if (margin.bottom != null) el.setAttribute("bottom", String(Math.max(margin.bottom, 0)));
    if (margin.left != null) el.setAttribute("left", String(Math.max(margin.left, 0)));
    if (margin.right != null) el.setAttribute("right", String(Math.max(margin.right, 0)));
    this.table.markDirty();
  }
  get borderFillIDRef() {
    return this.element.getAttribute("borderFillIDRef");
  }
  set borderFillIDRef(id) {
    this.element.setAttribute("borderFillIDRef", id);
    this.table.markDirty();
  }
  get vertAlign() {
    const sublist = findChild(this.element, HP_NS, "subList");
    if (!sublist) return "CENTER";
    return (sublist.getAttribute("vertAlign") ?? "CENTER").toUpperCase();
  }
  set vertAlign(value) {
    let sublist = findChild(this.element, HP_NS, "subList");
    if (!sublist) sublist = subElement(this.element, HP_NS, "subList", defaultSublistAttributes());
    sublist.setAttribute("vertAlign", value);
    this.table.markDirty();
  }
  remove() {
    this._rowElement.removeChild(this.element);
    this.table.markDirty();
  }
  _ensureTextElement() {
    let sublist = findChild(this.element, HP_NS, "subList");
    if (!sublist) sublist = subElement(this.element, HP_NS, "subList", defaultSublistAttributes());
    let paragraph = findChild(sublist, HP_NS, "p");
    if (!paragraph) paragraph = subElement(sublist, HP_NS, "p", defaultCellParagraphAttributes());
    clearParagraphLayoutCache(paragraph);
    let run = findChild(paragraph, HP_NS, "run");
    if (!run) run = subElement(paragraph, HP_NS, "run", { charPrIDRef: "0" });
    let t = findChild(run, HP_NS, "t");
    if (!t) t = subElement(run, HP_NS, "t");
    return t;
  }
};
var HwpxOxmlTableRow = class {
  element;
  table;
  constructor(element, table) {
    this.element = element;
    this.table = table;
  }
  get cells() {
    return findAllChildren(this.element, HP_NS, "tc").map(
      (el) => new HwpxOxmlTableCell(el, this.table, this.element)
    );
  }
};
var HwpxOxmlTable = class {
  element;
  paragraph;
  constructor(element, paragraph) {
    this.element = element;
    this.paragraph = paragraph;
  }
  markDirty() {
    this.paragraph.section.markDirty();
  }
  get borderFillIDRef() {
    return this.element.getAttribute("borderFillIDRef");
  }
  set borderFillIDRef(id) {
    this.element.setAttribute("borderFillIDRef", id);
    this.markDirty();
  }
  /** Table width in hwpUnits. */
  get width() {
    const sz = findChild(this.element, HP_NS, "sz");
    return parseInt(sz?.getAttribute("width") ?? "0", 10);
  }
  /** Table height in hwpUnits. */
  get height() {
    const sz = findChild(this.element, HP_NS, "sz");
    return parseInt(sz?.getAttribute("height") ?? "0", 10);
  }
  /** Set table size (width and/or height in hwpUnits). */
  setSize(width, height) {
    let sz = findChild(this.element, HP_NS, "sz");
    if (!sz) sz = subElement(this.element, HP_NS, "sz", { width: "0", height: "0", widthRelTo: "ABSOLUTE", heightRelTo: "ABSOLUTE", protect: "0" });
    if (width != null) sz.setAttribute("width", String(Math.max(width, 0)));
    if (height != null) sz.setAttribute("height", String(Math.max(height, 0)));
    this.markDirty();
  }
  /** Get table outer margin (outMargin element). */
  getOutMargin() {
    const el = findChild(this.element, HP_NS, "outMargin");
    if (!el) return { top: 0, bottom: 0, left: 0, right: 0 };
    return {
      top: parseInt(el.getAttribute("top") ?? "0", 10),
      bottom: parseInt(el.getAttribute("bottom") ?? "0", 10),
      left: parseInt(el.getAttribute("left") ?? "0", 10),
      right: parseInt(el.getAttribute("right") ?? "0", 10)
    };
  }
  /** Set table outer margin (outMargin element). */
  setOutMargin(margin) {
    let el = findChild(this.element, HP_NS, "outMargin");
    if (!el) el = subElement(this.element, HP_NS, "outMargin", defaultCellMarginAttributes());
    if (margin.top != null) el.setAttribute("top", String(Math.max(margin.top, 0)));
    if (margin.bottom != null) el.setAttribute("bottom", String(Math.max(margin.bottom, 0)));
    if (margin.left != null) el.setAttribute("left", String(Math.max(margin.left, 0)));
    if (margin.right != null) el.setAttribute("right", String(Math.max(margin.right, 0)));
    this.markDirty();
  }
  /** Get table inner cell margin (inMargin element). */
  getInMargin() {
    const el = findChild(this.element, HP_NS, "inMargin");
    if (!el) return { top: 0, bottom: 0, left: 0, right: 0 };
    return {
      top: parseInt(el.getAttribute("top") ?? "0", 10),
      bottom: parseInt(el.getAttribute("bottom") ?? "0", 10),
      left: parseInt(el.getAttribute("left") ?? "0", 10),
      right: parseInt(el.getAttribute("right") ?? "0", 10)
    };
  }
  /** Set table inner cell margin (inMargin element). */
  setInMargin(margin) {
    let el = findChild(this.element, HP_NS, "inMargin");
    if (!el) el = subElement(this.element, HP_NS, "inMargin", defaultCellMarginAttributes());
    if (margin.top != null) el.setAttribute("top", String(Math.max(margin.top, 0)));
    if (margin.bottom != null) el.setAttribute("bottom", String(Math.max(margin.bottom, 0)));
    if (margin.left != null) el.setAttribute("left", String(Math.max(margin.left, 0)));
    if (margin.right != null) el.setAttribute("right", String(Math.max(margin.right, 0)));
    this.markDirty();
  }
  /** Set the width of a column (updates all cells in that column). */
  setColumnWidth(colIdx, width) {
    if (colIdx < 0 || colIdx >= this.columnCount) {
      throw new Error(`column index ${colIdx} out of range (0..${this.columnCount - 1})`);
    }
    const grid = this._buildCellGrid();
    const processed = /* @__PURE__ */ new Set();
    for (let r = 0; r < this.rowCount; r++) {
      const entry = grid.get(`${r},${colIdx}`);
      if (!entry) continue;
      if (entry.anchor[1] !== colIdx) continue;
      if (processed.has(entry.cell.element)) continue;
      processed.add(entry.cell.element);
      entry.cell.setSize(Math.max(width, 0));
    }
    this.markDirty();
  }
  /** Page break mode: "CELL" (split at cell), "NONE" (no split), or other HWPX values. */
  get pageBreak() {
    return this.element.getAttribute("pageBreak") ?? "CELL";
  }
  set pageBreak(value) {
    if (this.element.getAttribute("pageBreak") !== value) {
      this.element.setAttribute("pageBreak", value);
      this.markDirty();
    }
  }
  /** Whether the header row repeats on each page ("0" = no, "1" = yes). */
  get repeatHeader() {
    return this.element.getAttribute("repeatHeader") === "1";
  }
  set repeatHeader(value) {
    const v = value ? "1" : "0";
    if (this.element.getAttribute("repeatHeader") !== v) {
      this.element.setAttribute("repeatHeader", v);
      this.markDirty();
    }
  }
  get rowCount() {
    const value = this.element.getAttribute("rowCnt");
    if (value && /^\d+$/.test(value)) return parseInt(value, 10);
    return findAllChildren(this.element, HP_NS, "tr").length;
  }
  get columnCount() {
    const value = this.element.getAttribute("colCnt");
    if (value && /^\d+$/.test(value)) return parseInt(value, 10);
    const firstRow = findChild(this.element, HP_NS, "tr");
    if (!firstRow) return 0;
    return findAllChildren(firstRow, HP_NS, "tc").length;
  }
  get rows() {
    return findAllChildren(this.element, HP_NS, "tr").map((el) => new HwpxOxmlTableRow(el, this));
  }
  cell(rowIndex, colIndex) {
    const entry = this._gridEntry(rowIndex, colIndex);
    return entry.cell;
  }
  setCellText(rowIndex, colIndex, text) {
    this.cell(rowIndex, colIndex).text = text;
  }
  _buildCellGrid() {
    const mapping = /* @__PURE__ */ new Map();
    for (const row of findAllChildren(this.element, HP_NS, "tr")) {
      for (const cellElement of findAllChildren(row, HP_NS, "tc")) {
        const wrapper = new HwpxOxmlTableCell(cellElement, this, row);
        const [startRow, startCol] = wrapper.address;
        const [spanRow, spanCol] = wrapper.span;
        for (let lr = startRow; lr < startRow + spanRow; lr++) {
          for (let lc = startCol; lc < startCol + spanCol; lc++) {
            const key = `${lr},${lc}`;
            mapping.set(key, {
              row: lr,
              column: lc,
              cell: wrapper,
              anchor: [startRow, startCol],
              span: [spanRow, spanCol]
            });
          }
        }
      }
    }
    return mapping;
  }
  _gridEntry(rowIndex, colIndex) {
    if (rowIndex < 0 || colIndex < 0) throw new Error("row_index and col_index must be non-negative");
    const rowCount = this.rowCount;
    const colCount = this.columnCount;
    if (rowIndex >= rowCount || colIndex >= colCount) {
      throw new Error(`cell coordinates (${rowIndex}, ${colIndex}) exceed table bounds ${rowCount}x${colCount}`);
    }
    const entry = this._buildCellGrid().get(`${rowIndex},${colIndex}`);
    if (!entry) throw new Error(`cell coordinates (${rowIndex}, ${colIndex}) not found in grid`);
    return entry;
  }
  iterGrid() {
    const mapping = this._buildCellGrid();
    const result = [];
    for (let r = 0; r < this.rowCount; r++) {
      for (let c = 0; c < this.columnCount; c++) {
        const entry = mapping.get(`${r},${c}`);
        if (!entry) throw new Error(`cell coordinates (${r}, ${c}) do not resolve`);
        result.push(entry);
      }
    }
    return result;
  }
  getCellMap() {
    const rowCount = this.rowCount;
    const colCount = this.columnCount;
    const grid = [];
    const entries = this.iterGrid();
    let idx = 0;
    for (let r = 0; r < rowCount; r++) {
      const row = [];
      for (let c = 0; c < colCount; c++) {
        row.push(entries[idx++]);
      }
      grid.push(row);
    }
    return grid;
  }
  // ── Structure Mutation Methods ──────────────────────────────────────────
  _createCell(rowIdx, colIdx, width, height) {
    const doc = this.element.ownerDocument;
    const borderFill = this.element.getAttribute("borderFillIDRef") ?? "1";
    const cell = createNsElement(doc, HP_NS, "tc", defaultCellAttributes(borderFill));
    const sl = subElement(cell, HP_NS, "subList", defaultSublistAttributes());
    const p = subElement(sl, HP_NS, "p", defaultCellParagraphAttributes());
    const run = subElement(p, HP_NS, "run", { charPrIDRef: "0" });
    subElement(run, HP_NS, "t");
    subElement(cell, HP_NS, "cellAddr", { colAddr: String(colIdx), rowAddr: String(rowIdx) });
    subElement(cell, HP_NS, "cellSpan", { colSpan: "1", rowSpan: "1" });
    subElement(cell, HP_NS, "cellSz", { width: String(width), height: String(height) });
    subElement(cell, HP_NS, "cellMargin", defaultCellMarginAttributes());
    return cell;
  }
  insertRow(atIndex, position) {
    const insertIdx = position === "before" ? atIndex : atIndex + 1;
    const trElements = findAllChildren(this.element, HP_NS, "tr");
    const rowCount = this.rowCount;
    const colCount = this.columnCount;
    const grid = this._buildCellGrid();
    const coveredCols = /* @__PURE__ */ new Set();
    const processedCells = /* @__PURE__ */ new Set();
    if (insertIdx > 0 && insertIdx < rowCount) {
      for (let c = 0; c < colCount; c++) {
        const pos = grid.get(`${insertIdx},${c}`);
        if (!pos) continue;
        if (pos.anchor[0] < insertIdx && !processedCells.has(pos.cell.element)) {
          processedCells.add(pos.cell.element);
          pos.cell.setSpan(pos.span[0] + 1, pos.span[1]);
        }
        if (pos.anchor[0] < insertIdx) {
          coveredCols.add(c);
        }
      }
    }
    for (const tr of trElements) {
      for (const cellEl of findAllChildren(tr, HP_NS, "tc")) {
        const addr = findChild(cellEl, HP_NS, "cellAddr");
        if (addr) {
          const r = parseInt(addr.getAttribute("rowAddr") ?? "0", 10);
          if (r >= insertIdx) {
            addr.setAttribute("rowAddr", String(r + 1));
          }
        }
      }
    }
    const widths = [];
    for (let c = 0; c < colCount; c++) {
      const pos = grid.get(`0,${c}`);
      if (pos && pos.anchor[1] === c) widths.push(pos.cell.width);
      else widths.push(DEFAULT_CELL_WIDTH);
    }
    const doc = this.element.ownerDocument;
    const newTr = createNsElement(doc, HP_NS, "tr");
    for (let c = 0; c < colCount; c++) {
      if (coveredCols.has(c)) continue;
      newTr.appendChild(this._createCell(insertIdx, c, widths[c] ?? DEFAULT_CELL_WIDTH, DEFAULT_CELL_HEIGHT));
    }
    if (insertIdx >= trElements.length) {
      this.element.appendChild(newTr);
    } else {
      this.element.insertBefore(newTr, trElements[insertIdx] ?? null);
    }
    this.element.setAttribute("rowCnt", String(rowCount + 1));
    this.markDirty();
  }
  deleteRow(rowIndex) {
    const rowCount = this.rowCount;
    if (rowCount <= 1) return;
    const trElements = findAllChildren(this.element, HP_NS, "tr");
    const colCount = this.columnCount;
    const grid = this._buildCellGrid();
    const processedCells = /* @__PURE__ */ new Set();
    for (let c = 0; c < colCount; c++) {
      const pos = grid.get(`${rowIndex},${c}`);
      if (!pos || processedCells.has(pos.cell.element)) continue;
      processedCells.add(pos.cell.element);
      const [anchorRow, anchorCol] = pos.anchor;
      const [spanRow, spanCol] = pos.span;
      if (anchorRow === rowIndex) {
        if (spanRow > 1) {
          pos.cell.setSpan(spanRow - 1, spanCol);
          const nextTr = trElements[rowIndex + 1];
          if (nextTr) {
            const nextCells = findAllChildren(nextTr, HP_NS, "tc");
            let inserted = false;
            for (const existing of nextCells) {
              const ea = findChild(existing, HP_NS, "cellAddr");
              if (ea && parseInt(ea.getAttribute("colAddr") ?? "0", 10) > anchorCol) {
                nextTr.insertBefore(pos.cell.element, existing);
                inserted = true;
                break;
              }
            }
            if (!inserted) nextTr.appendChild(pos.cell.element);
          }
        }
      } else {
        pos.cell.setSpan(spanRow - 1, spanCol);
      }
    }
    const trToRemove = trElements[rowIndex];
    if (trToRemove) this.element.removeChild(trToRemove);
    for (const tr of findAllChildren(this.element, HP_NS, "tr")) {
      for (const cellEl of findAllChildren(tr, HP_NS, "tc")) {
        const addr = findChild(cellEl, HP_NS, "cellAddr");
        if (addr) {
          const r = parseInt(addr.getAttribute("rowAddr") ?? "0", 10);
          if (r > rowIndex) addr.setAttribute("rowAddr", String(r - 1));
        }
      }
    }
    this.element.setAttribute("rowCnt", String(rowCount - 1));
    this.markDirty();
  }
  insertColumn(atIndex, position) {
    const insertIdx = position === "before" ? atIndex : atIndex + 1;
    const rowCount = this.rowCount;
    const colCount = this.columnCount;
    const grid = this._buildCellGrid();
    const trElements = findAllChildren(this.element, HP_NS, "tr");
    const coveredRows = /* @__PURE__ */ new Set();
    const processedCells = /* @__PURE__ */ new Set();
    if (insertIdx > 0 && insertIdx < colCount) {
      for (let r = 0; r < rowCount; r++) {
        const pos = grid.get(`${r},${insertIdx}`);
        if (!pos) continue;
        if (pos.anchor[1] < insertIdx && !processedCells.has(pos.cell.element)) {
          processedCells.add(pos.cell.element);
          pos.cell.setSpan(pos.span[0], pos.span[1] + 1);
        }
        if (pos.anchor[1] < insertIdx) coveredRows.add(r);
      }
    }
    for (const tr of trElements) {
      for (const cellEl of findAllChildren(tr, HP_NS, "tc")) {
        const addr = findChild(cellEl, HP_NS, "cellAddr");
        if (addr) {
          const c = parseInt(addr.getAttribute("colAddr") ?? "0", 10);
          if (c >= insertIdx) addr.setAttribute("colAddr", String(c + 1));
        }
      }
    }
    const defaultWidth = colCount > 0 ? Math.floor(this.width / (colCount + 1)) : DEFAULT_CELL_WIDTH;
    for (let r = 0; r < rowCount; r++) {
      if (coveredRows.has(r)) continue;
      const tr = trElements[r];
      if (!tr) continue;
      const cellEl = this._createCell(r, insertIdx, defaultWidth || DEFAULT_CELL_WIDTH, DEFAULT_CELL_HEIGHT);
      const trCells = findAllChildren(tr, HP_NS, "tc");
      let inserted = false;
      for (const existing of trCells) {
        const ea = findChild(existing, HP_NS, "cellAddr");
        if (ea && parseInt(ea.getAttribute("colAddr") ?? "0", 10) > insertIdx) {
          tr.insertBefore(cellEl, existing);
          inserted = true;
          break;
        }
      }
      if (!inserted) tr.appendChild(cellEl);
    }
    this.element.setAttribute("colCnt", String(colCount + 1));
    this.markDirty();
  }
  deleteColumn(colIndex) {
    const colCount = this.columnCount;
    if (colCount <= 1) return;
    const rowCount = this.rowCount;
    const grid = this._buildCellGrid();
    const trElements = findAllChildren(this.element, HP_NS, "tr");
    const processedCells = /* @__PURE__ */ new Set();
    for (let r = 0; r < rowCount; r++) {
      const pos = grid.get(`${r},${colIndex}`);
      if (!pos || processedCells.has(pos.cell.element)) continue;
      processedCells.add(pos.cell.element);
      const [, anchorCol] = pos.anchor;
      const [spanRow, spanCol] = pos.span;
      if (anchorCol === colIndex) {
        if (spanCol > 1) {
          pos.cell.setSpan(spanRow, spanCol - 1);
        } else {
          pos.cell.element.parentNode?.removeChild(pos.cell.element);
        }
      } else {
        pos.cell.setSpan(spanRow, spanCol - 1);
      }
    }
    for (const tr of trElements) {
      for (const cellEl of findAllChildren(tr, HP_NS, "tc")) {
        const addr = findChild(cellEl, HP_NS, "cellAddr");
        if (addr) {
          const c = parseInt(addr.getAttribute("colAddr") ?? "0", 10);
          if (c > colIndex) addr.setAttribute("colAddr", String(c - 1));
        }
      }
    }
    this.element.setAttribute("colCnt", String(colCount - 1));
    this.markDirty();
  }
  mergeCells(startRow, startCol, endRow, endCol) {
    if (startRow > endRow || startCol > endCol) return;
    if (startRow === endRow && startCol === endCol) return;
    const grid = this._buildCellGrid();
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const pos = grid.get(`${r},${c}`);
        if (!pos) continue;
        const [ar, ac] = pos.anchor;
        const [sr, sc] = pos.span;
        if (ar < startRow || ac < startCol || ar + sr - 1 > endRow || ac + sc - 1 > endCol) {
          return;
        }
      }
    }
    const anchorPos = grid.get(`${startRow},${startCol}`);
    if (!anchorPos) return;
    const textsToAppend = [];
    const processedCells = /* @__PURE__ */ new Set();
    processedCells.add(anchorPos.cell.element);
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const pos = grid.get(`${r},${c}`);
        if (!pos || processedCells.has(pos.cell.element)) continue;
        processedCells.add(pos.cell.element);
        const text = pos.cell.text.trim();
        if (text) textsToAppend.push(text);
        pos.cell.element.parentNode?.removeChild(pos.cell.element);
      }
    }
    anchorPos.cell.setSpan(endRow - startRow + 1, endCol - startCol + 1);
    if (textsToAppend.length > 0) {
      const combined = [anchorPos.cell.text, ...textsToAppend].filter(Boolean).join(" ");
      anchorPos.cell.text = combined;
    }
    let totalWidth = 0;
    let totalHeight = 0;
    const seen = /* @__PURE__ */ new Set();
    for (let c = startCol; c <= endCol; c++) {
      const pos = grid.get(`${startRow},${c}`);
      if (pos && pos.anchor[1] === c && !seen.has(pos.cell.element)) {
        seen.add(pos.cell.element);
        totalWidth += pos.cell.width;
      }
    }
    seen.clear();
    for (let r = startRow; r <= endRow; r++) {
      const pos = grid.get(`${r},${startCol}`);
      if (pos && pos.anchor[0] === r && !seen.has(pos.cell.element)) {
        seen.add(pos.cell.element);
        totalHeight += pos.cell.height;
      }
    }
    anchorPos.cell.setSize(totalWidth || void 0, totalHeight || void 0);
    this.markDirty();
  }
  splitCell(row, col) {
    const grid = this._buildCellGrid();
    const pos = grid.get(`${row},${col}`);
    if (!pos) return;
    const [anchorRow, anchorCol] = pos.anchor;
    const [spanRow, spanCol] = pos.span;
    if (spanRow === 1 && spanCol === 1) return;
    const trElements = findAllChildren(this.element, HP_NS, "tr");
    const cellWidth = Math.floor(pos.cell.width / spanCol);
    const cellHeight = Math.floor(pos.cell.height / spanRow);
    pos.cell.setSpan(1, 1);
    pos.cell.setSize(cellWidth, cellHeight);
    for (let r = anchorRow; r < anchorRow + spanRow; r++) {
      const tr = trElements[r];
      if (!tr) continue;
      for (let c = anchorCol; c < anchorCol + spanCol; c++) {
        if (r === anchorRow && c === anchorCol) continue;
        const newCellEl = this._createCell(r, c, cellWidth, cellHeight);
        const trCells = findAllChildren(tr, HP_NS, "tc");
        let inserted = false;
        for (const existing of trCells) {
          const ea = findChild(existing, HP_NS, "cellAddr");
          if (ea && parseInt(ea.getAttribute("colAddr") ?? "0", 10) > c) {
            tr.insertBefore(newCellEl, existing);
            inserted = true;
            break;
          }
        }
        if (!inserted) tr.appendChild(newCellEl);
      }
    }
    this.markDirty();
  }
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.markDirty();
  }
  static create(doc, rows, cols, opts) {
    if (rows <= 0 || cols <= 0) throw new Error("rows and cols must be positive");
    const tableWidth = opts.width ?? cols * DEFAULT_CELL_WIDTH;
    const tableHeight = opts.height ?? rows * DEFAULT_CELL_HEIGHT;
    const borderFill = String(opts.borderFillIdRef);
    const tableAttrs = {
      id: objectId(),
      zOrder: "0",
      numberingType: "TABLE",
      textWrap: "TOP_AND_BOTTOM",
      textFlow: "BOTH_SIDES",
      lock: "0",
      dropcapstyle: "None",
      pageBreak: "CELL",
      repeatHeader: "0",
      rowCnt: String(rows),
      colCnt: String(cols),
      cellSpacing: "0",
      borderFillIDRef: borderFill,
      noAdjust: "0"
    };
    const table = createNsElement(doc, HP_NS, "tbl", tableAttrs);
    subElement(table, HP_NS, "sz", {
      width: String(Math.max(tableWidth, 0)),
      widthRelTo: "ABSOLUTE",
      height: String(Math.max(tableHeight, 0)),
      heightRelTo: "ABSOLUTE",
      protect: "0"
    });
    subElement(table, HP_NS, "pos", {
      treatAsChar: "1",
      affectLSpacing: "0",
      flowWithText: "1",
      allowOverlap: "0",
      holdAnchorAndSO: "0",
      vertRelTo: "PARA",
      horzRelTo: "COLUMN",
      vertAlign: "TOP",
      horzAlign: "LEFT",
      vertOffset: "0",
      horzOffset: "0"
    });
    subElement(table, HP_NS, "outMargin", defaultCellMarginAttributes());
    subElement(table, HP_NS, "inMargin", defaultCellMarginAttributes());
    const columnWidths = distributeSize(Math.max(tableWidth, 0), cols);
    const rowHeights = distributeSize(Math.max(tableHeight, 0), rows);
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
      const row = subElement(table, HP_NS, "tr");
      for (let colIdx = 0; colIdx < cols; colIdx++) {
        const cell = subElement(row, HP_NS, "tc", defaultCellAttributes(borderFill));
        const sl = subElement(cell, HP_NS, "subList", defaultSublistAttributes());
        const p = subElement(sl, HP_NS, "p", defaultCellParagraphAttributes());
        const run = subElement(p, HP_NS, "run", { charPrIDRef: "0" });
        subElement(run, HP_NS, "t");
        subElement(cell, HP_NS, "cellAddr", { colAddr: String(colIdx), rowAddr: String(rowIdx) });
        subElement(cell, HP_NS, "cellSpan", { colSpan: "1", rowSpan: "1" });
        subElement(cell, HP_NS, "cellSz", {
          width: String(columnWidths[colIdx] ?? 0),
          height: String(rowHeights[rowIdx] ?? 0)
        });
        subElement(cell, HP_NS, "cellMargin", defaultCellMarginAttributes());
      }
    }
    return table;
  }
};

// src/oxml/paragraph.ts
var HwpxOxmlRun = class {
  element;
  paragraph;
  constructor(element, paragraph) {
    this.element = element;
    this.paragraph = paragraph;
  }
  get charPrIdRef() {
    return this.element.getAttribute("charPrIDRef");
  }
  set charPrIdRef(value) {
    if (value == null) {
      if (this.element.hasAttribute("charPrIDRef")) {
        this.element.removeAttribute("charPrIDRef");
        this.paragraph.section.markDirty();
      }
      return;
    }
    const newValue = String(value);
    if (this.element.getAttribute("charPrIDRef") !== newValue) {
      this.element.setAttribute("charPrIDRef", newValue);
      this.paragraph.section.markDirty();
    }
  }
  get text() {
    const parts = [];
    for (const node of findAllChildren(this.element, HP_NS, "t")) {
      if (node.textContent) parts.push(node.textContent);
    }
    return parts.join("");
  }
  set text(value) {
    const primary = this._ensurePlainTextNode();
    const changed = (primary.textContent ?? "") !== value;
    primary.textContent = value;
    const plainNodes = this._plainTextNodes();
    for (let i = 1; i < plainNodes.length; i++) {
      if (plainNodes[i].textContent) {
        plainNodes[i].textContent = "";
      }
    }
    if (changed) this.paragraph.section.markDirty();
  }
  get style() {
    const document = this.paragraph.section.document;
    if (!document) return null;
    const charPrId = this.charPrIdRef;
    if (!charPrId) return null;
    return document.charProperty(charPrId);
  }
  replaceText(search, replacement, count) {
    if (!search) throw new Error("search text must be a non-empty string");
    if (count != null && count <= 0) return 0;
    let totalReplacements = 0;
    let remaining = count ?? Infinity;
    for (const textNode of findAllChildren(this.element, HP_NS, "t")) {
      if (remaining <= 0) break;
      let content = textNode.textContent ?? "";
      let replacedCount = 0;
      let result = "";
      let searchStart = 0;
      while (remaining > 0) {
        const pos = content.indexOf(search, searchStart);
        if (pos === -1) {
          result += content.substring(searchStart);
          break;
        }
        result += content.substring(searchStart, pos) + replacement;
        searchStart = pos + search.length;
        replacedCount++;
        remaining--;
      }
      if (searchStart < content.length && remaining <= 0) {
        result += content.substring(searchStart);
      }
      if (replacedCount > 0) {
        textNode.textContent = result;
        totalReplacements += replacedCount;
      }
    }
    if (totalReplacements > 0) this.paragraph.section.markDirty();
    return totalReplacements;
  }
  remove() {
    try {
      this.paragraph.element.removeChild(this.element);
    } catch {
      return;
    }
    this.paragraph.section.markDirty();
  }
  _plainTextNodes() {
    return findAllChildren(this.element, HP_NS, "t").filter(
      (n) => childElements(n).length === 0
    );
  }
  _ensurePlainTextNode() {
    const nodes = this._plainTextNodes();
    if (nodes.length > 0) return nodes[0];
    return subElement(this.element, HP_NS, "t");
  }
};
var HwpxOxmlParagraph = class {
  element;
  section;
  constructor(element, section) {
    this.element = element;
    this.section = section;
  }
  get runs() {
    return findAllChildren(this.element, HP_NS, "run").map((el) => new HwpxOxmlRun(el, this));
  }
  get text() {
    const parts = [];
    for (const el of findAllDescendants(this.element, "t")) {
      if (el.textContent) parts.push(el.textContent);
    }
    return parts.join("");
  }
  set text(value) {
    for (const run2 of findAllChildren(this.element, HP_NS, "run")) {
      for (const child of findAllChildren(run2, HP_NS, "t")) {
        run2.removeChild(child);
      }
    }
    const run = this._ensureRun();
    const t = subElement(run, HP_NS, "t");
    t.textContent = value;
    this.section.markDirty();
  }
  get tables() {
    const tables = [];
    for (const run of findAllChildren(this.element, HP_NS, "run")) {
      for (const child of childElements(run)) {
        if (elementLocalName(child) === "tbl") tables.push(new HwpxOxmlTable(child, this));
      }
    }
    return tables;
  }
  get paraPrIdRef() {
    return this.element.getAttribute("paraPrIDRef");
  }
  set paraPrIdRef(value) {
    if (value == null) {
      if (this.element.hasAttribute("paraPrIDRef")) {
        this.element.removeAttribute("paraPrIDRef");
        this.section.markDirty();
      }
      return;
    }
    const newValue = String(value);
    if (this.element.getAttribute("paraPrIDRef") !== newValue) {
      this.element.setAttribute("paraPrIDRef", newValue);
      this.section.markDirty();
    }
  }
  /** Whether this paragraph forces a column break before it. */
  get columnBreak() {
    return this.element.getAttribute("columnBreak") === "1";
  }
  set columnBreak(value) {
    const newValue = value ? "1" : "0";
    if (this.element.getAttribute("columnBreak") !== newValue) {
      this.element.setAttribute("columnBreak", newValue);
      this.section.markDirty();
    }
  }
  /** Whether this paragraph forces a page break before it. */
  get pageBreak() {
    return this.element.getAttribute("pageBreak") === "1";
  }
  set pageBreak(value) {
    const newValue = value ? "1" : "0";
    if (this.element.getAttribute("pageBreak") !== newValue) {
      this.element.setAttribute("pageBreak", newValue);
      this.section.markDirty();
    }
  }
  get styleIdRef() {
    return this.element.getAttribute("styleIDRef");
  }
  set styleIdRef(value) {
    if (value == null) {
      if (this.element.hasAttribute("styleIDRef")) {
        this.element.removeAttribute("styleIDRef");
        this.section.markDirty();
      }
      return;
    }
    const newValue = String(value);
    if (this.element.getAttribute("styleIDRef") !== newValue) {
      this.element.setAttribute("styleIDRef", newValue);
      this.section.markDirty();
    }
  }
  /** Get the bullet ID reference for list formatting. */
  get bulletIdRef() {
    return this.element.getAttribute("bulletIDRef");
  }
  /** Set the bullet ID reference for list formatting. */
  set bulletIdRef(value) {
    if (value == null) {
      if (this.element.hasAttribute("bulletIDRef")) {
        this.element.removeAttribute("bulletIDRef");
        this.section.markDirty();
      }
      return;
    }
    const newValue = String(value);
    if (this.element.getAttribute("bulletIDRef") !== newValue) {
      this.element.setAttribute("bulletIDRef", newValue);
      this.section.markDirty();
    }
  }
  /** Get the outline level for numbered list (1-9, or 0 for no outline). */
  get outlineLevel() {
    const val = this.element.getAttribute("outlineLevel");
    return val ? parseInt(val, 10) : 0;
  }
  /** Set the outline level for numbered list. */
  set outlineLevel(value) {
    const newValue = String(Math.max(0, Math.min(9, value)));
    if (this.element.getAttribute("outlineLevel") !== newValue) {
      this.element.setAttribute("outlineLevel", newValue);
      this.section.markDirty();
    }
  }
  get charPrIdRef() {
    const values = /* @__PURE__ */ new Set();
    for (const run of findAllChildren(this.element, HP_NS, "run")) {
      const v = run.getAttribute("charPrIDRef");
      if (v != null) values.add(v);
    }
    if (values.size === 0) return null;
    if (values.size === 1) return values.values().next().value;
    return null;
  }
  set charPrIdRef(value) {
    const newValue = value == null ? null : String(value);
    let runs = findAllChildren(this.element, HP_NS, "run");
    if (runs.length === 0) runs = [this._ensureRun()];
    let changed = false;
    for (const run of runs) {
      if (newValue == null) {
        if (run.hasAttribute("charPrIDRef")) {
          run.removeAttribute("charPrIDRef");
          changed = true;
        }
      } else {
        if (run.getAttribute("charPrIDRef") !== newValue) {
          run.setAttribute("charPrIDRef", newValue);
          changed = true;
        }
      }
    }
    if (changed) this.section.markDirty();
  }
  addRun(text = "", opts) {
    const runAttrs = { ...opts?.attributes ?? {} };
    if (!("charPrIDRef" in runAttrs)) {
      if (opts?.charPrIdRef != null) {
        runAttrs["charPrIDRef"] = String(opts.charPrIdRef);
      } else {
        runAttrs["charPrIDRef"] = this.charPrIdRef ?? "0";
      }
    }
    const runElement = subElement(this.element, HP_NS, "run", runAttrs);
    const t = subElement(runElement, HP_NS, "t");
    t.textContent = text;
    this.section.markDirty();
    return new HwpxOxmlRun(runElement, this);
  }
  /** Insert a tab character at the end of the paragraph. */
  addTab(opts) {
    const charPrId = opts?.charPrIdRef ?? this.charPrIdRef ?? "0";
    const runAttrs = { charPrIDRef: String(charPrId) };
    const tabAttrs = {};
    if (opts?.width != null) {
      tabAttrs.width = String(opts.width);
    }
    if (opts?.tabLeader != null && opts.tabLeader !== "NONE") {
      tabAttrs.tabLeader = opts.tabLeader;
    }
    const runElement = subElement(this.element, HP_NS, "run", runAttrs);
    subElement(runElement, HP_NS, "tab", tabAttrs);
    this.section.markDirty();
  }
  addTable(rows, cols, opts) {
    let borderFillIdRef = opts?.borderFillIdRef;
    if (borderFillIdRef == null) {
      const document = this.section.document;
      if (document) borderFillIdRef = document.ensureBasicBorderFill();
      else borderFillIdRef = "0";
    }
    const doc = this.element.ownerDocument;
    const run = subElement(this.element, HP_NS, "run", { charPrIDRef: this.charPrIdRef ?? "0" });
    const tableElement = HwpxOxmlTable.create(doc, rows, cols, {
      width: opts?.width,
      height: opts?.height,
      borderFillIdRef
    });
    run.appendChild(tableElement);
    this.section.markDirty();
    return new HwpxOxmlTable(tableElement, this);
  }
  /**
   * Add a picture (image) element to this paragraph.
   * @param binaryItemIdRef - The binary item ID returned by HwpxPackage.addBinaryItem()
   * @param opts - width/height in hwpUnits (7200 = 1 inch). Use mmToHwp() to convert from mm.
   */
  addPicture(binaryItemIdRef, opts) {
    const doc = this.element.ownerDocument;
    const width = Math.max(opts.width, 1);
    const height = Math.max(opts.height, 1);
    const textWrap = opts.textWrap ?? "TOP_AND_BOTTOM";
    const treatAsChar = opts.treatAsChar !== false ? "1" : "0";
    const run = subElement(this.element, HP_NS, "run", { charPrIDRef: this.charPrIdRef ?? "0" });
    const pic = createNsElement(doc, HP_NS, "pic", {
      id: objectId(),
      zOrder: "0",
      numberingType: "PICTURE",
      textWrap,
      textFlow: "BOTH_SIDES",
      lock: "0",
      dropcapstyle: "None",
      href: "",
      groupLevel: "0",
      instid: objectId(),
      reverse: "0"
    });
    run.appendChild(pic);
    subElement(pic, HP_NS, "offset", { x: "0", y: "0" });
    subElement(pic, HP_NS, "orgSz", { width: String(width), height: String(height) });
    subElement(pic, HP_NS, "curSz", { width: String(width), height: String(height) });
    subElement(pic, HP_NS, "flip", { horizontal: "0", vertical: "0" });
    subElement(pic, HP_NS, "rotationInfo", {
      angle: "0",
      centerX: String(Math.floor(width / 2)),
      centerY: String(Math.floor(height / 2)),
      rotateimage: "1"
    });
    const renderingInfo = subElement(pic, HP_NS, "renderingInfo");
    createNsElement(doc, HC_NS, "transMatrix", { e1: "1", e2: "0", e3: "0", e4: "0", e5: "1", e6: "0" });
    renderingInfo.appendChild(createNsElement(doc, HC_NS, "transMatrix", { e1: "1", e2: "0", e3: "0", e4: "0", e5: "1", e6: "0" }));
    renderingInfo.appendChild(createNsElement(doc, HC_NS, "scaMatrix", { e1: "1", e2: "0", e3: "0", e4: "0", e5: "1", e6: "0" }));
    renderingInfo.appendChild(createNsElement(doc, HC_NS, "rotMatrix", { e1: "1", e2: "0", e3: "0", e4: "0", e5: "1", e6: "0" }));
    const img = createNsElement(doc, HC_NS, "img", {
      binaryItemIDRef: binaryItemIdRef,
      bright: "0",
      contrast: "0",
      effect: "REAL_PIC",
      alpha: "0"
    });
    pic.appendChild(img);
    const imgRect = subElement(pic, HP_NS, "imgRect");
    imgRect.appendChild(createNsElement(doc, HC_NS, "pt0", { x: "0", y: "0" }));
    imgRect.appendChild(createNsElement(doc, HC_NS, "pt1", { x: String(width), y: "0" }));
    imgRect.appendChild(createNsElement(doc, HC_NS, "pt2", { x: String(width), y: String(height) }));
    imgRect.appendChild(createNsElement(doc, HC_NS, "pt3", { x: "0", y: String(height) }));
    subElement(pic, HP_NS, "imgClip", { left: "0", right: String(width), top: "0", bottom: String(height) });
    subElement(pic, HP_NS, "inMargin", { left: "0", right: "0", top: "0", bottom: "0" });
    subElement(pic, HP_NS, "imgDim", { dimwidth: String(width), dimheight: String(height) });
    subElement(pic, HP_NS, "effects");
    subElement(pic, HP_NS, "sz", {
      width: String(width),
      widthRelTo: "ABSOLUTE",
      height: String(height),
      heightRelTo: "ABSOLUTE",
      protect: "0"
    });
    subElement(pic, HP_NS, "pos", {
      treatAsChar,
      affectLSpacing: "0",
      flowWithText: "1",
      allowOverlap: "0",
      holdAnchorAndSO: "0",
      vertRelTo: "PARA",
      horzRelTo: "COLUMN",
      vertAlign: "TOP",
      horzAlign: "LEFT",
      vertOffset: "0",
      horzOffset: "0"
    });
    subElement(pic, HP_NS, "outMargin", { left: "0", right: "0", top: "0", bottom: "0" });
    this.section.markDirty();
    return pic;
  }
  /** Return all <pic> elements across all runs. */
  get pictures() {
    const pics = [];
    for (const run of findAllChildren(this.element, HP_NS, "run")) {
      for (const child of childElements(run)) {
        if (elementLocalName(child) === "pic") pics.push(child);
      }
    }
    return pics;
  }
  /**
   * Set the size of a picture element (by index) in hwpUnits.
   * Updates curSz, sz, imgRect, imgClip, imgDim, and rotationInfo.
   */
  setPictureSize(pictureIndex, width, height) {
    const pics = this.pictures;
    const pic = pics[pictureIndex];
    if (!pic) return;
    const w = Math.max(width, 1);
    const h = Math.max(height, 1);
    const curSz = findChild(pic, HP_NS, "curSz");
    if (curSz) {
      curSz.setAttribute("width", String(w));
      curSz.setAttribute("height", String(h));
    }
    const sz = findChild(pic, HP_NS, "sz");
    if (sz) {
      sz.setAttribute("width", String(w));
      sz.setAttribute("height", String(h));
    }
    const imgRect = findChild(pic, HP_NS, "imgRect");
    if (imgRect) {
      const pts = childElements(imgRect);
      if (pts[0]) {
        pts[0].setAttribute("x", "0");
        pts[0].setAttribute("y", "0");
      }
      if (pts[1]) {
        pts[1].setAttribute("x", String(w));
        pts[1].setAttribute("y", "0");
      }
      if (pts[2]) {
        pts[2].setAttribute("x", String(w));
        pts[2].setAttribute("y", String(h));
      }
      if (pts[3]) {
        pts[3].setAttribute("x", "0");
        pts[3].setAttribute("y", String(h));
      }
    }
    const imgClip = findChild(pic, HP_NS, "imgClip");
    if (imgClip) {
      imgClip.setAttribute("right", String(w));
      imgClip.setAttribute("bottom", String(h));
    }
    const imgDim = findChild(pic, HP_NS, "imgDim");
    if (imgDim) {
      imgDim.setAttribute("dimwidth", String(w));
      imgDim.setAttribute("dimheight", String(h));
    }
    const rotInfo = findChild(pic, HP_NS, "rotationInfo");
    if (rotInfo) {
      rotInfo.setAttribute("centerX", String(Math.floor(w / 2)));
      rotInfo.setAttribute("centerY", String(Math.floor(h / 2)));
    }
    this.section.markDirty();
  }
  /** Get picture outer margin by index. */
  getPictureOutMargin(pictureIndex) {
    const pic = this.pictures[pictureIndex];
    if (!pic) return { top: 0, bottom: 0, left: 0, right: 0 };
    const el = findChild(pic, HP_NS, "outMargin");
    if (!el) return { top: 0, bottom: 0, left: 0, right: 0 };
    return {
      top: parseInt(el.getAttribute("top") ?? "0", 10),
      bottom: parseInt(el.getAttribute("bottom") ?? "0", 10),
      left: parseInt(el.getAttribute("left") ?? "0", 10),
      right: parseInt(el.getAttribute("right") ?? "0", 10)
    };
  }
  /** Set picture outer margin by index. */
  setPictureOutMargin(pictureIndex, margin) {
    const pic = this.pictures[pictureIndex];
    if (!pic) return;
    let el = findChild(pic, HP_NS, "outMargin");
    if (!el) el = subElement(pic, HP_NS, "outMargin", { left: "0", right: "0", top: "0", bottom: "0" });
    if (margin.top != null) el.setAttribute("top", String(Math.max(margin.top, 0)));
    if (margin.bottom != null) el.setAttribute("bottom", String(Math.max(margin.bottom, 0)));
    if (margin.left != null) el.setAttribute("left", String(Math.max(margin.left, 0)));
    if (margin.right != null) el.setAttribute("right", String(Math.max(margin.right, 0)));
    this.section.markDirty();
  }
  /** Get picture inner margin by index. */
  getPictureInMargin(pictureIndex) {
    const pic = this.pictures[pictureIndex];
    if (!pic) return { top: 0, bottom: 0, left: 0, right: 0 };
    const el = findChild(pic, HP_NS, "inMargin");
    if (!el) return { top: 0, bottom: 0, left: 0, right: 0 };
    return {
      top: parseInt(el.getAttribute("top") ?? "0", 10),
      bottom: parseInt(el.getAttribute("bottom") ?? "0", 10),
      left: parseInt(el.getAttribute("left") ?? "0", 10),
      right: parseInt(el.getAttribute("right") ?? "0", 10)
    };
  }
  /** Set picture inner margin by index. */
  setPictureInMargin(pictureIndex, margin) {
    const pic = this.pictures[pictureIndex];
    if (!pic) return;
    let el = findChild(pic, HP_NS, "inMargin");
    if (!el) el = subElement(pic, HP_NS, "inMargin", { left: "0", right: "0", top: "0", bottom: "0" });
    if (margin.top != null) el.setAttribute("top", String(Math.max(margin.top, 0)));
    if (margin.bottom != null) el.setAttribute("bottom", String(Math.max(margin.bottom, 0)));
    if (margin.left != null) el.setAttribute("left", String(Math.max(margin.left, 0)));
    if (margin.right != null) el.setAttribute("right", String(Math.max(margin.right, 0)));
    this.section.markDirty();
  }
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
  addEquation(script, opts) {
    const doc = this.element.ownerDocument;
    const width = opts?.width ?? 3e3;
    const height = opts?.height ?? 1100;
    const textColor = opts?.textColor ?? "#000000";
    const font = opts?.font ?? "HancomEQN";
    const baseUnit = opts?.baseUnit ?? 1e3;
    const baseLine = opts?.baseLine ?? 85;
    const runCharPrId = opts?.charPrIdRef != null ? String(opts.charPrIdRef) : this.charPrIdRef ?? "0";
    const run = subElement(this.element, HP_NS, "run", { charPrIDRef: runCharPrId });
    const eq = createNsElement(doc, HP_NS, "equation", {
      id: objectId(),
      zOrder: "0",
      numberingType: "EQUATION",
      textWrap: "TOP_AND_BOTTOM",
      textFlow: "BOTH_SIDES",
      lock: "0",
      dropcapstyle: "None",
      version: "Equation Version 60",
      baseLine: String(baseLine),
      textColor,
      baseUnit: String(baseUnit),
      lineMode: "CHAR",
      font
    });
    run.appendChild(eq);
    subElement(eq, HP_NS, "sz", {
      width: String(width),
      widthRelTo: "ABSOLUTE",
      height: String(height),
      heightRelTo: "ABSOLUTE",
      protect: "0"
    });
    subElement(eq, HP_NS, "pos", {
      treatAsChar: "1",
      affectLSpacing: "0",
      flowWithText: "1",
      allowOverlap: "0",
      holdAnchorAndSO: "0",
      vertRelTo: "PARA",
      horzRelTo: "PARA",
      vertAlign: "TOP",
      horzAlign: "LEFT",
      vertOffset: "0",
      horzOffset: "0"
    });
    subElement(eq, HP_NS, "outMargin", { left: "56", right: "56", top: "0", bottom: "0" });
    const commentEl = subElement(eq, HP_NS, "shapeComment");
    commentEl.textContent = "\uC218\uC2DD\uC785\uB2C8\uB2E4.";
    const scriptEl = subElement(eq, HP_NS, "script");
    if (script.includes("#") || script.includes("\n")) {
      scriptEl.setAttribute("xml:space", "preserve");
    }
    scriptEl.textContent = script;
    this.section.markDirty();
    return eq;
  }
  /** Return all <equation> elements across all runs. */
  get equations() {
    const eqs = [];
    for (const run of findAllChildren(this.element, HP_NS, "run")) {
      for (const child of childElements(run)) {
        if (elementLocalName(child) === "equation") eqs.push(child);
      }
    }
    return eqs;
  }
  /**
   * Add a text box (drawText) element to this paragraph.
   * @param text - The text content of the text box
   * @param opts - width/height in hwpUnits
   */
  addTextBox(text, opts) {
    const doc = this.element.ownerDocument;
    const width = Math.max(opts.width, 1);
    const height = Math.max(opts.height, 1);
    const x = opts.x ?? 0;
    const y = opts.y ?? 0;
    const textWrap = opts.textWrap ?? "SQUARE";
    const borderColor = opts.borderColor ?? "#000000";
    const fillColor = opts.fillColor ?? "#FFFFFF";
    const runCharPrId = opts.charPrIdRef != null ? String(opts.charPrIdRef) : this.charPrIdRef ?? "0";
    const run = subElement(this.element, HP_NS, "run", { charPrIDRef: runCharPrId });
    const drawText = createNsElement(doc, HP_NS, "drawText", {
      id: objectId(),
      zOrder: "0",
      numberingType: "TEXTBOX",
      textWrap,
      textFlow: "BOTH_SIDES",
      lock: "0",
      dropcapstyle: "None",
      editable: "1",
      drawTextVerticalAlign: "TOP"
    });
    run.appendChild(drawText);
    subElement(drawText, HP_NS, "sz", {
      width: String(width),
      widthRelTo: "ABSOLUTE",
      height: String(height),
      heightRelTo: "ABSOLUTE",
      protect: "0"
    });
    subElement(drawText, HP_NS, "pos", {
      treatAsChar: "0",
      affectLSpacing: "0",
      flowWithText: "1",
      allowOverlap: "0",
      holdAnchorAndSO: "0",
      vertRelTo: "PARA",
      horzRelTo: "COLUMN",
      vertAlign: "TOP",
      horzAlign: "LEFT",
      vertOffset: String(y),
      horzOffset: String(x)
    });
    subElement(drawText, HP_NS, "outMargin", { left: "0", right: "0", top: "0", bottom: "0" });
    const lineShape = subElement(drawText, HP_NS, "lineShape", {
      color: borderColor,
      width: "0.12mm",
      style: "SOLID",
      endCap: "FLAT",
      headStyle: "NORMAL",
      tailStyle: "NORMAL"
    });
    const fillBrush = subElement(drawText, HP_NS, "fillBrush");
    subElement(fillBrush, HC_NS, "winBrush", {
      faceColor: fillColor,
      hatchColor: "#FFFFFF",
      alpha: "0"
    });
    const textMargin = subElement(drawText, HP_NS, "textMargin", { left: "100", right: "100", top: "100", bottom: "100" });
    const subPara = createNsElement(doc, HP_NS, "p", DEFAULT_PARAGRAPH_ATTRS);
    drawText.appendChild(subPara);
    const subRun = subElement(subPara, HP_NS, "run", { charPrIDRef: runCharPrId });
    const tEl = subElement(subRun, HP_NS, "t");
    tEl.textContent = text;
    this.section.markDirty();
    return drawText;
  }
  /** Return all <drawText> (text box) elements across all runs. */
  get textBoxes() {
    const boxes = [];
    for (const run of findAllChildren(this.element, HP_NS, "run")) {
      for (const child of childElements(run)) {
        if (elementLocalName(child) === "drawText") boxes.push(child);
      }
    }
    return boxes;
  }
  /** Get text box size. */
  getTextBoxSize(index) {
    const box = this.textBoxes[index];
    if (!box) return { width: 0, height: 0 };
    const sz = findChild(box, HP_NS, "sz");
    if (!sz) return { width: 0, height: 0 };
    return {
      width: parseInt(sz.getAttribute("width") ?? "0", 10),
      height: parseInt(sz.getAttribute("height") ?? "0", 10)
    };
  }
  /** Set text box size. */
  setTextBoxSize(index, width, height) {
    const box = this.textBoxes[index];
    if (!box) return;
    const sz = findChild(box, HP_NS, "sz");
    if (sz) {
      sz.setAttribute("width", String(Math.max(width, 1)));
      sz.setAttribute("height", String(Math.max(height, 1)));
    }
    this.section.markDirty();
  }
  /** Get text box text content. */
  getTextBoxText(index) {
    const box = this.textBoxes[index];
    if (!box) return "";
    const parts = [];
    for (const t of findAllDescendants(box, "t")) {
      if (t.textContent) parts.push(t.textContent);
    }
    return parts.join("");
  }
  /** Set text box text content. */
  setTextBoxText(index, text) {
    const box = this.textBoxes[index];
    if (!box) return;
    const tElements = findAllDescendants(box, "t");
    if (tElements.length > 0) {
      tElements[0].textContent = text;
      for (let i = 1; i < tElements.length; i++) {
        tElements[i].textContent = "";
      }
    }
    this.section.markDirty();
  }
  remove() {
    const parent = this.element.parentNode;
    if (!parent) return;
    parent.removeChild(this.element);
    this.section.markDirty();
  }
  /**
   * Apply a character property to a specific text range.
   * This will split runs as needed to apply formatting only to the selected range.
   * @param startOffset - Start character offset (0-based)
   * @param endOffset - End character offset (exclusive)
   * @param charPrIdRef - The character property ID to apply
   */
  applyCharFormatToRange(startOffset, endOffset, charPrIdRef) {
    if (startOffset >= endOffset) return;
    const runs = this.runs;
    if (runs.length === 0) return;
    const chars = [];
    for (let ri = 0; ri < runs.length; ri++) {
      const runText = runs[ri].text;
      for (let ci = 0; ci < runText.length; ci++) {
        chars.push({ runIndex: ri, localOffset: ci, char: runText[ci] });
      }
    }
    if (startOffset >= chars.length) return;
    const actualEnd = Math.min(endOffset, chars.length);
    const newRuns = [];
    if (startOffset > 0) {
      const beforeText = chars.slice(0, startOffset).map((c) => c.char).join("");
      const beforeCharPr = runs[chars[0].runIndex].charPrIdRef;
      newRuns.push({ text: beforeText, charPrIdRef: beforeCharPr });
    }
    const selectedText = chars.slice(startOffset, actualEnd).map((c) => c.char).join("");
    newRuns.push({ text: selectedText, charPrIdRef: String(charPrIdRef) });
    if (actualEnd < chars.length) {
      const afterText = chars.slice(actualEnd).map((c) => c.char).join("");
      const afterCharPr = runs[chars[actualEnd].runIndex].charPrIdRef;
      newRuns.push({ text: afterText, charPrIdRef: afterCharPr });
    }
    for (const run of runs) {
      run.remove();
    }
    for (const nr of newRuns) {
      if (nr.text) {
        this.addRun(nr.text, { charPrIdRef: nr.charPrIdRef ?? "0" });
      }
    }
    this.section.markDirty();
  }
  _ensureRun() {
    const runs = findAllChildren(this.element, HP_NS, "run");
    if (runs.length > 0) return runs[0];
    return subElement(this.element, HP_NS, "run", { charPrIDRef: this.charPrIdRef ?? "0" });
  }
};

// src/oxml/memo.ts
var HwpxOxmlMemo = class {
  element;
  group;
  constructor(element, group) {
    this.element = element;
    this.group = group;
  }
  get id() {
    return this.element.getAttribute("id");
  }
  set id(value) {
    if (value == null) {
      if (this.element.hasAttribute("id")) {
        this.element.removeAttribute("id");
        this.group.section.markDirty();
      }
      return;
    }
    const v = String(value);
    if (this.element.getAttribute("id") !== v) {
      this.element.setAttribute("id", v);
      this.group.section.markDirty();
    }
  }
  get memoShapeIdRef() {
    return this.element.getAttribute("memoShapeIDRef");
  }
  set memoShapeIdRef(value) {
    if (value == null) {
      if (this.element.hasAttribute("memoShapeIDRef")) {
        this.element.removeAttribute("memoShapeIDRef");
        this.group.section.markDirty();
      }
      return;
    }
    const v = String(value);
    if (this.element.getAttribute("memoShapeIDRef") !== v) {
      this.element.setAttribute("memoShapeIDRef", v);
      this.group.section.markDirty();
    }
  }
  get text() {
    const parts = [];
    for (const p of this.paragraphs) {
      const v = p.text;
      if (v) parts.push(v);
    }
    return parts.join("\n");
  }
  set text(value) {
    this.setText(value);
  }
  setText(value, charPrIdRef) {
    for (const child of childElements(this.element)) {
      const name = elementLocalName(child);
      if (name === "paraList" || name === "p") this.element.removeChild(child);
    }
    const doc = this.element.ownerDocument;
    const paraList = subElement(this.element, HP_NS, "paraList");
    const p = createParagraphElement(doc, value, {
      charPrIdRef: charPrIdRef ?? "0"
    });
    paraList.appendChild(p);
    this.group.section.markDirty();
  }
  get paragraphs() {
    return findAllDescendants(this.element, "p").map(
      (el) => new HwpxOxmlParagraph(el, this.group.section)
    );
  }
  remove() {
    try {
      this.group.element.removeChild(this.element);
    } catch {
      return;
    }
    this.group.section.markDirty();
    this.group._cleanup();
  }
};
var HwpxOxmlMemoGroup = class {
  element;
  section;
  constructor(element, section) {
    this.element = element;
    this.section = section;
  }
  get memos() {
    return findAllChildren(this.element, HP_NS, "memo").map(
      (el) => new HwpxOxmlMemo(el, this)
    );
  }
  addMemo(text = "", opts) {
    const attrs = { ...opts?.attributes ?? {} };
    if (!attrs["id"]) attrs["id"] = opts?.memoId ?? memoId();
    if (opts?.memoShapeIdRef != null) {
      if (!attrs["memoShapeIDRef"]) attrs["memoShapeIDRef"] = String(opts.memoShapeIdRef);
    }
    const memoElement = subElement(this.element, HP_NS, "memo", attrs);
    const memo = new HwpxOxmlMemo(memoElement, this);
    memo.setText(text, opts?.charPrIdRef);
    this.section.markDirty();
    return memo;
  }
  _cleanup() {
    if (childElements(this.element).length > 0) return;
    try {
      this.section._element.removeChild(this.element);
    } catch {
      return;
    }
    this.section.markDirty();
  }
};

// src/oxml/section.ts
var HwpxOxmlSectionHeaderFooter = class {
  element;
  _properties;
  _applyElement;
  constructor(element, properties, applyElement = null) {
    this.element = element;
    this._properties = properties;
    this._applyElement = applyElement;
  }
  get applyElement() {
    return this._applyElement;
  }
  get id() {
    return this.element.getAttribute("id");
  }
  set id(value) {
    if (value == null) {
      let changed2 = false;
      if (this.element.hasAttribute("id")) {
        this.element.removeAttribute("id");
        changed2 = true;
      }
      if (this._updateApplyReference(null)) changed2 = true;
      if (changed2) this._properties.section.markDirty();
      return;
    }
    const newValue = String(value);
    let changed = false;
    if (this.element.getAttribute("id") !== newValue) {
      this.element.setAttribute("id", newValue);
      changed = true;
    }
    if (this._updateApplyReference(newValue)) changed = true;
    if (changed) this._properties.section.markDirty();
  }
  get applyPageType() {
    const value = this.element.getAttribute("applyPageType");
    if (value != null) return value;
    if (this._applyElement != null) return this._applyElement.getAttribute("applyPageType") ?? "BOTH";
    return "BOTH";
  }
  set applyPageType(value) {
    let changed = false;
    if (this.element.getAttribute("applyPageType") !== value) {
      this.element.setAttribute("applyPageType", value);
      changed = true;
    }
    if (this._applyElement != null && this._applyElement.getAttribute("applyPageType") !== value) {
      this._applyElement.setAttribute("applyPageType", value);
      changed = true;
    }
    if (changed) this._properties.section.markDirty();
  }
  _applyIdAttributes() {
    const tag = this.element.tagName ?? this.element.localName ?? "";
    if (tag.endsWith("header")) return ["idRef", "headerIDRef", "headerIdRef", "headerRef"];
    return ["idRef", "footerIDRef", "footerIdRef", "footerRef"];
  }
  _updateApplyReference(value) {
    const apply = this._applyElement;
    if (!apply) return false;
    const candidateKeys = new Set(this._applyIdAttributes().map((n) => n.toLowerCase()));
    const attrCandidates = [];
    const namedMap = apply.attributes;
    for (let i = 0; i < namedMap.length; i++) {
      const attr = namedMap.item(i);
      if (attr && candidateKeys.has(attr.name.toLowerCase())) {
        attrCandidates.push(attr.name);
      }
    }
    let changed = false;
    if (value == null) {
      for (const attr of attrCandidates) {
        if (apply.hasAttribute(attr)) {
          apply.removeAttribute(attr);
          changed = true;
        }
      }
      return changed;
    }
    let targetAttr = null;
    const tag = this.element.tagName ?? this.element.localName ?? "";
    for (const attr of attrCandidates) {
      const lower = attr.toLowerCase();
      if (lower === "idref" || tag.endsWith("header") && lower.includes("header") || tag.endsWith("footer") && lower.includes("footer")) {
        targetAttr = attr;
        break;
      }
    }
    if (targetAttr == null) targetAttr = this._applyIdAttributes()[0];
    if (apply.getAttribute(targetAttr) !== value) {
      apply.setAttribute(targetAttr, value);
      changed = true;
    }
    const namedMap2 = apply.attributes;
    for (let i = namedMap2.length - 1; i >= 0; i--) {
      const attr = namedMap2.item(i);
      if (attr && attr.name !== targetAttr && candidateKeys.has(attr.name.toLowerCase())) {
        apply.removeAttribute(attr.name);
        changed = true;
      }
    }
    return changed;
  }
  get text() {
    const parts = [];
    for (const node of findAllDescendants(this.element, "t")) {
      if (node.textContent) parts.push(node.textContent);
    }
    return parts.join("");
  }
  set text(value) {
    for (const child of findAllChildren(this.element, HP_NS, "subList")) {
      this.element.removeChild(child);
    }
    const textNode = this._ensureTextElement();
    textNode.textContent = value;
    this._properties.section.markDirty();
  }
  _ensureTextElement() {
    let sublist = findChild(this.element, HP_NS, "subList");
    if (!sublist) {
      const attrs = defaultSublistAttributes();
      attrs["vertAlign"] = (this.element.tagName ?? "").endsWith("header") ? "TOP" : "BOTTOM";
      sublist = subElement(this.element, HP_NS, "subList", attrs);
    }
    let paragraph = findChild(sublist, HP_NS, "p");
    if (!paragraph) {
      const pAttrs = { ...DEFAULT_PARAGRAPH_ATTRS, id: paragraphId() };
      paragraph = subElement(sublist, HP_NS, "p", pAttrs);
    }
    let run = findChild(paragraph, HP_NS, "run");
    if (!run) {
      run = subElement(paragraph, HP_NS, "run", { charPrIDRef: "0" });
    }
    let t = findChild(run, HP_NS, "t");
    if (!t) {
      t = subElement(run, HP_NS, "t");
    }
    return t;
  }
};
var HwpxOxmlSectionProperties = class {
  element;
  section;
  constructor(element, section) {
    this.element = element;
    this.section = section;
  }
  _pagePrElement(create = false) {
    let pagePr = findChild(this.element, HP_NS, "pagePr");
    if (!pagePr && create) {
      pagePr = subElement(this.element, HP_NS, "pagePr", {
        landscape: "PORTRAIT",
        width: "0",
        height: "0",
        gutterType: "LEFT_ONLY"
      });
      this.section.markDirty();
    }
    return pagePr;
  }
  _marginElement(create = false) {
    const pagePr = this._pagePrElement(create);
    if (!pagePr) return null;
    let margin = findChild(pagePr, HP_NS, "margin");
    if (!margin && create) {
      margin = subElement(pagePr, HP_NS, "margin", {
        left: "0",
        right: "0",
        top: "0",
        bottom: "0",
        header: "0",
        footer: "0",
        gutter: "0"
      });
      this.section.markDirty();
    }
    return margin;
  }
  get pageSize() {
    const pagePr = this._pagePrElement();
    if (!pagePr) return { width: 0, height: 0, orientation: "PORTRAIT", gutterType: "LEFT_ONLY" };
    return {
      width: getIntAttr(pagePr, "width", 0),
      height: getIntAttr(pagePr, "height", 0),
      orientation: pagePr.getAttribute("landscape") ?? "PORTRAIT",
      gutterType: pagePr.getAttribute("gutterType") ?? "LEFT_ONLY"
    };
  }
  setPageSize(opts) {
    const pagePr = this._pagePrElement(true);
    if (!pagePr) return;
    let changed = false;
    if (opts.width != null) {
      const v = String(Math.max(opts.width, 0));
      if (pagePr.getAttribute("width") !== v) {
        pagePr.setAttribute("width", v);
        changed = true;
      }
    }
    if (opts.height != null) {
      const v = String(Math.max(opts.height, 0));
      if (pagePr.getAttribute("height") !== v) {
        pagePr.setAttribute("height", v);
        changed = true;
      }
    }
    if (opts.orientation != null && pagePr.getAttribute("landscape") !== opts.orientation) {
      pagePr.setAttribute("landscape", opts.orientation);
      changed = true;
    }
    if (opts.gutterType != null && pagePr.getAttribute("gutterType") !== opts.gutterType) {
      pagePr.setAttribute("gutterType", opts.gutterType);
      changed = true;
    }
    if (changed) this.section.markDirty();
  }
  get pageMargins() {
    const margin = this._marginElement();
    if (!margin) return { left: 0, right: 0, top: 0, bottom: 0, header: 0, footer: 0, gutter: 0 };
    return {
      left: getIntAttr(margin, "left", 0),
      right: getIntAttr(margin, "right", 0),
      top: getIntAttr(margin, "top", 0),
      bottom: getIntAttr(margin, "bottom", 0),
      header: getIntAttr(margin, "header", 0),
      footer: getIntAttr(margin, "footer", 0),
      gutter: getIntAttr(margin, "gutter", 0)
    };
  }
  setPageMargins(opts) {
    const margin = this._marginElement(true);
    if (!margin) return;
    let changed = false;
    for (const [name, value] of Object.entries(opts)) {
      if (value == null) continue;
      const safeValue = String(Math.max(value, 0));
      if (margin.getAttribute(name) !== safeValue) {
        margin.setAttribute(name, safeValue);
        changed = true;
      }
    }
    if (changed) this.section.markDirty();
  }
  get startNumbering() {
    const startNum = findChild(this.element, HP_NS, "startNum");
    if (!startNum) return { pageStartsOn: "BOTH", page: 0, picture: 0, table: 0, equation: 0 };
    return {
      pageStartsOn: startNum.getAttribute("pageStartsOn") ?? "BOTH",
      page: getIntAttr(startNum, "page", 0),
      picture: getIntAttr(startNum, "pic", 0),
      table: getIntAttr(startNum, "tbl", 0),
      equation: getIntAttr(startNum, "equation", 0)
    };
  }
  setStartNumbering(opts) {
    let startNum = findChild(this.element, HP_NS, "startNum");
    if (!startNum) {
      startNum = subElement(this.element, HP_NS, "startNum", {
        pageStartsOn: "BOTH",
        page: "0",
        pic: "0",
        tbl: "0",
        equation: "0"
      });
      this.section.markDirty();
    }
    let changed = false;
    if (opts.pageStartsOn != null && startNum.getAttribute("pageStartsOn") !== opts.pageStartsOn) {
      startNum.setAttribute("pageStartsOn", opts.pageStartsOn);
      changed = true;
    }
    const nameMap = [
      ["page", opts.page],
      ["pic", opts.picture],
      ["tbl", opts.table],
      ["equation", opts.equation]
    ];
    for (const [name, value] of nameMap) {
      if (value == null) continue;
      const safeValue = String(Math.max(value, 0));
      if (startNum.getAttribute(name) !== safeValue) {
        startNum.setAttribute(name, safeValue);
        changed = true;
      }
    }
    if (changed) this.section.markDirty();
  }
  // -- Column layout helpers --
  /**
   * Find the colPr element which lives in a ctrl element that is a sibling
   * of secPr inside the same run element.
   */
  _findColPrElement() {
    const run = this.element.parentNode;
    if (!run) return null;
    for (const ctrl of findAllChildren(run, HP_NS, "ctrl")) {
      const colPr = findChild(ctrl, HP_NS, "colPr");
      if (colPr) return colPr;
    }
    return null;
  }
  /**
   * Ensure the colPr element exists, creating the ctrl wrapper if needed.
   */
  _ensureColPrElement() {
    const existing = this._findColPrElement();
    if (existing) return existing;
    const run = this.element.parentNode;
    const ctrl = subElement(run, HP_NS, "ctrl");
    const colPr = subElement(ctrl, HP_NS, "colPr", {
      id: "",
      type: "NEWSPAPER",
      layout: "LEFT",
      colCount: "1",
      sameSz: "1",
      sameGap: "0"
    });
    this.section.markDirty();
    return colPr;
  }
  get columnLayout() {
    const colPr = this._findColPrElement();
    if (!colPr) {
      return { type: "NEWSPAPER", layout: "LEFT", colCount: 1, sameSz: true, sameGap: 0 };
    }
    const sameSz = colPr.getAttribute("sameSz") !== "0";
    const result = {
      type: colPr.getAttribute("type") ?? "NEWSPAPER",
      layout: colPr.getAttribute("layout") ?? "LEFT",
      colCount: getIntAttr(colPr, "colCount", 1),
      sameSz,
      sameGap: getIntAttr(colPr, "sameGap", 0)
    };
    if (!sameSz) {
      const cols = [];
      for (const colSz of findAllChildren(colPr, HP_NS, "colSz")) {
        cols.push({
          width: getIntAttr(colSz, "width", 0),
          gap: getIntAttr(colSz, "gap", 0)
        });
      }
      if (cols.length > 0) result.columns = cols;
    }
    return result;
  }
  setColumnLayout(opts) {
    const colPr = this._ensureColPrElement();
    let changed = false;
    if (opts.type != null && colPr.getAttribute("type") !== opts.type) {
      colPr.setAttribute("type", opts.type);
      changed = true;
    }
    if (opts.layout != null && colPr.getAttribute("layout") !== opts.layout) {
      colPr.setAttribute("layout", opts.layout);
      changed = true;
    }
    if (opts.colCount != null) {
      const v = String(Math.max(opts.colCount, 1));
      if (colPr.getAttribute("colCount") !== v) {
        colPr.setAttribute("colCount", v);
        changed = true;
      }
    }
    if (opts.columns && opts.columns.length > 0) {
      colPr.setAttribute("sameSz", "0");
      colPr.setAttribute("sameGap", "0");
      for (const old of findAllChildren(colPr, HP_NS, "colSz")) colPr.removeChild(old);
      for (const col of opts.columns) {
        subElement(colPr, HP_NS, "colSz", {
          width: String(Math.max(col.width, 0)),
          gap: String(Math.max(col.gap, 0))
        });
      }
      changed = true;
    } else if (opts.sameGap != null) {
      colPr.setAttribute("sameSz", "1");
      const v = String(Math.max(opts.sameGap, 0));
      if (colPr.getAttribute("sameGap") !== v) {
        colPr.setAttribute("sameGap", v);
        changed = true;
      }
    }
    if (changed) this.section.markDirty();
  }
  // -- Header/Footer helpers --
  get headers() {
    const wrappers = [];
    for (const el of findAllChildren(this.element, HP_NS, "header")) {
      const apply = this._matchApplyForElement("header", el);
      wrappers.push(new HwpxOxmlSectionHeaderFooter(el, this, apply));
    }
    return wrappers;
  }
  get footers() {
    const wrappers = [];
    for (const el of findAllChildren(this.element, HP_NS, "footer")) {
      const apply = this._matchApplyForElement("footer", el);
      wrappers.push(new HwpxOxmlSectionHeaderFooter(el, this, apply));
    }
    return wrappers;
  }
  getHeader(pageType = "BOTH") {
    const el = this._findHeaderFooter("header", pageType);
    if (!el) return null;
    const apply = this._matchApplyForElement("header", el);
    return new HwpxOxmlSectionHeaderFooter(el, this, apply);
  }
  getFooter(pageType = "BOTH") {
    const el = this._findHeaderFooter("footer", pageType);
    if (!el) return null;
    const apply = this._matchApplyForElement("footer", el);
    return new HwpxOxmlSectionHeaderFooter(el, this, apply);
  }
  setHeaderText(text, pageType = "BOTH") {
    const el = this._ensureHeaderFooter("header", pageType);
    const apply = this._ensureHeaderFooterApply("header", pageType, el);
    const wrapper = new HwpxOxmlSectionHeaderFooter(el, this, apply);
    wrapper.text = text;
    return wrapper;
  }
  setFooterText(text, pageType = "BOTH") {
    const el = this._ensureHeaderFooter("footer", pageType);
    const apply = this._ensureHeaderFooterApply("footer", pageType, el);
    const wrapper = new HwpxOxmlSectionHeaderFooter(el, this, apply);
    wrapper.text = text;
    return wrapper;
  }
  removeHeader(pageType = "BOTH") {
    const el = this._findHeaderFooter("header", pageType);
    let removed = false;
    if (el) {
      this.element.removeChild(el);
      removed = true;
    }
    if (this._removeHeaderFooterApply("header", pageType, el)) removed = true;
    if (removed) this.section.markDirty();
  }
  removeFooter(pageType = "BOTH") {
    const el = this._findHeaderFooter("footer", pageType);
    let removed = false;
    if (el) {
      this.element.removeChild(el);
      removed = true;
    }
    if (this._removeHeaderFooterApply("footer", pageType, el)) removed = true;
    if (removed) this.section.markDirty();
  }
  _findHeaderFooter(tag, pageType) {
    for (const el of findAllChildren(this.element, HP_NS, tag)) {
      if ((el.getAttribute("applyPageType") ?? "BOTH") === pageType) return el;
    }
    return null;
  }
  _ensureHeaderFooter(tag, pageType) {
    let el = this._findHeaderFooter(tag, pageType);
    let changed = false;
    if (!el) {
      el = subElement(this.element, HP_NS, tag, { id: objectId(), applyPageType: pageType });
      changed = true;
    } else {
      if (el.getAttribute("applyPageType") !== pageType) {
        el.setAttribute("applyPageType", pageType);
        changed = true;
      }
    }
    if (!el.getAttribute("id")) {
      el.setAttribute("id", objectId());
      changed = true;
    }
    if (changed) this.section.markDirty();
    return el;
  }
  _applyIdAttributes(tag) {
    const base = tag === "header" ? "header" : "footer";
    return ["idRef", `${base}IDRef`, `${base}IdRef`, `${base}Ref`];
  }
  _applyElements(tag) {
    return findAllChildren(this.element, HP_NS, `${tag}Apply`);
  }
  _applyReference(apply, tag) {
    const candidateKeys = new Set(this._applyIdAttributes(tag).map((n) => n.toLowerCase()));
    const namedMap = apply.attributes;
    for (let i = 0; i < namedMap.length; i++) {
      const attr = namedMap.item(i);
      if (attr && candidateKeys.has(attr.name.toLowerCase()) && attr.value) return attr.value;
    }
    return null;
  }
  _matchApplyForElement(tag, element) {
    if (!element) return null;
    const targetId = element.getAttribute("id");
    if (targetId) {
      for (const apply of this._applyElements(tag)) {
        if (this._applyReference(apply, tag) === targetId) return apply;
      }
    }
    const pageType = element.getAttribute("applyPageType") ?? "BOTH";
    for (const apply of this._applyElements(tag)) {
      if ((apply.getAttribute("applyPageType") ?? "BOTH") === pageType) return apply;
    }
    return null;
  }
  _ensureHeaderFooterApply(tag, pageType, element) {
    let apply = this._matchApplyForElement(tag, element);
    const headerId = element.getAttribute("id");
    let changed = false;
    if (!apply) {
      const attrs = { applyPageType: pageType };
      if (headerId) attrs[this._applyIdAttributes(tag)[0]] = headerId;
      apply = subElement(this.element, HP_NS, `${tag}Apply`, attrs);
      changed = true;
    } else {
      if (apply.getAttribute("applyPageType") !== pageType) {
        apply.setAttribute("applyPageType", pageType);
        changed = true;
      }
    }
    if (changed) this.section.markDirty();
    return apply;
  }
  _removeHeaderFooterApply(tag, pageType, element) {
    let apply = this._matchApplyForElement(tag, element);
    if (!apply) {
      for (const candidate of this._applyElements(tag)) {
        if ((candidate.getAttribute("applyPageType") ?? "BOTH") === pageType) {
          apply = candidate;
          break;
        }
      }
    }
    if (!apply) return false;
    this.element.removeChild(apply);
    return true;
  }
};
var HwpxOxmlSection = class {
  partName;
  _element;
  _dirty = false;
  _propertiesCache = null;
  _document;
  constructor(partName, element, document = null) {
    this.partName = partName;
    this._element = element;
    this._document = document;
  }
  get element() {
    return this._element;
  }
  get document() {
    return this._document;
  }
  attachDocument(document) {
    this._document = document;
  }
  get properties() {
    if (!this._propertiesCache) {
      let el = findDescendant(this._element, "secPr");
      if (!el) {
        const allP = findAllChildren(this._element, HP_NS, "p");
        let p = allP.length > 0 ? allP[allP.length - 1] : null;
        if (!p) {
          p = subElement(this._element, HP_NS, "p", { ...DEFAULT_PARAGRAPH_ATTRS, id: paragraphId() });
        }
        let run = findChild(p, HP_NS, "run");
        if (!run) run = subElement(p, HP_NS, "run", { charPrIDRef: "0" });
        el = subElement(run, HP_NS, "secPr");
        this.markDirty();
      }
      this._propertiesCache = new HwpxOxmlSectionProperties(el, this);
    }
    return this._propertiesCache;
  }
  get paragraphs() {
    return findAllChildren(this._element, HP_NS, "p").map((el) => new HwpxOxmlParagraph(el, this));
  }
  get memoGroup() {
    const el = findChild(this._element, HP_NS, "memogroup");
    if (!el) return null;
    return new HwpxOxmlMemoGroup(el, this);
  }
  get memos() {
    const group = this.memoGroup;
    if (!group) return [];
    return group.memos;
  }
  addMemo(text = "", opts) {
    let el = findChild(this._element, HP_NS, "memogroup");
    if (!el) {
      el = subElement(this._element, HP_NS, "memogroup");
      this.markDirty();
    }
    const group = new HwpxOxmlMemoGroup(el, this);
    return group.addMemo(text, opts);
  }
  addParagraph(text = "", opts) {
    const includeRun = opts?.includeRun ?? true;
    const attrs = { id: paragraphId(), ...DEFAULT_PARAGRAPH_ATTRS };
    if (opts?.paraPrIdRef != null) attrs["paraPrIDRef"] = String(opts.paraPrIdRef);
    if (opts?.styleIdRef != null) attrs["styleIDRef"] = String(opts.styleIdRef);
    const doc = this._element.ownerDocument;
    const paragraph = createNsElement(doc, HP_NS, "p", attrs);
    if (includeRun) {
      const runAttrs = { ...opts?.runAttributes ?? {} };
      if (opts?.charPrIdRef != null) runAttrs["charPrIDRef"] = String(opts.charPrIdRef);
      else if (!("charPrIDRef" in runAttrs)) runAttrs["charPrIDRef"] = "0";
      const run = subElement(paragraph, HP_NS, "run", runAttrs);
      const t = subElement(run, HP_NS, "t");
      t.textContent = text;
    }
    this._element.appendChild(paragraph);
    this._dirty = true;
    return new HwpxOxmlParagraph(paragraph, this);
  }
  insertParagraphAt(index, text = "", opts) {
    const includeRun = opts?.includeRun ?? true;
    const attrs = { id: paragraphId(), ...DEFAULT_PARAGRAPH_ATTRS };
    if (opts?.paraPrIdRef != null) attrs["paraPrIDRef"] = String(opts.paraPrIdRef);
    if (opts?.styleIdRef != null) attrs["styleIDRef"] = String(opts.styleIdRef);
    const doc = this._element.ownerDocument;
    const paragraph = createNsElement(doc, HP_NS, "p", attrs);
    if (includeRun) {
      const runAttrs = { ...opts?.runAttributes ?? {} };
      if (opts?.charPrIdRef != null) runAttrs["charPrIDRef"] = String(opts.charPrIdRef);
      else if (!("charPrIDRef" in runAttrs)) runAttrs["charPrIDRef"] = "0";
      const run = subElement(paragraph, HP_NS, "run", runAttrs);
      const t = subElement(run, HP_NS, "t");
      t.textContent = text;
    }
    const existing = findAllChildren(this._element, HP_NS, "p");
    if (index >= existing.length) {
      this._element.appendChild(paragraph);
    } else {
      this._element.insertBefore(paragraph, existing[index]);
    }
    this._dirty = true;
    return new HwpxOxmlParagraph(paragraph, this);
  }
  /**
   * Insert a pre-created paragraph element at the specified index.
   * Used internally by TOC generation and other features.
   */
  insertParagraph(paragraphElement, index) {
    const existing = findAllChildren(this._element, HP_NS, "p");
    if (index >= existing.length) {
      this._element.appendChild(paragraphElement);
    } else {
      this._element.insertBefore(paragraphElement, existing[index]);
    }
    this._dirty = true;
    return new HwpxOxmlParagraph(paragraphElement, this);
  }
  removeParagraph(index) {
    const existing = findAllChildren(this._element, HP_NS, "p");
    if (index < 0 || index >= existing.length) {
      throw new Error(`paragraph index ${index} out of bounds (${existing.length} paragraphs)`);
    }
    this._element.removeChild(existing[index]);
    this._propertiesCache = null;
    this._dirty = true;
  }
  replaceElement(newElement) {
    this._element = newElement;
    this._propertiesCache = null;
    this._dirty = true;
  }
  markDirty() {
    this._dirty = true;
  }
  get dirty() {
    return this._dirty;
  }
  resetDirty() {
    this._dirty = false;
  }
  toBytes() {
    return serializeXmlBytes(this._element);
  }
};

// src/oxml/header-part.ts
var HwpxOxmlHeader = class {
  partName;
  _element;
  _dirty = false;
  _document;
  constructor(partName, element, document = null) {
    this.partName = partName;
    this._element = element;
    this._document = document;
  }
  get element() {
    return this._element;
  }
  get document() {
    return this._document;
  }
  attachDocument(document) {
    this._document = document;
  }
  _refListElement(create = false) {
    let el = findChild(this._element, HH_NS, "refList");
    if (!el && create) {
      el = subElement(this._element, HH_NS, "refList");
      this.markDirty();
    }
    return el;
  }
  _borderFillsElement(create = false) {
    const refList = this._refListElement(create);
    if (!refList) return null;
    let el = findChild(refList, HH_NS, "borderFills");
    if (!el && create) {
      el = subElement(refList, HH_NS, "borderFills", { itemCnt: "0" });
      this.markDirty();
    }
    return el;
  }
  _charPropertiesElement(create = false) {
    const refList = this._refListElement(create);
    if (!refList) return null;
    let el = findChild(refList, HH_NS, "charProperties");
    if (!el && create) {
      el = subElement(refList, HH_NS, "charProperties", { itemCnt: "0" });
      this.markDirty();
    }
    return el;
  }
  findBasicBorderFillId() {
    const el = this._borderFillsElement();
    if (!el) return null;
    for (const child of findAllChildren(el, HH_NS, "borderFill")) {
      if (borderFillIsBasicSolidLine(child)) {
        const id = child.getAttribute("id");
        if (id) return id;
      }
    }
    return null;
  }
  ensureBasicBorderFill() {
    const el = this._borderFillsElement(true);
    const existing = this.findBasicBorderFillId();
    if (existing) return existing;
    const newId = this._allocateBorderFillId(el);
    const doc = el.ownerDocument;
    el.appendChild(createBasicBorderFillElement(doc, newId));
    this._updateBorderFillsItemCount(el);
    this.markDirty();
    return newId;
  }
  getBorderFillInfo(id) {
    const el = this._borderFillsElement();
    if (!el) return null;
    for (const child of findAllChildren(el, HH_NS, "borderFill")) {
      if (child.getAttribute("id") === String(id)) {
        return parseBorderFillElement(child);
      }
    }
    return null;
  }
  ensureBorderFill(opts) {
    const container = this._borderFillsElement(true);
    const doc = container.ownerDocument;
    let baseInfo = null;
    if (opts.baseBorderFillId != null) {
      baseInfo = this.getBorderFillInfo(opts.baseBorderFillId);
    }
    if (!baseInfo) {
      baseInfo = {
        left: { type: "SOLID", width: "0.12 mm", color: "#000000" },
        right: { type: "SOLID", width: "0.12 mm", color: "#000000" },
        top: { type: "SOLID", width: "0.12 mm", color: "#000000" },
        bottom: { type: "SOLID", width: "0.12 mm", color: "#000000" },
        diagonal: { type: "SOLID", width: "0.1 mm", color: "#000000" },
        backgroundColor: null
      };
    }
    const newInfo = { ...baseInfo };
    if (opts.sides) {
      if (opts.sides.left) newInfo.left = opts.sides.left;
      if (opts.sides.right) newInfo.right = opts.sides.right;
      if (opts.sides.top) newInfo.top = opts.sides.top;
      if (opts.sides.bottom) newInfo.bottom = opts.sides.bottom;
    }
    if (opts.backgroundColor !== void 0) {
      newInfo.backgroundColor = opts.backgroundColor;
    }
    const matchesBorder = (a, b) => a.type.toUpperCase() === b.type.toUpperCase() && a.width.replace(/ /g, "").toLowerCase() === b.width.replace(/ /g, "").toLowerCase() && a.color.toUpperCase() === b.color.toUpperCase();
    for (const child of findAllChildren(container, HH_NS, "borderFill")) {
      const existing = parseBorderFillElement(child);
      if (matchesBorder(existing.left, newInfo.left) && matchesBorder(existing.right, newInfo.right) && matchesBorder(existing.top, newInfo.top) && matchesBorder(existing.bottom, newInfo.bottom) && (existing.backgroundColor ?? null) === (newInfo.backgroundColor ?? null)) {
        const id = child.getAttribute("id");
        if (id) return id;
      }
    }
    const newId = this._allocateBorderFillId(container);
    container.appendChild(createBorderFillElement(doc, newId, newInfo));
    this._updateBorderFillsItemCount(container);
    this.markDirty();
    return newId;
  }
  ensureCharProperty(opts) {
    const charProps = this._charPropertiesElement(true);
    if (opts.predicate) {
      for (const child of findAllChildren(charProps, HH_NS, "charPr")) {
        if (opts.predicate(child)) return child;
      }
    }
    let baseElement = null;
    if (opts.baseCharPrId != null) {
      for (const child of findAllChildren(charProps, HH_NS, "charPr")) {
        if (child.getAttribute("id") === String(opts.baseCharPrId)) {
          baseElement = child;
          break;
        }
      }
    }
    if (!baseElement) {
      const first = findChild(charProps, HH_NS, "charPr");
      if (first) baseElement = first;
    }
    const doc = charProps.ownerDocument;
    let newCharPr;
    if (!baseElement) {
      newCharPr = createNsElement(doc, HH_NS, "charPr");
    } else {
      newCharPr = baseElement.cloneNode(true);
      if (newCharPr.hasAttribute("id")) newCharPr.removeAttribute("id");
    }
    if (opts.modifier) opts.modifier(newCharPr);
    const charId = this._allocateCharPropertyId(charProps, opts.preferredId);
    newCharPr.setAttribute("id", charId);
    charProps.appendChild(newCharPr);
    this._updateCharPropertiesItemCount(charProps);
    this.markDirty();
    if (this._document) this._document.invalidateCharPropertyCache();
    return newCharPr;
  }
  // ── Font face management ────────────────────────────────────────────────
  _fontFacesElement() {
    const refList = this._refListElement();
    if (!refList) return null;
    return findChild(refList, HH_NS, "fontfaces");
  }
  /**
   * Ensure a font exists in all fontface lang groups (HANGUL, LATIN, etc.)
   * and return the numeric font ID for the HANGUL group.
   * If the font already exists, returns its existing ID.
   */
  ensureFontFace(fontName) {
    const fontfaces = this._fontFacesElement();
    if (!fontfaces) throw new Error("header does not contain fontfaces element");
    const LANGS = ["HANGUL", "LATIN", "HANJA", "JAPANESE", "OTHER", "SYMBOL", "USER"];
    let hangulId = null;
    for (const lang of LANGS) {
      let langGroup = null;
      for (const child of findAllChildren(fontfaces, HH_NS, "fontface")) {
        if (child.getAttribute("lang") === lang) {
          langGroup = child;
          break;
        }
      }
      if (!langGroup) {
        langGroup = subElement(fontfaces, HH_NS, "fontface", { lang, fontCnt: "0" });
      }
      let existingId = null;
      const fonts = findAllChildren(langGroup, HH_NS, "font");
      for (const font of fonts) {
        if (font.getAttribute("face") === fontName) {
          existingId = font.getAttribute("id");
          break;
        }
      }
      if (existingId != null) {
        if (lang === "HANGUL") hangulId = existingId;
        continue;
      }
      let maxId = -1;
      for (const font of fonts) {
        const idVal = parseInt(font.getAttribute("id") ?? "-1", 10);
        if (idVal > maxId) maxId = idVal;
      }
      const newId = String(maxId + 1);
      subElement(langGroup, HH_NS, "font", {
        id: newId,
        face: fontName,
        type: "TTF",
        isEmbedded: "0"
      });
      langGroup.setAttribute("fontCnt", String(fonts.length + 1));
      if (lang === "HANGUL") hangulId = newId;
    }
    this.markDirty();
    return hangulId ?? "0";
  }
  get beginNumbering() {
    const el = findChild(this._element, HH_NS, "beginNum");
    if (!el) return { page: 1, footnote: 1, endnote: 1, picture: 1, table: 1, equation: 1 };
    return {
      page: getIntAttr(el, "page", 1),
      footnote: getIntAttr(el, "footnote", 1),
      endnote: getIntAttr(el, "endnote", 1),
      picture: getIntAttr(el, "pic", 1),
      table: getIntAttr(el, "tbl", 1),
      equation: getIntAttr(el, "equation", 1)
    };
  }
  // ── Paragraph property management ──────────────────────────────────────
  _paraPropertiesElement(create = false) {
    const refList = this._refListElement(create);
    if (!refList) return null;
    let el = findChild(refList, HH_NS, "paraProperties");
    if (!el && create) {
      el = subElement(refList, HH_NS, "paraProperties", { itemCnt: "0" });
      this.markDirty();
    }
    return el;
  }
  ensureParaProperty(opts) {
    const paraProps = this._paraPropertiesElement(true);
    if (opts.predicate) {
      for (const child of findAllChildren(paraProps, HH_NS, "paraPr")) {
        if (opts.predicate(child)) return child;
      }
    }
    let baseElement = null;
    if (opts.baseParaPrId != null) {
      for (const child of findAllChildren(paraProps, HH_NS, "paraPr")) {
        if (child.getAttribute("id") === String(opts.baseParaPrId)) {
          baseElement = child;
          break;
        }
      }
    }
    if (!baseElement) {
      const first = findChild(paraProps, HH_NS, "paraPr");
      if (first) baseElement = first;
    }
    const doc = paraProps.ownerDocument;
    let newParaPr;
    if (!baseElement) {
      newParaPr = createNsElement(doc, HH_NS, "paraPr");
    } else {
      newParaPr = baseElement.cloneNode(true);
      if (newParaPr.hasAttribute("id")) newParaPr.removeAttribute("id");
    }
    if (opts.modifier) opts.modifier(newParaPr);
    const paraId = this._allocateParaPropertyId(paraProps);
    newParaPr.setAttribute("id", paraId);
    paraProps.appendChild(newParaPr);
    this._updateParaPropertiesItemCount(paraProps);
    this.markDirty();
    return newParaPr;
  }
  _allocateParaPropertyId(element) {
    const existing = /* @__PURE__ */ new Set();
    for (const child of findAllChildren(element, HH_NS, "paraPr")) {
      const id = child.getAttribute("id");
      if (id) existing.add(id);
    }
    const numericIds = [];
    for (const id of existing) {
      const n = parseInt(id, 10);
      if (!isNaN(n)) numericIds.push(n);
    }
    let nextId = numericIds.length === 0 ? 0 : Math.max(...numericIds) + 1;
    let candidate = String(nextId);
    while (existing.has(candidate)) {
      nextId++;
      candidate = String(nextId);
    }
    return candidate;
  }
  _updateParaPropertiesItemCount(element) {
    const count = findAllChildren(element, HH_NS, "paraPr").length;
    element.setAttribute("itemCnt", String(count));
  }
  // ── Element replacement (for undo/redo) ───────────────────────────────
  replaceElement(newElement) {
    this._element = newElement;
    this._dirty = true;
  }
  get dirty() {
    return this._dirty;
  }
  markDirty() {
    this._dirty = true;
  }
  resetDirty() {
    this._dirty = false;
  }
  toBytes() {
    return serializeXmlBytes(this._element);
  }
  _allocateCharPropertyId(element, preferredId) {
    const existing = /* @__PURE__ */ new Set();
    for (const child of findAllChildren(element, HH_NS, "charPr")) {
      const id = child.getAttribute("id");
      if (id) existing.add(id);
    }
    if (preferredId != null) {
      const candidate2 = String(preferredId);
      if (!existing.has(candidate2)) return candidate2;
    }
    const numericIds = [];
    for (const id of existing) {
      const n = parseInt(id, 10);
      if (!isNaN(n)) numericIds.push(n);
    }
    let nextId = numericIds.length === 0 ? 0 : Math.max(...numericIds) + 1;
    let candidate = String(nextId);
    while (existing.has(candidate)) {
      nextId++;
      candidate = String(nextId);
    }
    return candidate;
  }
  _allocateBorderFillId(element) {
    const existing = /* @__PURE__ */ new Set();
    for (const child of findAllChildren(element, HH_NS, "borderFill")) {
      const id = child.getAttribute("id");
      if (id) existing.add(id);
    }
    const numericIds = [];
    for (const id of existing) {
      const n = parseInt(id, 10);
      if (!isNaN(n)) numericIds.push(n);
    }
    let nextId = numericIds.length === 0 ? 0 : Math.max(...numericIds) + 1;
    let candidate = String(nextId);
    while (existing.has(candidate)) {
      nextId++;
      candidate = String(nextId);
    }
    return candidate;
  }
  _updateCharPropertiesItemCount(element) {
    const count = findAllChildren(element, HH_NS, "charPr").length;
    element.setAttribute("itemCnt", String(count));
  }
  _updateBorderFillsItemCount(element) {
    const count = findAllChildren(element, HH_NS, "borderFill").length;
    element.setAttribute("itemCnt", String(count));
  }
};

// src/oxml/simple-parts.ts
var HwpxOxmlSimplePart = class {
  partName;
  _element;
  _document;
  _dirty = false;
  constructor(partName, element, document = null) {
    this.partName = partName;
    this._element = element;
    this._document = document;
  }
  get element() {
    return this._element;
  }
  get document() {
    return this._document;
  }
  attachDocument(document) {
    this._document = document;
  }
  get dirty() {
    return this._dirty;
  }
  markDirty() {
    this._dirty = true;
  }
  resetDirty() {
    this._dirty = false;
  }
  replaceElement(element) {
    this._element = element;
    this.markDirty();
  }
  toBytes() {
    return serializeXmlBytes(this._element);
  }
};
var HwpxOxmlMasterPage = class extends HwpxOxmlSimplePart {
};
var HwpxOxmlHistory = class extends HwpxOxmlSimplePart {
};
var HwpxOxmlVersion = class extends HwpxOxmlSimplePart {
};

// src/oxml/document.ts
var HwpxOxmlDocument = class _HwpxOxmlDocument {
  _manifest;
  _sections;
  _headers;
  _masterPages;
  _histories;
  _version;
  _charPropertyCache = null;
  constructor(manifest, sections, headers, opts) {
    this._manifest = manifest;
    this._sections = [...sections];
    this._headers = [...headers];
    this._masterPages = [...opts?.masterPages ?? []];
    this._histories = [...opts?.histories ?? []];
    this._version = opts?.version ?? null;
    for (const s of this._sections) s.attachDocument(this);
    for (const h of this._headers) h.attachDocument(this);
    for (const m of this._masterPages) m.attachDocument(this);
    for (const h of this._histories) h.attachDocument(this);
    if (this._version) this._version.attachDocument(this);
  }
  static fromPackage(pkg) {
    const manifest = pkg.getXml(HwpxPackage.MANIFEST_PATH);
    const sectionPaths = pkg.sectionPaths();
    const headerPaths = pkg.headerPaths();
    const masterPagePaths = pkg.masterPagePaths();
    const historyPaths = pkg.historyPaths();
    const versionPath = pkg.versionPath();
    const sections = sectionPaths.map((path) => new HwpxOxmlSection(path, pkg.getXml(path)));
    const headers = headerPaths.map((path) => new HwpxOxmlHeader(path, pkg.getXml(path)));
    const masterPages = masterPagePaths.filter((path) => pkg.hasPart(path)).map((path) => new HwpxOxmlMasterPage(path, pkg.getXml(path)));
    const histories = historyPaths.filter((path) => pkg.hasPart(path)).map((path) => new HwpxOxmlHistory(path, pkg.getXml(path)));
    let version = null;
    if (versionPath && pkg.hasPart(versionPath)) {
      version = new HwpxOxmlVersion(versionPath, pkg.getXml(versionPath));
    }
    return new _HwpxOxmlDocument(manifest, sections, headers, { masterPages, histories, version });
  }
  get manifest() {
    return this._manifest;
  }
  get sections() {
    return [...this._sections];
  }
  get headers() {
    return [...this._headers];
  }
  get masterPages() {
    return [...this._masterPages];
  }
  get histories() {
    return [...this._histories];
  }
  get version() {
    return this._version;
  }
  // -- Char property cache --
  _ensureCharPropertyCache() {
    if (this._charPropertyCache == null) {
      const mapping = {};
      for (const header of this._headers) {
        Object.assign(mapping, charPropertiesFromHeader(header.element));
      }
      this._charPropertyCache = mapping;
    }
    return this._charPropertyCache;
  }
  invalidateCharPropertyCache() {
    this._charPropertyCache = null;
  }
  /**
   * Resolve a numeric font ID to a font face name.
   * @param fontId - numeric font ID string (e.g. "7")
   * @param lang - language group (default "HANGUL")
   * @returns font face name or null
   */
  fontFaceName(fontId, lang = "HANGUL") {
    if (fontId == null) return null;
    const id = String(fontId);
    for (const header of this._headers) {
      const fontfaces = findChild(
        findChild(header.element, HH_NS, "refList") ?? header.element,
        HH_NS,
        "fontfaces"
      );
      if (!fontfaces) continue;
      for (const langGroup of findAllChildren(fontfaces, HH_NS, "fontface")) {
        if (langGroup.getAttribute("lang") !== lang) continue;
        for (const font of findAllChildren(langGroup, HH_NS, "font")) {
          if (font.getAttribute("id") === id) {
            return font.getAttribute("face");
          }
        }
      }
    }
    return null;
  }
  get charProperties() {
    return { ...this._ensureCharPropertyCache() };
  }
  charProperty(charPrIdRef) {
    if (charPrIdRef == null) return null;
    const key = String(charPrIdRef).trim();
    if (!key) return null;
    const cache = this._ensureCharPropertyCache();
    const style = cache[key];
    if (style) return style;
    try {
      const normalized = String(parseInt(key, 10));
      return cache[normalized] ?? null;
    } catch {
      return null;
    }
  }
  ensureRunStyle(opts) {
    if (this._headers.length === 0) throw new Error("document does not contain any headers");
    const header = this._headers[0];
    let fontId = null;
    if (opts.fontFamily) {
      fontId = header.ensureFontFace(opts.fontFamily);
    }
    const targetBold = !!opts.bold;
    const targetItalic = !!opts.italic;
    const targetUnderline = !!opts.underline;
    const targetStrikethrough = !!opts.strikethrough;
    const targetHeight = opts.fontSize != null ? String(Math.round(opts.fontSize * 100)) : null;
    const targetTextColor = opts.textColor ?? null;
    const targetShadeColor = opts.highlightColor ?? null;
    const predicate = (element2) => {
      const boldPresent = findChild(element2, HH_NS, "bold") != null;
      if (boldPresent !== targetBold) return false;
      const italicPresent = findChild(element2, HH_NS, "italic") != null;
      if (italicPresent !== targetItalic) return false;
      const underlineEl = findChild(element2, HH_NS, "underline");
      const underlinePresent = underlineEl != null && (underlineEl.getAttribute("type") ?? "").toUpperCase() !== "NONE";
      if (underlinePresent !== targetUnderline) return false;
      const strikeEl = findChild(element2, HH_NS, "strikeout");
      const strikePresent = strikeEl != null && (strikeEl.getAttribute("type") ?? "").toUpperCase() !== "NONE";
      if (strikePresent !== targetStrikethrough) return false;
      if (targetHeight != null && element2.getAttribute("height") !== targetHeight) return false;
      if (targetTextColor != null && element2.getAttribute("textColor") !== targetTextColor) return false;
      if (targetShadeColor != null && element2.getAttribute("shadeColor") !== targetShadeColor) return false;
      if (fontId != null) {
        const fontRef = findChild(element2, HH_NS, "fontRef");
        if (!fontRef) return false;
        if (fontRef.getAttribute("hangul") !== fontId) return false;
      }
      return true;
    };
    const modifier = (element2) => {
      for (const child of findAllChildren(element2, HH_NS, "bold")) element2.removeChild(child);
      for (const child of findAllChildren(element2, HH_NS, "italic")) element2.removeChild(child);
      if (targetBold) subElement(element2, HH_NS, "bold");
      if (targetItalic) subElement(element2, HH_NS, "italic");
      const underlineNodes = findAllChildren(element2, HH_NS, "underline");
      const baseAttrs = underlineNodes.length > 0 ? getAttributes(underlineNodes[0]) : {};
      for (const child of underlineNodes) element2.removeChild(child);
      if (targetUnderline) {
        const attrs = { ...baseAttrs };
        if (!attrs["type"] || attrs["type"].toUpperCase() === "NONE") attrs["type"] = "SOLID";
        if (!attrs["shape"]) attrs["shape"] = baseAttrs["shape"] ?? "SOLID";
        if (!attrs["color"]) attrs["color"] = baseAttrs["color"] ?? "#000000";
        subElement(element2, HH_NS, "underline", attrs);
      } else {
        const attrs = { ...baseAttrs, type: "NONE" };
        if (!attrs["shape"]) attrs["shape"] = baseAttrs["shape"] ?? "SOLID";
        subElement(element2, HH_NS, "underline", attrs);
      }
      const strikeNodes = findAllChildren(element2, HH_NS, "strikeout");
      const strikeBaseAttrs = strikeNodes.length > 0 ? getAttributes(strikeNodes[0]) : {};
      for (const child of strikeNodes) element2.removeChild(child);
      if (targetStrikethrough) {
        const attrs = { ...strikeBaseAttrs };
        if (!attrs["type"] || attrs["type"].toUpperCase() === "NONE") attrs["type"] = "SOLID";
        if (!attrs["shape"]) attrs["shape"] = strikeBaseAttrs["shape"] ?? "SOLID";
        if (!attrs["color"]) attrs["color"] = strikeBaseAttrs["color"] ?? "#000000";
        subElement(element2, HH_NS, "strikeout", attrs);
      } else {
        const attrs = { ...strikeBaseAttrs, type: "NONE" };
        if (!attrs["shape"]) attrs["shape"] = strikeBaseAttrs["shape"] ?? "SOLID";
        subElement(element2, HH_NS, "strikeout", attrs);
      }
      if (targetHeight != null) {
        element2.setAttribute("height", targetHeight);
      }
      if (targetTextColor != null) {
        element2.setAttribute("textColor", targetTextColor);
      }
      if (targetShadeColor != null) {
        element2.setAttribute("shadeColor", targetShadeColor);
      }
      if (fontId != null) {
        let fontRef = findChild(element2, HH_NS, "fontRef");
        if (fontRef) {
          fontRef.setAttribute("hangul", fontId);
          fontRef.setAttribute("latin", fontId);
          fontRef.setAttribute("hanja", fontId);
          fontRef.setAttribute("japanese", fontId);
          fontRef.setAttribute("other", fontId);
          fontRef.setAttribute("symbol", fontId);
          fontRef.setAttribute("user", fontId);
        } else {
          subElement(element2, HH_NS, "fontRef", {
            hangul: fontId,
            latin: fontId,
            hanja: fontId,
            japanese: fontId,
            other: fontId,
            symbol: fontId,
            user: fontId
          });
        }
      }
    };
    const element = header.ensureCharProperty({
      predicate,
      modifier,
      baseCharPrId: opts.baseCharPrId
    });
    const charId = element.getAttribute("id");
    if (!charId) throw new Error("charPr element is missing an id");
    return charId;
  }
  ensureParaStyle(opts) {
    if (this._headers.length === 0) throw new Error("document does not contain any headers");
    const header = this._headers[0];
    const targetAlignment = opts.alignment?.toUpperCase() ?? null;
    const targetLineSpacingValue = opts.lineSpacingValue != null ? String(Math.round(opts.lineSpacingValue)) : null;
    const targetMarginLeft = opts.marginLeft != null ? String(Math.round(opts.marginLeft)) : null;
    const targetMarginRight = opts.marginRight != null ? String(Math.round(opts.marginRight)) : null;
    const targetIndent = opts.indent != null ? String(Math.round(opts.indent)) : null;
    const predicate = (element2) => {
      if (targetAlignment != null) {
        const align = findChild(element2, HH_NS, "align");
        const h = (align?.getAttribute("horizontal") ?? "JUSTIFY").toUpperCase();
        if (h !== targetAlignment) return false;
      }
      if (targetLineSpacingValue != null) {
        const ls = findChild(element2, HH_NS, "lineSpacing");
        const v = ls?.getAttribute("value") ?? "160";
        if (v !== targetLineSpacingValue) return false;
      }
      if (targetMarginLeft != null || targetMarginRight != null || targetIndent != null) {
        const margin = findChild(element2, HH_NS, "margin");
        if (!margin) return false;
        if (targetMarginLeft != null && (margin.getAttribute("left") ?? "0") !== targetMarginLeft) return false;
        if (targetMarginRight != null && (margin.getAttribute("right") ?? "0") !== targetMarginRight) return false;
        if (targetIndent != null && (margin.getAttribute("intent") ?? "0") !== targetIndent) return false;
      }
      return true;
    };
    const modifier = (element2) => {
      if (targetAlignment != null) {
        let align = findChild(element2, HH_NS, "align");
        if (!align) {
          align = subElement(element2, HH_NS, "align", { horizontal: targetAlignment, vertical: "BASELINE" });
        } else {
          align.setAttribute("horizontal", targetAlignment);
        }
      }
      if (targetLineSpacingValue != null) {
        let ls = findChild(element2, HH_NS, "lineSpacing");
        if (!ls) {
          ls = subElement(element2, HH_NS, "lineSpacing", {
            type: "PERCENT",
            value: targetLineSpacingValue,
            unit: "HWPUNIT"
          });
        } else {
          ls.setAttribute("value", targetLineSpacingValue);
          if (!ls.getAttribute("type")) ls.setAttribute("type", "PERCENT");
        }
      }
      if (targetMarginLeft != null || targetMarginRight != null || targetIndent != null) {
        let margin = findChild(element2, HH_NS, "margin");
        if (!margin) {
          margin = subElement(element2, HH_NS, "margin", { intent: "0", left: "0", right: "0", prev: "0", next: "0" });
        }
        if (targetMarginLeft != null) margin.setAttribute("left", targetMarginLeft);
        if (targetMarginRight != null) margin.setAttribute("right", targetMarginRight);
        if (targetIndent != null) margin.setAttribute("intent", targetIndent);
      }
    };
    const element = header.ensureParaProperty({
      predicate,
      modifier,
      baseParaPrId: opts.baseParaPrId
    });
    const paraId = element.getAttribute("id");
    if (!paraId) throw new Error("paraPr element is missing an id");
    return paraId;
  }
  ensureBasicBorderFill() {
    if (this._headers.length === 0) return "0";
    for (const header of this._headers) {
      const existing = header.findBasicBorderFillId();
      if (existing) return existing;
    }
    return this._headers[0].ensureBasicBorderFill();
  }
  getBorderFillInfo(id) {
    for (const header of this._headers) {
      const info = header.getBorderFillInfo(id);
      if (info) return info;
    }
    return null;
  }
  ensureBorderFillStyle(opts) {
    if (this._headers.length === 0) throw new Error("document does not contain any headers");
    return this._headers[0].ensureBorderFill(opts);
  }
  // -- Paragraphs --
  get paragraphs() {
    const result = [];
    for (const section of this._sections) result.push(...section.paragraphs);
    return result;
  }
  addParagraph(text = "", opts) {
    let section = opts?.section ?? null;
    if (!section && opts?.sectionIndex != null) section = this._sections[opts.sectionIndex];
    if (!section) {
      if (this._sections.length === 0) throw new Error("document does not contain any sections");
      section = this._sections[this._sections.length - 1];
    }
    return section.addParagraph(text, {
      paraPrIdRef: opts?.paraPrIdRef,
      styleIdRef: opts?.styleIdRef,
      charPrIdRef: opts?.charPrIdRef,
      runAttributes: opts?.runAttributes,
      includeRun: opts?.includeRun
    });
  }
  insertParagraphAt(sectionIndex, paragraphIndex, text = "", opts) {
    const section = this._sections[sectionIndex];
    if (!section) throw new Error(`section index ${sectionIndex} out of bounds`);
    return section.insertParagraphAt(paragraphIndex, text, opts);
  }
  removeParagraph(sectionIndex, paragraphIndex) {
    const section = this._sections[sectionIndex];
    if (!section) throw new Error(`section index ${sectionIndex} out of bounds`);
    section.removeParagraph(paragraphIndex);
  }
  // -- Serialize --
  serialize() {
    const updates = {};
    for (const section of this._sections) {
      if (section.dirty) updates[section.partName] = section.toBytes();
    }
    let headersDirty = false;
    for (const header of this._headers) {
      if (header.dirty) {
        updates[header.partName] = header.toBytes();
        headersDirty = true;
      }
    }
    if (headersDirty) this.invalidateCharPropertyCache();
    for (const mp of this._masterPages) {
      if (mp.dirty) updates[mp.partName] = mp.toBytes();
    }
    for (const h of this._histories) {
      if (h.dirty) updates[h.partName] = h.toBytes();
    }
    if (this._version?.dirty) updates[this._version.partName] = this._version.toBytes();
    return updates;
  }
  resetDirty() {
    for (const s of this._sections) s.resetDirty();
    for (const h of this._headers) h.resetDirty();
    for (const m of this._masterPages) m.resetDirty();
    for (const h of this._histories) h.resetDirty();
    if (this._version) this._version.resetDirty();
  }
};

// src/version.ts
function normalizeVersion(value) {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function resolveLibraryVersion(input) {
  const metadataVersion = normalizeVersion(input?.metadataVersion);
  if (metadataVersion) return metadataVersion;
  const envVersion = normalizeVersion(
    input?.envVersion ?? (typeof process !== "undefined" ? process.env.npm_package_version ?? null : null)
  );
  if (envVersion) return envVersion;
  const injectedVersion = normalizeVersion(
    input?.injectedVersion ?? (true ? "0.1.3" : null)
  );
  if (injectedVersion) return injectedVersion;
  return "0+unknown";
}
var __version__ = resolveLibraryVersion();

// src/document.ts
function parseNullableInt(value) {
  if (value == null) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}
var HwpxDocument = class _HwpxDocument {
  _package;
  _oxml;
  _closed = false;
  constructor(pkg, oxml) {
    this._package = pkg;
    this._oxml = oxml;
  }
  _assertOpen() {
    if (this._closed) {
      throw new Error("HwpxDocument is closed");
    }
  }
  /** Open an HWPX document from a Uint8Array or ArrayBuffer. */
  static async open(source) {
    const pkg = await HwpxPackage.open(source);
    const oxml = HwpxOxmlDocument.fromPackage(pkg);
    return new _HwpxDocument(pkg, oxml);
  }
  /** Return the underlying package. */
  get package() {
    this._assertOpen();
    return this._package;
  }
  /** Return the OXML document object model. */
  get oxml() {
    this._assertOpen();
    return this._oxml;
  }
  get closed() {
    return this._closed;
  }
  get libraryVersion() {
    return __version__;
  }
  get documentVersionInfo() {
    this._assertOpen();
    const version = this._oxml.version;
    if (!version) return null;
    const element = version.element;
    const path = this._package.versionPath();
    return {
      path,
      targetApplication: element.getAttribute("tagetApplication") ?? element.getAttribute("targetApplication"),
      major: parseNullableInt(element.getAttribute("major")),
      minor: parseNullableInt(element.getAttribute("minor")),
      micro: parseNullableInt(element.getAttribute("micro")),
      buildNumber: parseNullableInt(element.getAttribute("buildNumber")),
      os: parseNullableInt(element.getAttribute("os")),
      xmlVersion: element.getAttribute("xmlVersion"),
      application: element.getAttribute("application"),
      appVersion: element.getAttribute("appVersion")
    };
  }
  close() {
    if (this._closed) return;
    this._package.close();
    this._closed = true;
  }
  toJSON() {
    const text = this.text;
    return {
      sectionCount: this.sectionCount,
      paragraphCount: this.paragraphs.length,
      tableCount: this.tables.length,
      memoCount: this.memos.length,
      headerCount: this.headers.length,
      textPreview: text.slice(0, 120)
    };
  }
  toString() {
    const summary = this.toJSON();
    return `HwpxDocument(sections=${summary.sectionCount}, paragraphs=${summary.paragraphCount}, tables=${summary.tableCount}, memos=${summary.memoCount})`;
  }
  // ── Section access ──────────────────────────────────────────────────
  /** Return the sections in this document. */
  get sections() {
    this._assertOpen();
    return this._oxml.sections;
  }
  /** Return the number of sections. */
  get sectionCount() {
    this._assertOpen();
    return this._oxml.sections.length;
  }
  /** Return a specific section by index. */
  section(index = 0) {
    this._assertOpen();
    const sections = this._oxml.sections;
    if (index < 0 || index >= sections.length) {
      throw new Error(`Section index ${index} out of range (0-${sections.length - 1})`);
    }
    return sections[index];
  }
  // ── Paragraph access ───────────────────────────────────────────────
  /** Return all paragraphs across all sections. */
  get paragraphs() {
    this._assertOpen();
    return this._oxml.paragraphs;
  }
  /** Append a new paragraph to the last section (or specified section). */
  addParagraph(text = "", opts) {
    this._assertOpen();
    return this._oxml.addParagraph(text, {
      sectionIndex: opts?.sectionIndex,
      paraPrIdRef: opts?.paraPrIdRef,
      styleIdRef: opts?.styleIdRef,
      charPrIdRef: opts?.charPrIdRef
    });
  }
  /** Insert a new paragraph at a specific position within a section. */
  insertParagraphAt(sectionIndex, paragraphIndex, text = "", opts) {
    this._assertOpen();
    return this._oxml.insertParagraphAt(sectionIndex, paragraphIndex, text, opts);
  }
  /** Remove a paragraph by section and paragraph index. */
  removeParagraph(sectionIndex, paragraphIndex) {
    this._assertOpen();
    this._oxml.removeParagraph(sectionIndex, paragraphIndex);
  }
  // ── Text access ────────────────────────────────────────────────────
  /** Return the full text of the document (all paragraphs joined). */
  get text() {
    this._assertOpen();
    return this.paragraphs.map((p) => p.text).join("\n");
  }
  /** Replace text across all paragraphs. */
  replaceText(search, replacement, count) {
    this._assertOpen();
    let totalReplacements = 0;
    let remaining = count;
    for (const paragraph of this.paragraphs) {
      if (remaining != null && remaining <= 0) break;
      for (const run of paragraph.runs) {
        if (remaining != null && remaining <= 0) break;
        const replaced = run.replaceText(search, replacement, remaining);
        totalReplacements += replaced;
        if (remaining != null) remaining -= replaced;
      }
    }
    return totalReplacements;
  }
  // ── Table access ───────────────────────────────────────────────────
  /** Return all tables across all sections. */
  get tables() {
    this._assertOpen();
    const tables = [];
    for (const paragraph of this.paragraphs) {
      tables.push(...paragraph.tables);
    }
    return tables;
  }
  // ── Header/Footer access ──────────────────────────────────────────
  /** Return the OXML header objects. */
  get headers() {
    this._assertOpen();
    return this._oxml.headers;
  }
  // ── Style access ──────────────────────────────────────────────────
  /** Get character properties map. */
  get charProperties() {
    this._assertOpen();
    return this._oxml.charProperties;
  }
  /** Look up a character property by ID. */
  charProperty(charPrIdRef) {
    this._assertOpen();
    return this._oxml.charProperty(charPrIdRef);
  }
  /** Resolve a numeric font ID to its face name. */
  fontFaceName(fontId, lang) {
    this._assertOpen();
    return this._oxml.fontFaceName(fontId, lang);
  }
  /** Ensure a run style with the given formatting exists. */
  ensureRunStyle(opts) {
    this._assertOpen();
    return this._oxml.ensureRunStyle(opts);
  }
  /** Ensure a paragraph style with the given formatting exists. */
  ensureParaStyle(opts) {
    this._assertOpen();
    return this._oxml.ensureParaStyle(opts);
  }
  /** Ensure a basic border fill exists and return its ID. */
  ensureBasicBorderFill() {
    this._assertOpen();
    return this._oxml.ensureBasicBorderFill();
  }
  // ── Image insertion ─────────────────────────────────────────────────
  /**
   * Add an image to the document.
   * @param imageData - The image binary data as Uint8Array
   * @param opts - mediaType, width/height in mm (or hwpUnits if useHwpUnits=true)
   * @returns The paragraph containing the image
   */
  addImage(imageData, opts) {
    this._assertOpen();
    const binaryItemId = this._package.addBinaryItem(imageData, {
      mediaType: opts.mediaType
    });
    const width = Math.round(opts.widthMm * 7200 / 25.4);
    const height = Math.round(opts.heightMm * 7200 / 25.4);
    const para = this.addParagraph("", { sectionIndex: opts.sectionIndex });
    para.addPicture(binaryItemId, {
      width,
      height,
      textWrap: opts.textWrap,
      treatAsChar: opts.treatAsChar
    });
    return para;
  }
  // ── Equation insertion ──────────────────────────────────────────────
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
  addEquation(script, opts) {
    this._assertOpen();
    const para = this.addParagraph("", { sectionIndex: opts?.sectionIndex });
    para.addEquation(script, {
      textColor: opts?.textColor,
      font: opts?.font,
      baseUnit: opts?.baseUnit,
      baseLine: opts?.baseLine,
      width: opts?.width,
      height: opts?.height
    });
    return para;
  }
  // ── Memo access ───────────────────────────────────────────────────
  /** Return all memos across all sections. */
  get memos() {
    this._assertOpen();
    const memos = [];
    for (const section of this.sections) {
      memos.push(...section.memos);
    }
    return memos;
  }
  // ── Save ──────────────────────────────────────────────────────────
  async saveToBuffer() {
    this._assertOpen();
    const updates = this._oxml.serialize();
    const result = await this._package.save(updates);
    this._oxml.resetDirty();
    return result;
  }
  async saveToBlob() {
    this._assertOpen();
    const bytes = await this.saveToBuffer();
    const arrayBuffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(arrayBuffer).set(bytes);
    return new Blob([arrayBuffer], {
      type: "application/hwp+zip"
    });
  }
  async saveToPath(path) {
    this._assertOpen();
    const bytes = await this.saveToBuffer();
    const mod = await import("fs/promises");
    await mod.writeFile(path, bytes);
  }
  /** Save the document, returning the HWPX file as a Uint8Array. */
  async save() {
    this._assertOpen();
    return this.saveToBuffer();
  }
};

// src/templates.ts
var _cachedSkeleton = null;
function loadSkeletonHwpx() {
  if (_cachedSkeleton != null) return _cachedSkeleton;
  if (typeof process !== "undefined" && process.versions?.node && typeof require !== "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");
      const skeletonPath = path.resolve(__dirname, "..", "assets", "Skeleton.hwpx");
      _cachedSkeleton = new Uint8Array(fs.readFileSync(skeletonPath));
      return _cachedSkeleton;
    } catch {
      try {
        const fs = require("fs");
        const path = require("path");
        const skeletonPath = path.resolve(process.cwd(), "packages", "hwpx-core", "assets", "Skeleton.hwpx");
        _cachedSkeleton = new Uint8Array(fs.readFileSync(skeletonPath));
        return _cachedSkeleton;
      } catch {
      }
    }
  }
  throw new Error(
    "Skeleton.hwpx template not loaded. In browser environments (or Node ESM), call setSkeletonHwpx(data) or fetchSkeletonHwpx(url) before using this function."
  );
}
function setSkeletonHwpx(data) {
  _cachedSkeleton = data;
}
async function fetchSkeletonHwpx(url) {
  if (_cachedSkeleton != null) return _cachedSkeleton;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Skeleton.hwpx from ${url}: ${res.status}`);
  const buf = await res.arrayBuffer();
  _cachedSkeleton = new Uint8Array(buf);
  return _cachedSkeleton;
}

// src/oxml/common.ts
function parseGenericElement(node) {
  const children = childElements(node).map((child) => parseGenericElement(child));
  const text = getTextContent(node);
  return {
    name: localName(node),
    tag: node.tagName ?? null,
    attributes: getAttributes(node),
    children,
    text: text ?? null
  };
}

// src/oxml/utils.ts
var _TRUE_VALUES = /* @__PURE__ */ new Set(["1", "true", "True", "TRUE"]);
var _FALSE_VALUES = /* @__PURE__ */ new Set(["0", "false", "False", "FALSE"]);
function localName2(node) {
  return localName(node);
}
function parseInt_(value, options) {
  const allowNone = options?.allowNone ?? true;
  if (value == null) {
    if (allowNone) return null;
    throw new Error("Missing integer value");
  }
  const n = Number(value);
  if (!Number.isFinite(n) || Math.floor(n) !== n) {
    throw new Error(`Invalid integer value: ${JSON.stringify(value)}`);
  }
  return n;
}
function parseBool(value, options) {
  const defaultValue = options?.default ?? null;
  if (value == null) return defaultValue;
  if (_TRUE_VALUES.has(value)) return true;
  if (_FALSE_VALUES.has(value)) return false;
  throw new Error(`Invalid boolean value: ${JSON.stringify(value)}`);
}
function textOrNone(node) {
  const text = node.textContent;
  if (text == null) return null;
  const trimmed = text.trim();
  return trimmed || null;
}

// src/oxml/body.ts
var _DEFAULT_HP_NS = "http://www.hancom.co.kr/hwpml/2011/paragraph";
var _DEFAULT_HP = `{${_DEFAULT_HP_NS}}`;
var INLINE_OBJECT_NAMES = /* @__PURE__ */ new Set([
  "line",
  "rect",
  "ellipse",
  "arc",
  "polyline",
  "polygon",
  "curve",
  "connectLine",
  "picture",
  "pic",
  "shape",
  "drawingObject",
  "container",
  "equation",
  "ole",
  "chart",
  "video",
  "audio",
  "textart"
]);
var _TRACK_CHANGE_MARK_NAMES = /* @__PURE__ */ new Set([
  "insertBegin",
  "insertEnd",
  "deleteBegin",
  "deleteEnd"
]);
function parseTrackChangeMark(node) {
  const attrs = { ...getAttributes(node) };
  const paraEnd = parseBool(attrs["paraend"] ?? null);
  delete attrs["paraend"];
  const tcId = parseInt_(attrs["TcId"] ?? null);
  delete attrs["TcId"];
  const markId = parseInt_(attrs["Id"] ?? null);
  delete attrs["Id"];
  const name = localName2(node);
  const changeType = name.startsWith("insert") ? "insert" : "delete";
  const isBegin = name.endsWith("Begin");
  return {
    tag: node.tagName,
    name,
    changeType,
    isBegin,
    paraEnd,
    tcId,
    id: markId,
    attributes: attrs
  };
}
function parseTextMarkup(node) {
  const name = localName2(node);
  if (_TRACK_CHANGE_MARK_NAMES.has(name)) {
    return parseTrackChangeMark(node);
  }
  return parseGenericElement(node);
}
function parseTextSpan(node) {
  const leading = getTextContent(node) ?? "";
  const marks = [];
  for (const child of childElements(node)) {
    const mark = parseTextMarkup(child);
    const trailing = getTailText(child);
    marks.push({ element: mark, trailingText: trailing });
  }
  return {
    tag: node.tagName,
    leadingText: leading,
    marks,
    attributes: getAttributes(node)
  };
}
function parseControlElement(node) {
  const attrs = { ...getAttributes(node) };
  const controlType = attrs["type"] ?? null;
  delete attrs["type"];
  const children = childElements(node).map((child) => parseGenericElement(child));
  return { tag: node.tagName, controlType, attributes: attrs, children };
}
function parseInlineObjectElement(node) {
  return {
    tag: node.tagName,
    name: localName2(node),
    attributes: getAttributes(node),
    children: childElements(node).map((child) => parseGenericElement(child))
  };
}
function parseTableElement(node) {
  return {
    tag: node.tagName,
    attributes: getAttributes(node),
    children: childElements(node).map((child) => parseGenericElement(child))
  };
}
function parseRunElement(node) {
  const attributes = { ...getAttributes(node) };
  const charPrIdRef = parseInt_(attributes["charPrIDRef"] ?? null);
  delete attributes["charPrIDRef"];
  const run = {
    tag: node.tagName,
    charPrIdRef,
    sectionProperties: [],
    controls: [],
    tables: [],
    inlineObjects: [],
    textSpans: [],
    otherChildren: [],
    attributes,
    content: []
  };
  for (const child of childElements(node)) {
    const name = localName2(child);
    if (name === "secPr") {
      const element = parseGenericElement(child);
      run.sectionProperties.push(element);
      run.content.push(element);
    } else if (name === "ctrl") {
      const control = parseControlElement(child);
      run.controls.push(control);
      run.content.push(control);
    } else if (name === "t") {
      const span = parseTextSpan(child);
      run.textSpans.push(span);
      run.content.push(span);
    } else if (name === "tbl") {
      const table = parseTableElement(child);
      run.tables.push(table);
      run.content.push(table);
    } else if (INLINE_OBJECT_NAMES.has(name)) {
      const obj = parseInlineObjectElement(child);
      run.inlineObjects.push(obj);
      run.content.push(obj);
    } else {
      const element = parseGenericElement(child);
      run.otherChildren.push(element);
      run.content.push(element);
    }
  }
  return run;
}
function parseParagraphElement(node) {
  const attributes = { ...getAttributes(node) };
  const paragraph = {
    tag: node.tagName,
    id: parseInt_(attributes["id"] ?? null),
    paraPrIdRef: parseInt_(attributes["paraPrIDRef"] ?? null),
    styleIdRef: parseInt_(attributes["styleIDRef"] ?? null),
    pageBreak: parseBool(attributes["pageBreak"] ?? null),
    columnBreak: parseBool(attributes["columnBreak"] ?? null),
    merged: parseBool(attributes["merged"] ?? null),
    runs: [],
    attributes: (() => {
      const a = { ...attributes };
      delete a["id"];
      delete a["paraPrIDRef"];
      delete a["styleIDRef"];
      delete a["pageBreak"];
      delete a["columnBreak"];
      delete a["merged"];
      return a;
    })(),
    otherChildren: [],
    content: []
  };
  for (const child of childElements(node)) {
    if (localName2(child) === "run") {
      const run = parseRunElement(child);
      paragraph.runs.push(run);
      paragraph.content.push(run);
    } else {
      const element = parseGenericElement(child);
      paragraph.otherChildren.push(element);
      paragraph.content.push(element);
    }
  }
  return paragraph;
}
function parseSectionElement(node) {
  const section = {
    tag: node.tagName,
    attributes: getAttributes(node),
    paragraphs: [],
    otherChildren: []
  };
  for (const child of childElements(node)) {
    if (localName2(child) === "p") {
      section.paragraphs.push(parseParagraphElement(child));
    } else {
      section.otherChildren.push(parseGenericElement(child));
    }
  }
  return section;
}

// src/oxml/header.ts
function parseBeginNum(node) {
  return {
    page: parseInt_(node.getAttribute("page"), { allowNone: false }),
    footnote: parseInt_(node.getAttribute("footnote"), { allowNone: false }),
    endnote: parseInt_(node.getAttribute("endnote"), { allowNone: false }),
    pic: parseInt_(node.getAttribute("pic"), { allowNone: false }),
    tbl: parseInt_(node.getAttribute("tbl"), { allowNone: false }),
    equation: parseInt_(node.getAttribute("equation"), { allowNone: false })
  };
}
function parseLinkInfo(node) {
  return {
    path: node.getAttribute("path") ?? "",
    pageInherit: parseBool(node.getAttribute("pageInherit"), { default: false }) ?? false,
    footnoteInherit: parseBool(node.getAttribute("footnoteInherit"), { default: false }) ?? false
  };
}
function parseLicenseMark(node) {
  return {
    type: parseInt_(node.getAttribute("type"), { allowNone: false }),
    flag: parseInt_(node.getAttribute("flag"), { allowNone: false }),
    lang: parseInt_(node.getAttribute("lang"))
  };
}
function parseDocOption(node) {
  let linkInfo = null;
  let licenseMark = null;
  for (const child of childElements(node)) {
    const name = localName2(child);
    if (name === "linkinfo") linkInfo = parseLinkInfo(child);
    else if (name === "licensemark") licenseMark = parseLicenseMark(child);
  }
  if (linkInfo == null) throw new Error("docOption element is missing required linkinfo child");
  return { linkInfo, licenseMark };
}
function parseKeyEncryption(node) {
  let derivationNode = null;
  let hashNode = null;
  for (const child of childElements(node)) {
    const name = localName2(child);
    if (name === "derivationKey") derivationNode = child;
    else if (name === "hash") hashNode = child;
  }
  if (!derivationNode || !hashNode) return null;
  const derivation = {
    algorithm: derivationNode.getAttribute("algorithm"),
    size: parseInt_(derivationNode.getAttribute("size")),
    count: parseInt_(derivationNode.getAttribute("count")),
    salt: derivationNode.getAttribute("salt")
  };
  const hashText = textOrNone(hashNode) ?? "";
  return { derivationKey: derivation, hashValue: hashText };
}
function parseTrackChangeConfig(node) {
  let encryption = null;
  for (const child of childElements(node)) {
    if (localName2(child) === "trackChangeEncrpytion") {
      encryption = parseKeyEncryption(child);
      break;
    }
  }
  return { flags: parseInt_(node.getAttribute("flags")), encryption };
}
function parseFontSubstitution(node) {
  return {
    face: node.getAttribute("face") ?? "",
    type: node.getAttribute("type") ?? "",
    isEmbedded: parseBool(node.getAttribute("isEmbedded"), { default: false }) ?? false,
    binaryItemIdRef: node.getAttribute("binaryItemIDRef")
  };
}
function parseFontTypeInfo(node) {
  return { attributes: getAttributes(node) };
}
function parseFont(node) {
  let substitution = null;
  let typeInfo = null;
  const otherChildren = {};
  for (const child of childElements(node)) {
    const name = localName2(child);
    if (name === "substFont") substitution = parseFontSubstitution(child);
    else if (name === "typeInfo") typeInfo = parseFontTypeInfo(child);
    else {
      if (!otherChildren[name]) otherChildren[name] = [];
      otherChildren[name].push(parseGenericElement(child));
    }
  }
  return {
    id: parseInt_(node.getAttribute("id")),
    face: node.getAttribute("face") ?? "",
    type: node.getAttribute("type"),
    isEmbedded: parseBool(node.getAttribute("isEmbedded"), { default: false }) ?? false,
    binaryItemIdRef: node.getAttribute("binaryItemIDRef"),
    substitution,
    typeInfo,
    otherChildren
  };
}
function parseFontFace(node) {
  const fonts = childElements(node).filter((c) => localName2(c) === "font").map(parseFont);
  return {
    lang: node.getAttribute("lang"),
    fontCnt: parseInt_(node.getAttribute("fontCnt")),
    fonts,
    attributes: getAttributes(node)
  };
}
function parseFontFaces(node) {
  const fontfaces = childElements(node).filter((c) => localName2(c) === "fontface").map(parseFontFace);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), fontfaces };
}
function parseBorderFills(node) {
  const fills = childElements(node).filter((c) => localName2(c) === "borderFill").map(parseGenericElement);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), fills };
}
function parseCharProperty(node) {
  const childAttrs = {};
  const childElems = {};
  for (const child of childElements(node)) {
    const children = childElements(child);
    const text = getTextContent(child);
    if (children.length === 0 && (text == null || !text.trim())) {
      childAttrs[localName2(child)] = getAttributes(child);
    } else {
      const name = localName2(child);
      if (!childElems[name]) childElems[name] = [];
      childElems[name].push(parseGenericElement(child));
    }
  }
  const allAttrs = getAttributes(node);
  const id = parseInt_(allAttrs["id"]);
  const { id: _id, ...attributes } = allAttrs;
  return { id, attributes, childAttributes: childAttrs, childElements: childElems };
}
function parseCharProperties(node) {
  const properties = childElements(node).filter((c) => localName2(c) === "charPr").map(parseCharProperty);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), properties };
}
function parseTabProperties(node) {
  const tabs = childElements(node).filter((c) => localName2(c) === "tabPr").map(parseGenericElement);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), tabs };
}
function parseNumberings(node) {
  const numberings = childElements(node).filter((c) => localName2(c) === "numbering").map(parseGenericElement);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), numberings };
}
function parseForbiddenWordList(node) {
  const words = childElements(node).filter((c) => localName2(c) === "forbiddenWord").map((c) => textOrNone(c) ?? "");
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), words };
}
function memoShapeFromAttributes(attrs) {
  return {
    id: parseInt_(attrs["id"] ?? null),
    width: parseInt_(attrs["width"] ?? null),
    lineWidth: attrs["lineWidth"] ?? null,
    lineType: attrs["lineType"] ?? null,
    lineColor: attrs["lineColor"] ?? null,
    fillColor: attrs["fillColor"] ?? null,
    activeColor: attrs["activeColor"] ?? null,
    memoType: attrs["memoType"] ?? null,
    attributes: { ...attrs }
  };
}
function parseMemoShape(node) {
  return memoShapeFromAttributes(getAttributes(node));
}
function parseMemoProperties(node) {
  const memoShapes = childElements(node).filter((c) => localName2(c) === "memoPr").map(parseMemoShape);
  const allAttrs = getAttributes(node);
  const { itemCnt: _itemCnt, ...attributes } = allAttrs;
  return {
    itemCnt: parseInt_(node.getAttribute("itemCnt")),
    memoShapes,
    attributes
  };
}
function parseBulletParaHead(node) {
  return {
    text: textOrNone(node) ?? "",
    level: parseInt_(node.getAttribute("level")),
    start: parseInt_(node.getAttribute("start")),
    align: node.getAttribute("align"),
    useInstWidth: parseBool(node.getAttribute("useInstWidth")),
    autoIndent: parseBool(node.getAttribute("autoIndent")),
    widthAdjust: parseInt_(node.getAttribute("widthAdjust")),
    textOffsetType: node.getAttribute("textOffsetType"),
    textOffset: parseInt_(node.getAttribute("textOffset")),
    attributes: getAttributes(node)
  };
}
function parseBullet(node) {
  let image = null;
  let paraHead = null;
  const otherChildren = {};
  for (const child of childElements(node)) {
    const name = localName2(child);
    if (name === "img") image = parseGenericElement(child);
    else if (name === "paraHead") paraHead = parseBulletParaHead(child);
    else {
      if (!otherChildren[name]) otherChildren[name] = [];
      otherChildren[name].push(parseGenericElement(child));
    }
  }
  if (paraHead == null) throw new Error("bullet element missing required paraHead child");
  return {
    id: parseInt_(node.getAttribute("id")),
    rawId: node.getAttribute("id"),
    char: node.getAttribute("char") ?? "",
    checkedChar: node.getAttribute("checkedChar"),
    useImage: parseBool(node.getAttribute("useImage"), { default: false }) ?? false,
    paraHead,
    image,
    attributes: getAttributes(node),
    otherChildren
  };
}
function parseBullets(node) {
  const bullets = childElements(node).filter((c) => localName2(c) === "bullet").map(parseBullet);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), bullets };
}
function parseParagraphAlignment(node) {
  return {
    horizontal: node.getAttribute("horizontal"),
    vertical: node.getAttribute("vertical"),
    attributes: getAttributes(node)
  };
}
function parseParagraphHeading(node) {
  return {
    type: node.getAttribute("type"),
    idRef: parseInt_(node.getAttribute("idRef")),
    level: parseInt_(node.getAttribute("level")),
    attributes: getAttributes(node)
  };
}
function parseParagraphBreakSetting(node) {
  return {
    breakLatinWord: node.getAttribute("breakLatinWord"),
    breakNonLatinWord: node.getAttribute("breakNonLatinWord"),
    widowOrphan: parseBool(node.getAttribute("widowOrphan")),
    keepWithNext: parseBool(node.getAttribute("keepWithNext")),
    keepLines: parseBool(node.getAttribute("keepLines")),
    pageBreakBefore: parseBool(node.getAttribute("pageBreakBefore")),
    lineWrap: node.getAttribute("lineWrap"),
    attributes: getAttributes(node)
  };
}
function parseParagraphMargin(node) {
  const values = {
    intent: null,
    left: null,
    right: null,
    prev: null,
    next: null
  };
  const otherChildren = {};
  for (const child of childElements(node)) {
    const name = localName2(child);
    if (name in values) {
      values[name] = textOrNone(child);
    } else {
      if (!otherChildren[name]) otherChildren[name] = [];
      otherChildren[name].push(parseGenericElement(child));
    }
  }
  return {
    intent: values["intent"] ?? null,
    left: values["left"] ?? null,
    right: values["right"] ?? null,
    prev: values["prev"] ?? null,
    next: values["next"] ?? null,
    otherChildren
  };
}
function parseParagraphLineSpacing(node) {
  return {
    spacingType: node.getAttribute("type"),
    value: parseInt_(node.getAttribute("value")),
    unit: node.getAttribute("unit"),
    attributes: getAttributes(node)
  };
}
function parseParagraphBorder(node) {
  return {
    borderFillIdRef: parseInt_(node.getAttribute("borderFillIDRef")),
    offsetLeft: parseInt_(node.getAttribute("offsetLeft")),
    offsetRight: parseInt_(node.getAttribute("offsetRight")),
    offsetTop: parseInt_(node.getAttribute("offsetTop")),
    offsetBottom: parseInt_(node.getAttribute("offsetBottom")),
    connect: parseBool(node.getAttribute("connect")),
    ignoreMargin: parseBool(node.getAttribute("ignoreMargin")),
    attributes: getAttributes(node)
  };
}
function parseParagraphAutoSpacing(node) {
  return {
    eAsianEng: parseBool(node.getAttribute("eAsianEng")),
    eAsianNum: parseBool(node.getAttribute("eAsianNum")),
    attributes: getAttributes(node)
  };
}
function parseParagraphProperty(node) {
  let align = null;
  let heading = null;
  let breakSetting = null;
  let margin = null;
  let lineSpacing = null;
  let border = null;
  let autoSpacing = null;
  const otherChildren = {};
  for (const child of childElements(node)) {
    const name = localName2(child);
    if (name === "align") align = parseParagraphAlignment(child);
    else if (name === "heading") heading = parseParagraphHeading(child);
    else if (name === "breakSetting") breakSetting = parseParagraphBreakSetting(child);
    else if (name === "margin") margin = parseParagraphMargin(child);
    else if (name === "lineSpacing") lineSpacing = parseParagraphLineSpacing(child);
    else if (name === "border") border = parseParagraphBorder(child);
    else if (name === "autoSpacing") autoSpacing = parseParagraphAutoSpacing(child);
    else {
      if (!otherChildren[name]) otherChildren[name] = [];
      otherChildren[name].push(parseGenericElement(child));
    }
  }
  const knownAttrs = /* @__PURE__ */ new Set(["id", "tabPrIDRef", "condense", "fontLineHeight", "snapToGrid", "suppressLineNumbers", "checked"]);
  const allAttrs = getAttributes(node);
  const attributes = {};
  for (const [key, value] of Object.entries(allAttrs)) {
    if (!knownAttrs.has(key)) attributes[key] = value;
  }
  return {
    id: parseInt_(node.getAttribute("id")),
    rawId: node.getAttribute("id"),
    tabPrIdRef: parseInt_(node.getAttribute("tabPrIDRef")),
    condense: parseInt_(node.getAttribute("condense")),
    fontLineHeight: parseBool(node.getAttribute("fontLineHeight")),
    snapToGrid: parseBool(node.getAttribute("snapToGrid")),
    suppressLineNumbers: parseBool(node.getAttribute("suppressLineNumbers")),
    checked: parseBool(node.getAttribute("checked")),
    align,
    heading,
    breakSetting,
    margin,
    lineSpacing,
    border,
    autoSpacing,
    attributes,
    otherChildren
  };
}
function parseParagraphProperties(node) {
  const properties = childElements(node).filter((c) => localName2(c) === "paraPr").map(parseParagraphProperty);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), properties };
}
function parseStyle(node) {
  const knownAttrs = /* @__PURE__ */ new Set(["id", "type", "name", "engName", "paraPrIDRef", "charPrIDRef", "nextStyleIDRef", "langID", "lockForm"]);
  const allAttrs = getAttributes(node);
  const attributes = {};
  for (const [key, value] of Object.entries(allAttrs)) {
    if (!knownAttrs.has(key)) attributes[key] = value;
  }
  return {
    id: parseInt_(node.getAttribute("id")),
    rawId: node.getAttribute("id"),
    type: node.getAttribute("type"),
    name: node.getAttribute("name"),
    engName: node.getAttribute("engName"),
    paraPrIdRef: parseInt_(node.getAttribute("paraPrIDRef")),
    charPrIdRef: parseInt_(node.getAttribute("charPrIDRef")),
    nextStyleIdRef: parseInt_(node.getAttribute("nextStyleIDRef")),
    langId: parseInt_(node.getAttribute("langID")),
    lockForm: parseBool(node.getAttribute("lockForm")),
    attributes
  };
}
function parseStyles(node) {
  const styles = childElements(node).filter((c) => localName2(c) === "style").map(parseStyle);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), styles };
}
function parseTrackChange(node) {
  const knownAttrs = /* @__PURE__ */ new Set(["id", "type", "date", "authorID", "charShapeID", "paraShapeID", "hide"]);
  const allAttrs = getAttributes(node);
  const attributes = {};
  for (const [key, value] of Object.entries(allAttrs)) {
    if (!knownAttrs.has(key)) attributes[key] = value;
  }
  return {
    id: parseInt_(node.getAttribute("id")),
    rawId: node.getAttribute("id"),
    changeType: node.getAttribute("type"),
    date: node.getAttribute("date"),
    authorId: parseInt_(node.getAttribute("authorID")),
    charShapeId: parseInt_(node.getAttribute("charShapeID")),
    paraShapeId: parseInt_(node.getAttribute("paraShapeID")),
    hide: parseBool(node.getAttribute("hide")),
    attributes
  };
}
function parseTrackChanges(node) {
  const changes = childElements(node).filter((c) => localName2(c) === "trackChange").map(parseTrackChange);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), changes };
}
function parseTrackChangeAuthor(node) {
  const knownAttrs = /* @__PURE__ */ new Set(["id", "name", "mark", "color"]);
  const allAttrs = getAttributes(node);
  const attributes = {};
  for (const [key, value] of Object.entries(allAttrs)) {
    if (!knownAttrs.has(key)) attributes[key] = value;
  }
  return {
    id: parseInt_(node.getAttribute("id")),
    rawId: node.getAttribute("id"),
    name: node.getAttribute("name"),
    mark: parseBool(node.getAttribute("mark")),
    color: node.getAttribute("color"),
    attributes
  };
}
function parseTrackChangeAuthors(node) {
  const authors = childElements(node).filter((c) => localName2(c) === "trackChangeAuthor").map(parseTrackChangeAuthor);
  return { itemCnt: parseInt_(node.getAttribute("itemCnt")), authors };
}
function parseRefList(node) {
  const refList = {
    fontfaces: null,
    borderFills: null,
    charProperties: null,
    tabProperties: null,
    numberings: null,
    bullets: null,
    paraProperties: null,
    styles: null,
    memoProperties: null,
    trackChanges: null,
    trackChangeAuthors: null,
    otherCollections: {}
  };
  for (const child of childElements(node)) {
    const name = localName2(child);
    if (name === "fontfaces") refList.fontfaces = parseFontFaces(child);
    else if (name === "borderFills") refList.borderFills = parseBorderFills(child);
    else if (name === "charProperties") refList.charProperties = parseCharProperties(child);
    else if (name === "tabProperties") refList.tabProperties = parseTabProperties(child);
    else if (name === "numberings") refList.numberings = parseNumberings(child);
    else if (name === "bullets") refList.bullets = parseBullets(child);
    else if (name === "paraProperties") refList.paraProperties = parseParagraphProperties(child);
    else if (name === "styles") refList.styles = parseStyles(child);
    else if (name === "memoProperties") refList.memoProperties = parseMemoProperties(child);
    else if (name === "trackChanges") refList.trackChanges = parseTrackChanges(child);
    else if (name === "trackChangeAuthors") refList.trackChangeAuthors = parseTrackChangeAuthors(child);
    else {
      if (!refList.otherCollections[name]) refList.otherCollections[name] = [];
      refList.otherCollections[name].push(parseGenericElement(child));
    }
  }
  return refList;
}
function parseHeaderElement(node) {
  const version = node.getAttribute("version");
  if (version == null) throw new Error("Header element is missing required version attribute");
  const secCnt = parseInt_(node.getAttribute("secCnt"), { allowNone: false });
  const header = {
    version,
    secCnt,
    beginNum: null,
    refList: null,
    forbiddenWordList: null,
    compatibleDocument: null,
    docOption: null,
    metaTag: null,
    trackChangeConfig: null,
    otherElements: {}
  };
  for (const child of childElements(node)) {
    const name = localName2(child);
    if (name === "beginNum") header.beginNum = parseBeginNum(child);
    else if (name === "refList") header.refList = parseRefList(child);
    else if (name === "forbiddenWordList") header.forbiddenWordList = parseForbiddenWordList(child);
    else if (name === "compatibleDocument") header.compatibleDocument = parseGenericElement(child);
    else if (name === "docOption") header.docOption = parseDocOption(child);
    else if (name === "metaTag") header.metaTag = textOrNone(child);
    else if (name === "trackchangeConfig") header.trackChangeConfig = parseTrackChangeConfig(child);
    else {
      if (!header.otherElements[name]) header.otherElements[name] = [];
      header.otherElements[name].push(parseGenericElement(child));
    }
  }
  return header;
}

// src/oxml/parser.ts
var _ELEMENT_FACTORY = {
  head: parseHeaderElement,
  beginNum: parseBeginNum,
  refList: parseRefList,
  docOption: parseDocOption,
  sec: parseSectionElement,
  p: parseParagraphElement,
  run: parseRunElement,
  t: parseTextSpan,
  ctrl: parseControlElement,
  tbl: parseTableElement
};
for (const name of INLINE_OBJECT_NAMES) {
  if (!(name in _ELEMENT_FACTORY)) {
    _ELEMENT_FACTORY[name] = parseInlineObjectElement;
  }
}
for (const markName of ["insertBegin", "insertEnd", "deleteBegin", "deleteEnd"]) {
  if (!(markName in _ELEMENT_FACTORY)) {
    _ELEMENT_FACTORY[markName] = parseTrackChangeMark;
  }
}
function elementToModel(node) {
  const parser = _ELEMENT_FACTORY[localName2(node)];
  if (parser == null) {
    return parseGenericElement(node);
  }
  return parser(node);
}
function parseHeaderXml(source) {
  const doc = parseXml(source);
  const root = doc.documentElement;
  if (localName2(root) !== "head") {
    throw new Error("Expected <head> root element");
  }
  return parseHeaderElement(root);
}
function parseSectionXml(source) {
  const doc = parseXml(source);
  const root = doc.documentElement;
  if (localName2(root) !== "sec") {
    throw new Error("Expected <sec> root element");
  }
  return parseSectionElement(root);
}

// src/tools/text-extractor.ts
var DEFAULT_NAMESPACES = {
  hp: "http://www.hancom.co.kr/hwpml/2011/paragraph",
  hp10: "http://www.hancom.co.kr/hwpml/2016/paragraph",
  hs: "http://www.hancom.co.kr/hwpml/2011/section",
  hc: "http://www.hancom.co.kr/hwpml/2011/core",
  ha: "http://www.hancom.co.kr/hwpml/2011/app",
  hh: "http://www.hancom.co.kr/hwpml/2011/head",
  hhs: "http://www.hancom.co.kr/hwpml/2011/history",
  hm: "http://www.hancom.co.kr/hwpml/2011/master-page",
  hpf: "http://www.hancom.co.kr/schema/2011/hpf",
  dc: "http://purl.org/dc/elements/1.1/",
  opf: "http://www.idpf.org/2007/opf/"
};
var SECTION_PATTERN = /^Contents\/section(\d+)\.xml$/;
function buildParentMap(root) {
  const parentMap = /* @__PURE__ */ new Map();
  const walk = (node) => {
    for (const child of childElements(node)) {
      parentMap.set(child, node);
      walk(child);
    }
  };
  walk(root);
  return parentMap;
}
function describeElementPath(element, parentMap) {
  const parts = [];
  let current = element;
  while (current) {
    parts.unshift(localName(current));
    current = parentMap.get(current);
  }
  return parts.join("/");
}
function collectParagraphText(paragraphElement) {
  const parts = [];
  for (const run of childElements(paragraphElement)) {
    if (localName(run) !== "run") continue;
    for (const child of childElements(run)) {
      const name = localName(child);
      if (name === "t") {
        const text = child.textContent ?? "";
        if (text) parts.push(text);
      }
    }
  }
  return parts.join("");
}
var TextExtractor = class {
  _pkg;
  _annotationOptions;
  constructor(pkg, annotationOptions) {
    this._pkg = pkg;
    this._annotationOptions = annotationOptions ?? {};
  }
  /** Return sections found in the package. */
  sections() {
    const result = [];
    const partNames = this._pkg.partNames();
    for (const name of partNames) {
      const match = SECTION_PATTERN.exec(name);
      if (match && match[1]) {
        const index = parseInt(match[1], 10);
        result.push({
          index,
          name: `section${match[1]}`,
          path: name
        });
      }
    }
    result.sort((a, b) => a.index - b.index);
    return result;
  }
  /** Extract paragraphs from a section XML string or all sections. */
  extractParagraphs(sectionIndex) {
    const sections = this.sections();
    const targetSections = sectionIndex != null ? sections.filter((s) => s.index === sectionIndex) : sections;
    const paragraphs = [];
    for (const sectionInfo of targetSections) {
      const xmlText = this._pkg.getText(sectionInfo.path);
      const doc = parseXml(xmlText);
      const root = doc.documentElement;
      let paragraphIndex = 0;
      const findParagraphs = (node) => {
        for (const child of childElements(node)) {
          if (localName(child) === "p") {
            const text = collectParagraphText(child);
            paragraphs.push({
              sectionIndex: sectionInfo.index,
              paragraphIndex: paragraphIndex++,
              text,
              attributes: getAttributes(child)
            });
          }
          if (localName(child) === "subList" || localName(child) === "sec") {
            findParagraphs(child);
          }
        }
      };
      findParagraphs(root);
    }
    return paragraphs;
  }
  /** Extract all text from the document as a single string. */
  extractText(separator = "\n") {
    const paragraphs = this.extractParagraphs();
    return paragraphs.map((p) => p.text).join(separator);
  }
  /** Extract text section by section. */
  extractSectionTexts(separator = "\n") {
    const sections = this.sections();
    const result = /* @__PURE__ */ new Map();
    for (const sectionInfo of sections) {
      const paragraphs = this.extractParagraphs(sectionInfo.index);
      result.set(sectionInfo.index, paragraphs.map((p) => p.text).join(separator));
    }
    return result;
  }
};

// src/tools/object-finder.ts
function matchesAttr(value, matcher) {
  if (value == null) return false;
  if (typeof matcher === "string") return value === matcher;
  if (Array.isArray(matcher)) return matcher.includes(value);
  if (matcher instanceof RegExp) return matcher.test(value);
  if (typeof matcher === "function") return matcher(value);
  return false;
}
var ObjectFinder = class {
  _pkg;
  _namespaces;
  constructor(pkg, namespaces) {
    this._pkg = pkg;
    this._namespaces = { ...DEFAULT_NAMESPACES, ...namespaces };
  }
  /** Return sections found in the package. */
  sections() {
    const extractor = new TextExtractor(this._pkg);
    return extractor.sections();
  }
  /** Find elements by local tag name. */
  findByTag(tagName, opts) {
    const sections = this.sections();
    const targetSections = opts?.sectionIndex != null ? sections.filter((s) => s.index === opts.sectionIndex) : sections;
    const results = [];
    for (const sectionInfo of targetSections) {
      const xmlText = this._pkg.getText(sectionInfo.path);
      const doc = parseXml(xmlText);
      const root = doc.documentElement;
      const parentMap = buildParentMap(root);
      const walk = (node) => {
        if (localName(node) === tagName) {
          results.push({
            section: sectionInfo,
            path: describeElementPath(node, parentMap),
            element: node
          });
        }
        for (const child of childElements(node)) {
          walk(child);
        }
      };
      walk(root);
    }
    return results;
  }
  /** Find elements by attribute match. */
  findByAttribute(attributeName, matcher, opts) {
    const sections = this.sections();
    const targetSections = opts?.sectionIndex != null ? sections.filter((s) => s.index === opts.sectionIndex) : sections;
    const results = [];
    for (const sectionInfo of targetSections) {
      const xmlText = this._pkg.getText(sectionInfo.path);
      const doc = parseXml(xmlText);
      const root = doc.documentElement;
      const parentMap = buildParentMap(root);
      const walk = (node) => {
        const name = localName(node);
        if (opts?.tagName && name !== opts.tagName) {
        } else {
          const value = node.getAttribute(attributeName);
          if (matchesAttr(value, matcher)) {
            results.push({
              section: sectionInfo,
              path: describeElementPath(node, parentMap),
              element: node
            });
          }
        }
        for (const child of childElements(node)) {
          walk(child);
        }
      };
      walk(root);
    }
    return results;
  }
  /** Find all tables in the document. */
  findTables(opts) {
    return this.findByTag("tbl", opts);
  }
  /** Find all pictures/images in the document. */
  findPictures(opts) {
    return this.findByTag("pic", opts);
  }
  /** Find all controls in the document. */
  findControls(opts) {
    const elements = this.findByTag("ctrl", opts);
    if (opts?.controlType) {
      return elements.filter((el) => el.element.getAttribute("type") === opts.controlType);
    }
    return elements;
  }
  /** Find annotations (highlights, footnotes, etc.) */
  findAnnotations(opts) {
    const results = [];
    const sections = this.sections();
    const targetSections = opts?.sectionIndex != null ? sections.filter((s) => s.index === opts.sectionIndex) : sections;
    for (const sectionInfo of targetSections) {
      const xmlText = this._pkg.getText(sectionInfo.path);
      const doc = parseXml(xmlText);
      const root = doc.documentElement;
      const parentMap = buildParentMap(root);
      const walk = (node) => {
        const name = localName(node);
        let kind = null;
        let value = null;
        if (name === "markpenBegin" || name === "markpenEnd") {
          kind = "highlight";
          value = node.getAttribute("color") ?? null;
        } else if (name === "footNote" || name === "endNote") {
          kind = name === "footNote" ? "footnote" : "endnote";
          value = node.getAttribute("instId") ?? null;
        } else if (name === "hyperlink") {
          kind = "hyperlink";
          value = node.getAttribute("url") ?? node.getAttribute("target") ?? null;
        }
        if (kind && (!opts?.kind || opts.kind === kind)) {
          results.push({
            kind,
            element: {
              section: sectionInfo,
              path: describeElementPath(node, parentMap),
              element: node
            },
            value
          });
        }
        for (const child of childElements(node)) {
          walk(child);
        }
      };
      walk(root);
    }
    return results;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HwpxDocument,
  HwpxOxmlDocument,
  HwpxOxmlHeader,
  HwpxOxmlHistory,
  HwpxOxmlMasterPage,
  HwpxOxmlMemo,
  HwpxOxmlMemoGroup,
  HwpxOxmlParagraph,
  HwpxOxmlRun,
  HwpxOxmlSection,
  HwpxOxmlSectionHeaderFooter,
  HwpxOxmlSectionProperties,
  HwpxOxmlTable,
  HwpxOxmlTableCell,
  HwpxOxmlTableRow,
  HwpxOxmlVersion,
  HwpxPackage,
  ObjectFinder,
  TextExtractor,
  __version__,
  childElements,
  createElement,
  elementToModel,
  fetchSkeletonHwpx,
  getAttributes,
  getTailText,
  getTextContent,
  loadSkeletonHwpx,
  localName,
  parseHeaderXml,
  parseSectionXml,
  parseXml,
  resolveLibraryVersion,
  serializeXml,
  setSkeletonHwpx,
  setTextContent
});
//# sourceMappingURL=index.cjs.map