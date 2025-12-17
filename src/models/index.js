// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const CabinetType = {
  "WALL": "WALL",
  "BASE": "BASE",
  "TALL": "TALL",
  "VANITY": "VANITY",
  "SAMPLE_DOOR": "SAMPLE_DOOR",
  "SAMPLE_FRONT": "SAMPLE_FRONT"
};

const AssemblyType = {
  "RTA": "RTA",
  "ASSEMBLED": "ASSEMBLED"
};

const ProductType = {
  "CABINET": "CABINET",
  "FILLER": "FILLER",
  "MOULDING": "MOULDING",
  "PANEL": "PANEL",
  "EDGE_BANDING": "EDGE_BANDING",
  "WALL_HANGING_KIT": "WALL_HANGING_KIT",
  "FLOATING_WALL_SHELF": "FLOATING_WALL_SHELF",
  "STORAGE_ACCESSORY": "STORAGE_ACCESSORY",
  "TOUCHUP_KIT": "TOUCHUP_KIT"
};

const ProductSubType = {
  "PULLOUT_ORGANIZER": "PULLOUT_ORGANIZER",
  "TRASH": "TRASH",
  "SINK_TILT_OUT": "SINK_TILT_OUT",
  "INSIDE_DRAWER": "INSIDE_DRAWER",
  "INSIDE_DOOR": "INSIDE_DOOR",
  "PAINT": "PAINT",
  "STAIN": "STAIN"
};

const CabinetLine = {
  "ENTRY": "ENTRY",
  "PREMIUM": "PREMIUM",
  "CUSTOM": "CUSTOM"
};

const FinishType = {
  "PAINTED": "PAINTED",
  "STAINED": "STAINED",
  "THERMOFOIL": "THERMOFOIL"
};

const OverlayType = {
  "FULL": "FULL",
  "PARTIAL": "PARTIAL",
  "INSET": "INSET"
};

const BoxConstructionType = {
  "FRAMED": "FRAMED",
  "FRAMELESS": "FRAMELESS"
};

const OrderSource = {
  "WOOCOMMERCE": "WOOCOMMERCE",
  "PROKITCHEN": "PROKITCHEN",
  "MANUAL_ENTRY": "MANUAL_ENTRY"
};

const OrderStatus = {
  "DRAFT": "DRAFT",
  "OPEN": "OPEN",
  "CONFIRMED": "CONFIRMED",
  "CLOSED": "CLOSED",
  "CANCELLED": "CANCELLED"
};

const FulfillmentStatus = {
  "UNFULFILLED": "UNFULFILLED",
  "PARTIAL": "PARTIAL",
  "FULFILLED": "FULFILLED",
  "BACKORDERED": "BACKORDERED"
};

const ShippingStatus = {
  "NOT_SHIPPED": "NOT_SHIPPED",
  "PARTIAL": "PARTIAL",
  "SHIPPED": "SHIPPED",
  "DELIVERED": "DELIVERED"
};

const PaymentStatus = {
  "UNPAID": "UNPAID",
  "PARTIAL": "PARTIAL",
  "PAID": "PAID",
  "REFUNDED": "REFUNDED",
  "VOIDED": "VOIDED"
};

const CurrencyCode = {
  "USD": "USD",
  "CAD": "CAD",
  "EUR": "EUR",
  "GBP": "GBP"
};

const Vendors = {
  "CUBITAC": "Cubitac",
  "FOREVER_MARK": "ForeverMark",
  "GHI": "GHI",
  "US": "US",
  "CABINET": "Cabinet",
  "WOLF": "Wolf",
  "TSG": "TSG",
  "MATRIX": "Matrix",
  "CABINETS": "Cabinets",
  "HORNINGS": "Hornings",
  "SUPPLY": "Supply"
};

const Carriers = {
  "FED_EX": "FedEx",
  "UPS": "UPS",
  "USPS": "USPS"
};

const PayLoadType = {
  "SALES": "SALES",
  "PURCHASE": "PURCHASE",
  "CONFRINATION": "CONFRINATION"
};

const { CabinetProduct, SalesOrder, SalesOrderItems, PurchaseOrder, PurchaseOrderItems, ConfirmationOrder, ConfirmationOrderItems, IntegrationPayload, Address } = initSchema(schema);

export {
  CabinetProduct,
  SalesOrder,
  SalesOrderItems,
  PurchaseOrder,
  PurchaseOrderItems,
  ConfirmationOrder,
  ConfirmationOrderItems,
  IntegrationPayload,
  CabinetType,
  AssemblyType,
  ProductType,
  ProductSubType,
  CabinetLine,
  FinishType,
  OverlayType,
  BoxConstructionType,
  OrderSource,
  OrderStatus,
  FulfillmentStatus,
  ShippingStatus,
  PaymentStatus,
  CurrencyCode,
  Vendors,
  Carriers,
  PayLoadType,
  Address
};