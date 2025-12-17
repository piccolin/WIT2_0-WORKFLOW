/**
 * @Filename:    canonicalization.models.ts
 * @Type:        Models
 * @Date:        2025-12-17
 * @Author:      Guido A. Piccolino Jr.
 *
 * @Description:
 *   Shared enums + types used by vendor canonicalization pipelines.
 *
 * @Notes:
 *   - The DB schema is the canonical model (Amplify codegen types).
 *   - Parsing produces Partial<T> where T is SalesOrder / PurchaseOrder / ConfirmationOrder.
 */
import {ConfirmationOrder, PurchaseOrder, SalesOrder} from "@scr/API";


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
  Pdf = 'PDF',
  Json = 'JSON',
  Xml = 'XML'
}

// -----------------------------------------------------------------
// Canonical Model Types (DB Schema)
// -----------------------------------------------------------------

export type CanonicalSalesOrderPartial = Partial<SalesOrder>;
export type CanonicalPurchaseOrderPartial = Partial<PurchaseOrder>;
export type CanonicalConfirmationOrderPartial = Partial<ConfirmationOrder>;

export type CanonicalOrderPartial =
  | CanonicalSalesOrderPartial
  | CanonicalPurchaseOrderPartial
  | CanonicalConfirmationOrderPartial;

// -----------------------------------------------------------------
// Pipeline Contracts
// -----------------------------------------------------------------

export interface CanonicalizationRequest {
  vendor: Vendors;
  orderType: OrderType;

  // We will know the file type based on vendor (still passed in for clarity / validation)
  fileType: FileType;

  fileName?: string;
  file: File | Blob;

  // Optional: if a previous step already read the file contents
  rawText?: string;
}

export interface CanonicalizationResult<TCanonical> {
  model: Partial<TCanonical>;
  warnings: string[];
  errors: string[];
}

export interface CanonicalizationPipeline {
  canonicalize(request: CanonicalizationRequest): Promise<CanonicalizationResult<SalesOrder | PurchaseOrder | ConfirmationOrder>>;
}
