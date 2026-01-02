/**
 * @Filename:    transform.models.ts
 * @Type:        Models
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   Shared enums + types used by vendor canonicalization transformers.
 *
 * @Notes:
 *   - The DB schema is the canonical model (Amplify codegen types).
 *   - Parsing produces Partial<T> where T is SalesOrder / PurchaseOrder / ConfirmationOrder.
 */
import {ConfirmationOrder, PurchaseOrder, SalesOrder, SalesOrderItems} from "@scr/API";


// -----------------------------------------------------------------
// Enums
// -----------------------------------------------------------------

export enum Vendors {
  Cubitac = 'Cubitac',
  ForeverMark = 'ForeverMark',
  Ghi = 'GHI',
  UsCabinet = 'US Cabinet',
  Wolf = 'Wolf',
  Tsg = 'TSG',
  MatrixCabinets = 'Matrix Cabinets',
  HorningsSupply = 'Hornings Supply'
}

export enum OrderType {
  Sales = 'SALES',
  Purchase = 'PURCHASE',
  Confirmation = 'CONFIRMATION'
}

export enum FileType {
  Csv = 'CSV',
  Html = 'HTML',
  Pdf = 'PDF',
  Json = 'JSON',
  Xml = 'XML'
}

// -----------------------------------------------------------------
// Pipeline Contracts
// -----------------------------------------------------------------

export interface TransformationRequest {
  vendor: Vendors;
  orderType: OrderType;

  // We will know the file type based on vendor (still passed in for clarity / validation)
  fileType: FileType;

  fileName?: string;
  file: File | Blob;

  // Optional: if a previous step already read the file contents
  rawText?: string;
}

export interface TransformationResult<TCanonical> {
  model: Partial<TCanonical>;
  warnings: string[];
  errors: string[];
}

// -----------------------------------------------------------------
// Canonicals
// -----------------------------------------------------------------

export interface SalesOrderMapResult {
  salesOrder: SalesOrder;
  salesOrderItems: SalesOrderItems[];
}

