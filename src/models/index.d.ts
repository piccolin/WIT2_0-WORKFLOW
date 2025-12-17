import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";

export enum CabinetType {
  WALL = "WALL",
  BASE = "BASE",
  TALL = "TALL",
  VANITY = "VANITY",
  SAMPLE_DOOR = "SAMPLE_DOOR",
  SAMPLE_FRONT = "SAMPLE_FRONT"
}

export enum AssemblyType {
  RTA = "RTA",
  ASSEMBLED = "ASSEMBLED"
}

export enum ProductType {
  CABINET = "CABINET",
  FILLER = "FILLER",
  MOULDING = "MOULDING",
  PANEL = "PANEL",
  EDGE_BANDING = "EDGE_BANDING",
  WALL_HANGING_KIT = "WALL_HANGING_KIT",
  FLOATING_WALL_SHELF = "FLOATING_WALL_SHELF",
  STORAGE_ACCESSORY = "STORAGE_ACCESSORY",
  TOUCHUP_KIT = "TOUCHUP_KIT"
}

export enum ProductSubType {
  PULLOUT_ORGANIZER = "PULLOUT_ORGANIZER",
  TRASH = "TRASH",
  SINK_TILT_OUT = "SINK_TILT_OUT",
  INSIDE_DRAWER = "INSIDE_DRAWER",
  INSIDE_DOOR = "INSIDE_DOOR",
  PAINT = "PAINT",
  STAIN = "STAIN"
}

export enum CabinetLine {
  ENTRY = "ENTRY",
  PREMIUM = "PREMIUM",
  CUSTOM = "CUSTOM"
}

export enum FinishType {
  PAINTED = "PAINTED",
  STAINED = "STAINED",
  THERMOFOIL = "THERMOFOIL"
}

export enum OverlayType {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
  INSET = "INSET"
}

export enum BoxConstructionType {
  FRAMED = "FRAMED",
  FRAMELESS = "FRAMELESS"
}

export enum OrderSource {
  WOOCOMMERCE = "WOOCOMMERCE",
  PROKITCHEN = "PROKITCHEN",
  MANUAL_ENTRY = "MANUAL_ENTRY"
}

export enum OrderStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CONFIRMED = "CONFIRMED",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED"
}

export enum FulfillmentStatus {
  UNFULFILLED = "UNFULFILLED",
  PARTIAL = "PARTIAL",
  FULFILLED = "FULFILLED",
  BACKORDERED = "BACKORDERED"
}

export enum ShippingStatus {
  NOT_SHIPPED = "NOT_SHIPPED",
  PARTIAL = "PARTIAL",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED"
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  VOIDED = "VOIDED"
}

export enum CurrencyCode {
  USD = "USD",
  CAD = "CAD",
  EUR = "EUR",
  GBP = "GBP"
}

export enum Vendors {
  CUBITAC = "Cubitac",
  FOREVER_MARK = "ForeverMark",
  GHI = "GHI",
  US = "US",
  CABINET = "Cabinet",
  WOLF = "Wolf",
  TSG = "TSG",
  MATRIX = "Matrix",
  CABINETS = "Cabinets",
  HORNINGS = "Hornings",
  SUPPLY = "Supply"
}

export enum Carriers {
  FED_EX = "FedEx",
  UPS = "UPS",
  USPS = "USPS"
}

export enum PayLoadType {
  SALES = "SALES",
  PURCHASE = "PURCHASE",
  CONFRINATION = "CONFRINATION"
}

type EagerAddress = {
  readonly contact?: string | null;
  readonly line1?: string | null;
  readonly line2?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly postalCode?: string | null;
}

type LazyAddress = {
  readonly contact?: string | null;
  readonly line1?: string | null;
  readonly line2?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly postalCode?: string | null;
}

export declare type Address = LazyLoading extends LazyLoadingDisabled ? EagerAddress : LazyAddress

