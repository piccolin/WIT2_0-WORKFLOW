/**
 * @Filename:    pdf-table-behaviorial.model.ts
 * @Type:        Model
 * @Date:        2025-12-17
 *
 * @Description:
 *   Generic table model used by PdfTableBuilder.
 *
 *   A “PDF table” is not a real table.
 *   It's just text sitting at different X positions on each line.
 *   This model stores:
 *   - the column names we think the table has
 *   - the rows we extracted under those columns
 *
 *   Coder’s note:
 *   Options are intentionally small and generic so this stays vendor-agnostic.
 */

export type PdfTableRow = Record<string, string>;

export interface PdfTableGeometryOptionsModel {
  /** How close Y values must be to be considered the same line. */
  lineTolerance?: number;

  /** How close tokens must be to be merged into one chunk (header parsing). */
  joinTolerance?: number;
}

export interface PdfTableParseOptionsModel {
  /**
   * A row is considered "real" only if it has at least this many non-empty cells.
   * Helps ignore noise lines.
   */
  minFilledCells?: number;

  /**
   * Stop after N consecutive “blank/noise” lines.
   * Prevents scanning the whole page forever.
   */
  blankLineLimit?: number;

  /**
   * Optional custom stop rule.
   * If this returns true, parsing stops immediately.
   */
  stopPredicate?: (row: PdfTableRow, rawLineText: string) => boolean;
}

export interface PdfTableOptionsModel {
  /** Geometry behavior (line grouping, header token joining). */
  geometry?: PdfTableGeometryOptionsModel;

  /** Parsing behavior (blank handling, stopping). */
  parse?: PdfTableParseOptionsModel;

  /**
   * Optional: rename/simplify column headers.
   * Example: map "Unit $" -> "Each"
   */
  columnNamer?: (rawColumnName: string) => string;
}

export class PdfTable {
  public columns: string[] = [];
  public rows: PdfTableRow[] = [];

  constructor(public readonly options: PdfTableOptionsModel = {}) {}

  /**
   * Set the table columns based on the extracted header text.
   *
   * CODER’s NOTE:
   * PDFs sometimes repeat column headers or produce duplicates.
   * We force uniqueness by appending " 1", " 2", etc.
   */
  public setColumns(rawColumns: string[]): void {
    const cleaned = rawColumns
      .map((column: string) => (column ?? '').replace(/\s+/g, ' ').trim())
      .filter((column: string) => column.length > 0)
      .map((column: string) => (this.options.columnNamer ? this.options.columnNamer(column) : column))
      .map((column: string) => column.replace(/\s+/g, ' ').trim());

    this.columns = PdfTable.makeUnique(cleaned);
  }

  /** Add one extracted row into the table. */
  public addRow(row: PdfTableRow): void {
    this.rows.push(row);
  }

  /** Convenience helper for vendor parsers (matches the older style you had). */
  public toArray(): PdfTableRow[] {
    return [...this.rows];
  }

  // -----------------------------------------------------------------
  // Internals
  // -----------------------------------------------------------------

  private static makeUnique(columns: string[]): string[] {
    const seen = new Map<string, number>();
    return columns.map((column: string) => {
      const count = seen.get(column) ?? 0;
      seen.set(column, count + 1);
      return count === 0 ? column : `${column} ${count}`;
    });
  }
}
