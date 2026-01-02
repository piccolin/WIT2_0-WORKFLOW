/**
 * @Filename:    html-file-parser.service.ts
 * @Type:        Service
 * @Date:        2026-01-02
 *
 * @Description:
 *   Standalone HTML file parser.
 *    - Reads a File into raw HTML text
 *    - Removes HTML comments
 *    - Strips specific tags (script/meta/link/noscript/style)
 *    - Collapses whitespace + removes empty lines
 *    - Returns a parsed DocumentFragment (template.content)
 *
 *   Throws HtmlParseError with a consistent code/message/cause contract.
 */

import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { collapse } from 'string-collapse-white-space';
import { stripHtml } from 'string-strip-html';

import { HtmlParseError } from '../errors/html-parse-error';

// -----------------------------------------------------------------
// Models
// -----------------------------------------------------------------
export interface HtmlParseResult {
  rawHtmlText: string;
  strippedHtmlText: string;
  cleanedHtmlText: string;
  doc: DocumentFragment;
}

export interface HtmlParserOptions {
  stripTags?: Array<'script' | 'meta' | 'link' | 'noscript' | 'style'>;
  removeEmptyLines?: boolean;
  cloneDoc?: boolean;
}

// -----------------------------------------------------------------
// Service
// -----------------------------------------------------------------
@Injectable({
  providedIn: 'root',
})
export class HtmlFileParserService {
  // -----------------------------------------------------------------
  // Data
  // -----------------------------------------------------------------
  private readonly defaults: Required<HtmlParserOptions> = {
    stripTags: ['script', 'meta', 'link', 'noscript', 'style'],
    removeEmptyLines: true,
    cloneDoc: true,
  };

  // -----------------------------------------------------------------
  // DI
  // -----------------------------------------------------------------
  constructor(@Inject(DOCUMENT) private document: Document) {}

  // -----------------------------------------------------------------
  // Core
  // -----------------------------------------------------------------
  public async parse(file?: File | null, options?: HtmlParserOptions): Promise<HtmlParseResult> {
    if (!file) {
      throw new HtmlParseError('NO_FILE', 'No HTML file was provided');
    }

    const opts = { ...this.defaults, ...(options || {}) };

    const rawHtmlText = await this.readFileAsText(file);

    if (!rawHtmlText || !rawHtmlText.trim()) {
      throw new HtmlParseError('EMPTY_FILE', 'The HTML file is empty');
    }

    let strippedHtmlText: string;
    try {
      // remove HTML comments (multi-line safe) + trim
      const withoutComments = rawHtmlText.replace(/<!--[\s\S]*?-->/g, '').trim();

      // strip only selected tags
      strippedHtmlText = stripHtml(withoutComments, {
        onlyStripTags: opts.stripTags,
      }).result;
    } catch (cause) {
      throw new HtmlParseError('STRIP_FAILED', 'Failed while stripping HTML tags/comments', cause);
    }

    let cleanedHtmlText: string;
    try {
      // normalize whitespace
      cleanedHtmlText = collapse(strippedHtmlText, {
        removeEmptyLines: opts.removeEmptyLines,
      }).result;
    } catch (cause) {
      throw new HtmlParseError('CLEAN_FAILED', 'Failed while collapsing whitespace in HTML', cause);
    }

    try {
      const template = this.document.createElement('template');
      template.innerHTML = cleanedHtmlText;

      const doc = opts.cloneDoc
        ? (template.content.cloneNode(true) as DocumentFragment)
        : template.content;

      return {
        rawHtmlText,
        strippedHtmlText,
        cleanedHtmlText,
        doc,
      };
    } catch (cause) {
      throw new HtmlParseError('PARSE_FAILED', 'Failed while parsing cleaned HTML into a document', cause);
    }
  }

  public async parseToDoc(file?: File | null, options?: HtmlParserOptions): Promise<DocumentFragment> {
    const res = await this.parse(file, options);
    return res.doc;
  }

  // -----------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------
  private async readFileAsText(file: File): Promise<string> {
    try {
      const anyFile = file as any;

      if (anyFile && typeof anyFile.text === 'function') {
        return await anyFile.text();
      }

      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read file'));
        reader.onload = () => resolve(String(reader.result || ''));
        reader.readAsText(file);
      });
    } catch (cause) {
      throw new HtmlParseError('READ_FAILED', 'Failed to read HTML file contents', cause);
    }
  }
}