export declare const Address: (new (init: ModelInit<Address>) => Address)

type EagerCabinetProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CabinetProduct, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly wSKU: string;
  readonly vSKU: string;
  readonly brand: string;
  readonly doorStyle: string;
  readonly cabinetType: CabinetType | keyof typeof CabinetType;
  readonly cabinetSubType?: AssemblyType | keyof typeof AssemblyType | null;
  readonly productType: ProductType | keyof typeof ProductType;
  readonly productSubType?: ProductSubType | keyof typeof ProductSubType | null;
  readonly retailPrice?: number | null;
  readonly discountScalingOn?: number | null;
  readonly discountScalingOff?: number | null;
  readonly listPrice?: number | null;
  readonly assemblyMarkupFactor?: number | null;
  readonly assemblyFee?: number | null;
  readonly costFactor?: number | null;
  readonly unitCost?: number | null;
  readonly doesVendorAssemble?: boolean | null;
  readonly vendorAssemblyCost?: number | null;
  readonly waverlyAssemblyCost?: number | null;
  readonly height?: number | null;
  readonly width?: number | null;
  readonly weight?: number | null;
  readonly line?: CabinetLine | keyof typeof CabinetLine | null;
  readonly finish?: FinishType | keyof typeof FinishType | null;
  readonly finishColor?: string | null;
  readonly overlay?: OverlayType | keyof typeof OverlayType | null;
  readonly boxConstruction?: BoxConstructionType | keyof typeof BoxConstructionType | null;
  readonly doors?: string | null;
  readonly drawers?: string | null;
  readonly shelves?: string | null;
  readonly species?: string | null;
  readonly shippingClass?: AssemblyType | keyof typeof AssemblyType | null;
  readonly fullHeight?: boolean | null;
  readonly pantry?: boolean | null;
  readonly oven?: boolean | null;
  readonly corner?: boolean | null;
  readonly blindCabinet?: boolean | null;
  readonly flipUpDoor?: boolean | null;
  readonly pullout?: boolean | null;
  readonly sink?: boolean | null;
  readonly numberOfSinks?: number | null;
  readonly microwave?: boolean | null;
  readonly microWaveDrawer?: boolean | null;
  readonly range?: boolean | null;
  readonly rangeDrawer?: boolean | null;
  readonly desk?: boolean | null;
  readonly lineDrawingImagePath?: string | null;
  readonly doorStyleImagePath?: string | null;
  readonly tags?: string | null;
  readonly stockItem?: boolean | null;
  readonly availableForPickup?: boolean | null;
  readonly publish?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCabinetProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CabinetProduct, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly wSKU: string;
  readonly vSKU: string;
  readonly brand: string;
  readonly doorStyle: string;
  readonly cabinetType: CabinetType | keyof typeof CabinetType;
  readonly cabinetSubType?: AssemblyType | keyof typeof AssemblyType | null;
  readonly productType: ProductType | keyof typeof ProductType;
  readonly productSubType?: ProductSubType | keyof typeof ProductSubType | null;
  readonly retailPrice?: number | null;
  readonly discountScalingOn?: number | null;
  readonly discountScalingOff?: number | null;
  readonly listPrice?: number | null;
  readonly assemblyMarkupFactor?: number | null;
  readonly assemblyFee?: number | null;
  readonly costFactor?: number | null;
  readonly unitCost?: number | null;
  readonly doesVendorAssemble?: boolean | null;
  readonly vendorAssemblyCost?: number | null;
  readonly waverlyAssemblyCost?: number | null;
  readonly height?: number | null;
  readonly width?: number | null;
  readonly weight?: number | null;
  readonly line?: CabinetLine | keyof typeof CabinetLine | null;
  readonly finish?: FinishType | keyof typeof FinishType | null;
  readonly finishColor?: string | null;
  readonly overlay?: OverlayType | keyof typeof OverlayType | null;
  readonly boxConstruction?: BoxConstructionType | keyof typeof BoxConstructionType | null;
  readonly doors?: string | null;
  readonly drawers?: string | null;
  readonly shelves?: string | null;
  readonly species?: string | null;
  readonly shippingClass?: AssemblyType | keyof typeof AssemblyType | null;
  readonly fullHeight?: boolean | null;
  readonly pantry?: boolean | null;
  readonly oven?: boolean | null;
  readonly corner?: boolean | null;
  readonly blindCabinet?: boolean | null;
  readonly flipUpDoor?: boolean | null;
  readonly pullout?: boolean | null;
  readonly sink?: boolean | null;
  readonly numberOfSinks?: number | null;
  readonly microwave?: boolean | null;
  readonly microWaveDrawer?: boolean | null;
  readonly range?: boolean | null;
  readonly rangeDrawer?: boolean | null;
  readonly desk?: boolean | null;
  readonly lineDrawingImagePath?: string | null;
  readonly doorStyleImagePath?: string | null;
  readonly tags?: string | null;
  readonly stockItem?: boolean | null;
  readonly availableForPickup?: boolean | null;
  readonly publish?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CabinetProduct = LazyLoading extends LazyLoadingDisabled ? EagerCabinetProduct : LazyCabinetProduct

export declare const CabinetProduct: (new (init: ModelInit<CabinetProduct>) => CabinetProduct) & {
  copyOf(source: CabinetProduct, mutator: (draft: MutableModel<CabinetProduct>) => MutableModel<CabinetProduct> | void): CabinetProduct;
}

type EagerSalesOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SalesOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phoneNumber?: string | null;
  readonly source?: OrderSource | keyof typeof OrderSource | null;
  readonly vendor?: string | null;
  readonly vendorNumber?: string | null;
  readonly doorStyles?: string | null;
  readonly PurchaseOrderId: string;
  readonly customerRef?: string | null;
  readonly salesRepRef?: string | null;
  readonly transactionID?: string | null;
  readonly transactionNumber?: string | null;
  readonly transactionDate?: string | null;
  readonly paymentStatus?: PaymentStatus | keyof typeof PaymentStatus | null;
  readonly orderStatus?: OrderStatus | keyof typeof OrderStatus | null;
  readonly fulfillmentStatus?: FulfillmentStatus | keyof typeof FulfillmentStatus | null;
  readonly shippingStatus?: ShippingStatus | keyof typeof ShippingStatus | null;
  readonly billing?: Address | null;
  readonly shipping?: Address | null;
  readonly dueDate?: string | null;
  readonly shipDate?: string | null;
  readonly estimatedDeliveryDate?: string | null;
  readonly subtotal?: number | null;
  readonly taxAmount?: number | null;
  readonly shippingAmount?: number | null;
  readonly discountAmount?: number | null;
  readonly totalAmount?: number | null;
  readonly paymentMethod?: string | null;
  readonly paymentGateway?: string | null;
  readonly currency?: CurrencyCode | keyof typeof CurrencyCode | null;
  readonly shippingMethod?: string | null;
  readonly trackingNumber?: string | null;
  readonly trackingURL?: string | null;
  readonly carrier?: string | null;
  readonly notes?: string | null;
  readonly customerNotes?: string | null;
  readonly metadata?: string | null;
  readonly items?: (SalesOrderItems | null)[] | null;
  readonly payloads?: (IntegrationPayload | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySalesOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SalesOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phoneNumber?: string | null;
  readonly source?: OrderSource | keyof typeof OrderSource | null;
  readonly vendor?: string | null;
  readonly vendorNumber?: string | null;
  readonly doorStyles?: string | null;
  readonly PurchaseOrderId: string;
  readonly customerRef?: string | null;
  readonly salesRepRef?: string | null;
  readonly transactionID?: string | null;
  readonly transactionNumber?: string | null;
  readonly transactionDate?: string | null;
  readonly paymentStatus?: PaymentStatus | keyof typeof PaymentStatus | null;
  readonly orderStatus?: OrderStatus | keyof typeof OrderStatus | null;
  readonly fulfillmentStatus?: FulfillmentStatus | keyof typeof FulfillmentStatus | null;
  readonly shippingStatus?: ShippingStatus | keyof typeof ShippingStatus | null;
  readonly billing?: Address | null;
  readonly shipping?: Address | null;
  readonly dueDate?: string | null;
  readonly shipDate?: string | null;
  readonly estimatedDeliveryDate?: string | null;
  readonly subtotal?: number | null;
  readonly taxAmount?: number | null;
  readonly shippingAmount?: number | null;
  readonly discountAmount?: number | null;
  readonly totalAmount?: number | null;
  readonly paymentMethod?: string | null;
  readonly paymentGateway?: string | null;
  readonly currency?: CurrencyCode | keyof typeof CurrencyCode | null;
  readonly shippingMethod?: string | null;
  readonly trackingNumber?: string | null;
  readonly trackingURL?: string | null;
  readonly carrier?: string | null;
  readonly notes?: string | null;
  readonly customerNotes?: string | null;
  readonly metadata?: string | null;
  readonly items: AsyncCollection<SalesOrderItems>;
  readonly payloads: AsyncCollection<IntegrationPayload>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type SalesOrder = LazyLoading extends LazyLoadingDisabled ? EagerSalesOrder : LazySalesOrder

export declare const SalesOrder: (new (init: ModelInit<SalesOrder>) => SalesOrder) & {
  copyOf(source: SalesOrder, mutator: (draft: MutableModel<SalesOrder>) => MutableModel<SalesOrder> | void): SalesOrder;
}

type EagerSalesOrderItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SalesOrderItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly txnLineID?: string | null;
  readonly PurchaseOrderId?: string | null;
  readonly itemListID?: string | null;
  readonly itemFullName?: string | null;
  readonly description?: string | null;
  readonly assembly?: string | null;
  readonly quantity?: number | null;
  readonly rate?: number | null;
  readonly total?: number | null;
  readonly invoiced?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly salesOrderItemsId?: string | null;
}

type LazySalesOrderItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SalesOrderItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly txnLineID?: string | null;
  readonly PurchaseOrderId?: string | null;
  readonly itemListID?: string | null;
  readonly itemFullName?: string | null;
  readonly description?: string | null;
  readonly assembly?: string | null;
  readonly quantity?: number | null;
  readonly rate?: number | null;
  readonly total?: number | null;
  readonly invoiced?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly salesOrderItemsId?: string | null;
}

export declare type SalesOrderItems = LazyLoading extends LazyLoadingDisabled ? EagerSalesOrderItems : LazySalesOrderItems

export declare const SalesOrderItems: (new (init: ModelInit<SalesOrderItems>) => SalesOrderItems) & {
  copyOf(source: SalesOrderItems, mutator: (draft: MutableModel<SalesOrderItems>) => MutableModel<SalesOrderItems> | void): SalesOrderItems;
}

type EagerPurchaseOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly SalesOrderId: string;
  readonly vendor?: string | null;
  readonly vendorAddress?: string | null;
  readonly vendorNumber?: string | null;
  readonly doorStyles?: string | null;
  readonly orderStatus?: OrderStatus | keyof typeof OrderStatus | null;
  readonly fulfillmentStatus?: FulfillmentStatus | keyof typeof FulfillmentStatus | null;
  readonly shippingStatus?: ShippingStatus | keyof typeof ShippingStatus | null;
  readonly shipping?: Address | null;
  readonly dueDate?: string | null;
  readonly shipDate?: string | null;
  readonly estimatedDeliveryDate?: string | null;
  readonly shippingMethod?: string | null;
  readonly trackingNumber?: string | null;
  readonly trackingURL?: string | null;
  readonly carrier?: string | null;
  readonly notes?: string | null;
  readonly metadata?: string | null;
  readonly items?: (PurchaseOrderItems | null)[] | null;
  readonly payloads?: (IntegrationPayload | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPurchaseOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly SalesOrderId: string;
  readonly vendor?: string | null;
  readonly vendorAddress?: string | null;
  readonly vendorNumber?: string | null;
  readonly doorStyles?: string | null;
  readonly orderStatus?: OrderStatus | keyof typeof OrderStatus | null;
  readonly fulfillmentStatus?: FulfillmentStatus | keyof typeof FulfillmentStatus | null;
  readonly shippingStatus?: ShippingStatus | keyof typeof ShippingStatus | null;
  readonly shipping?: Address | null;
  readonly dueDate?: string | null;
  readonly shipDate?: string | null;
  readonly estimatedDeliveryDate?: string | null;
  readonly shippingMethod?: string | null;
  readonly trackingNumber?: string | null;
  readonly trackingURL?: string | null;
  readonly carrier?: string | null;
  readonly notes?: string | null;
  readonly metadata?: string | null;
  readonly items: AsyncCollection<PurchaseOrderItems>;
  readonly payloads: AsyncCollection<IntegrationPayload>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PurchaseOrder = LazyLoading extends LazyLoadingDisabled ? EagerPurchaseOrder : LazyPurchaseOrder

export declare const PurchaseOrder: (new (init: ModelInit<PurchaseOrder>) => PurchaseOrder) & {
  copyOf(source: PurchaseOrder, mutator: (draft: MutableModel<PurchaseOrder>) => MutableModel<PurchaseOrder> | void): PurchaseOrder;
}

type EagerPurchaseOrderItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseOrderItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly customer?: string | null;
  readonly itemListID?: string | null;
  readonly itemFullName?: string | null;
  readonly description?: string | null;
  readonly assembly?: string | null;
  readonly quantity?: number | null;
  readonly rate?: number | null;
  readonly total?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly purchaseOrderItemsId?: string | null;
}

type LazyPurchaseOrderItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseOrderItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly customer?: string | null;
  readonly itemListID?: string | null;
  readonly itemFullName?: string | null;
  readonly description?: string | null;
  readonly assembly?: string | null;
  readonly quantity?: number | null;
  readonly rate?: number | null;
  readonly total?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly purchaseOrderItemsId?: string | null;
}

export declare type PurchaseOrderItems = LazyLoading extends LazyLoadingDisabled ? EagerPurchaseOrderItems : LazyPurchaseOrderItems

export declare const PurchaseOrderItems: (new (init: ModelInit<PurchaseOrderItems>) => PurchaseOrderItems) & {
  copyOf(source: PurchaseOrderItems, mutator: (draft: MutableModel<PurchaseOrderItems>) => MutableModel<PurchaseOrderItems> | void): PurchaseOrderItems;
}

type EagerConfirmationOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ConfirmationOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly PurchaseOrderId: string;
  readonly SalesOrderId: string;
  readonly vendor?: string | null;
  readonly salesPerson?: string | null;
  readonly quoteDate?: string | null;
  readonly style?: string | null;
  readonly billingContact?: string | null;
  readonly billing?: Address | null;
  readonly shippingContact?: string | null;
  readonly shipping?: Address | null;
  readonly shippingMethod?: string | null;
  readonly trackingNumber?: string | null;
  readonly carrier?: string | null;
  readonly subtotal?: number | null;
  readonly upgrades?: number | null;
  readonly modifications?: number | null;
  readonly taxAmount?: number | null;
  readonly shippingAmount?: number | null;
  readonly discountAmount?: number | null;
  readonly totalAmount?: number | null;
  readonly items?: (ConfirmationOrderItems | null)[] | null;
  readonly payloads?: (IntegrationPayload | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyConfirmationOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ConfirmationOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly PurchaseOrderId: string;
  readonly SalesOrderId: string;
  readonly vendor?: string | null;
  readonly salesPerson?: string | null;
  readonly quoteDate?: string | null;
  readonly style?: string | null;
  readonly billingContact?: string | null;
  readonly billing?: Address | null;
  readonly shippingContact?: string | null;
  readonly shipping?: Address | null;
  readonly shippingMethod?: string | null;
  readonly trackingNumber?: string | null;
  readonly carrier?: string | null;
  readonly subtotal?: number | null;
  readonly upgrades?: number | null;
  readonly modifications?: number | null;
  readonly taxAmount?: number | null;
  readonly shippingAmount?: number | null;
  readonly discountAmount?: number | null;
  readonly totalAmount?: number | null;
  readonly items: AsyncCollection<ConfirmationOrderItems>;
  readonly payloads: AsyncCollection<IntegrationPayload>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ConfirmationOrder = LazyLoading extends LazyLoadingDisabled ? EagerConfirmationOrder : LazyConfirmationOrder

export declare const ConfirmationOrder: (new (init: ModelInit<ConfirmationOrder>) => ConfirmationOrder) & {
  copyOf(source: ConfirmationOrder, mutator: (draft: MutableModel<ConfirmationOrder>) => MutableModel<ConfirmationOrder> | void): ConfirmationOrder;
}

type EagerConfirmationOrderItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ConfirmationOrderItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly PurchaseOrderId: string;
  readonly itemFullName?: string | null;
  readonly description?: string | null;
  readonly quantity?: number | null;
  readonly rate?: number | null;
  readonly total?: number | null;
  readonly estDeliveryDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly confirmationOrderItemsId?: string | null;
}

type LazyConfirmationOrderItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ConfirmationOrderItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly PurchaseOrderId: string;
  readonly itemFullName?: string | null;
  readonly description?: string | null;
  readonly quantity?: number | null;
  readonly rate?: number | null;
  readonly total?: number | null;
  readonly estDeliveryDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly confirmationOrderItemsId?: string | null;
}

export declare type ConfirmationOrderItems = LazyLoading extends LazyLoadingDisabled ? EagerConfirmationOrderItems : LazyConfirmationOrderItems

export declare const ConfirmationOrderItems: (new (init: ModelInit<ConfirmationOrderItems>) => ConfirmationOrderItems) & {
  copyOf(source: ConfirmationOrderItems, mutator: (draft: MutableModel<ConfirmationOrderItems>) => MutableModel<ConfirmationOrderItems> | void): ConfirmationOrderItems;
}

type EagerIntegrationPayload = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<IntegrationPayload, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly type?: PayLoadType | keyof typeof PayLoadType | null;
  readonly source?: OrderSource | keyof typeof OrderSource | null;
  readonly externalId?: string | null;
  readonly receivedAt?: string | null;
  readonly payload?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly salesOrderPayloadsId?: string | null;
  readonly purchaseOrderPayloadsId?: string | null;
  readonly confirmationOrderPayloadsId?: string | null;
}

type LazyIntegrationPayload = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<IntegrationPayload, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly type?: PayLoadType | keyof typeof PayLoadType | null;
  readonly source?: OrderSource | keyof typeof OrderSource | null;
  readonly externalId?: string | null;
  readonly receivedAt?: string | null;
  readonly payload?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly salesOrderPayloadsId?: string | null;
  readonly purchaseOrderPayloadsId?: string | null;
  readonly confirmationOrderPayloadsId?: string | null;
}

export declare type IntegrationPayload = LazyLoading extends LazyLoadingDisabled ? EagerIntegrationPayload : LazyIntegrationPayload

export declare const IntegrationPayload: (new (init: ModelInit<IntegrationPayload>) => IntegrationPayload) & {
  copyOf(source: IntegrationPayload, mutator: (draft: MutableModel<IntegrationPayload>) => MutableModel<IntegrationPayload> | void): IntegrationPayload;
}