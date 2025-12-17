/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getCabinetProduct = /* GraphQL */ `query GetCabinetProduct($id: ID!) {
  getCabinetProduct(id: $id) {
    id
    wSKU
    vSKU
    brand
    doorStyle
    cabinetType
    cabinetSubType
    productType
    productSubType
    retailPrice
    discountScalingOn
    discountScalingOff
    listPrice
    assemblyMarkupFactor
    assemblyFee
    costFactor
    unitCost
    doesVendorAssemble
    vendorAssemblyCost
    waverlyAssemblyCost
    height
    width
    weight
    line
    finish
    finishColor
    overlay
    boxConstruction
    doors
    drawers
    shelves
    species
    shippingClass
    fullHeight
    pantry
    oven
    corner
    blindCabinet
    flipUpDoor
    pullout
    sink
    numberOfSinks
    microwave
    microWaveDrawer
    range
    rangeDrawer
    desk
    lineDrawingImagePath
    doorStyleImagePath
    tags
    stockItem
    availableForPickup
    publish
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCabinetProductQueryVariables,
  APITypes.GetCabinetProductQuery
>;
export const listCabinetProducts = /* GraphQL */ `query ListCabinetProducts(
  $filter: ModelCabinetProductFilterInput
  $limit: Int
  $nextToken: String
) {
  listCabinetProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      wSKU
      vSKU
      brand
      doorStyle
      cabinetType
      cabinetSubType
      productType
      productSubType
      retailPrice
      discountScalingOn
      discountScalingOff
      listPrice
      assemblyMarkupFactor
      assemblyFee
      costFactor
      unitCost
      doesVendorAssemble
      vendorAssemblyCost
      waverlyAssemblyCost
      height
      width
      weight
      line
      finish
      finishColor
      overlay
      boxConstruction
      doors
      drawers
      shelves
      species
      shippingClass
      fullHeight
      pantry
      oven
      corner
      blindCabinet
      flipUpDoor
      pullout
      sink
      numberOfSinks
      microwave
      microWaveDrawer
      range
      rangeDrawer
      desk
      lineDrawingImagePath
      doorStyleImagePath
      tags
      stockItem
      availableForPickup
      publish
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCabinetProductsQueryVariables,
  APITypes.ListCabinetProductsQuery
>;
export const syncCabinetProducts = /* GraphQL */ `query SyncCabinetProducts(
  $filter: ModelCabinetProductFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncCabinetProducts(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      wSKU
      vSKU
      brand
      doorStyle
      cabinetType
      cabinetSubType
      productType
      productSubType
      retailPrice
      discountScalingOn
      discountScalingOff
      listPrice
      assemblyMarkupFactor
      assemblyFee
      costFactor
      unitCost
      doesVendorAssemble
      vendorAssemblyCost
      waverlyAssemblyCost
      height
      width
      weight
      line
      finish
      finishColor
      overlay
      boxConstruction
      doors
      drawers
      shelves
      species
      shippingClass
      fullHeight
      pantry
      oven
      corner
      blindCabinet
      flipUpDoor
      pullout
      sink
      numberOfSinks
      microwave
      microWaveDrawer
      range
      rangeDrawer
      desk
      lineDrawingImagePath
      doorStyleImagePath
      tags
      stockItem
      availableForPickup
      publish
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncCabinetProductsQueryVariables,
  APITypes.SyncCabinetProductsQuery
>;
export const getSalesOrder = /* GraphQL */ `query GetSalesOrder($id: ID!) {
  getSalesOrder(id: $id) {
    id
    name
    email
    phoneNumber
    source
    vendor
    vendorNumber
    doorStyles
    PurchaseOrderId
    customerRef
    salesRepRef
    transactionID
    transactionNumber
    transactionDate
    paymentStatus
    orderStatus
    fulfillmentStatus
    shippingStatus
    billing {
      contact
      line1
      line2
      city
      state
      postalCode
      __typename
    }
    shipping {
      contact
      line1
      line2
      city
      state
      postalCode
      __typename
    }
    dueDate
    shipDate
    estimatedDeliveryDate
    subtotal
    taxAmount
    shippingAmount
    discountAmount
    totalAmount
    paymentMethod
    paymentGateway
    currency
    shippingMethod
    trackingNumber
    trackingURL
    carrier
    notes
    customerNotes
    metadata
    items {
      nextToken
      startedAt
      __typename
    }
    payloads {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSalesOrderQueryVariables,
  APITypes.GetSalesOrderQuery
>;
export const listSalesOrders = /* GraphQL */ `query ListSalesOrders(
  $filter: ModelSalesOrderFilterInput
  $limit: Int
  $nextToken: String
) {
  listSalesOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      email
      phoneNumber
      source
      vendor
      vendorNumber
      doorStyles
      PurchaseOrderId
      customerRef
      salesRepRef
      transactionID
      transactionNumber
      transactionDate
      paymentStatus
      orderStatus
      fulfillmentStatus
      shippingStatus
      dueDate
      shipDate
      estimatedDeliveryDate
      subtotal
      taxAmount
      shippingAmount
      discountAmount
      totalAmount
      paymentMethod
      paymentGateway
      currency
      shippingMethod
      trackingNumber
      trackingURL
      carrier
      notes
      customerNotes
      metadata
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSalesOrdersQueryVariables,
  APITypes.ListSalesOrdersQuery
>;
export const syncSalesOrders = /* GraphQL */ `query SyncSalesOrders(
  $filter: ModelSalesOrderFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncSalesOrders(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      name
      email
      phoneNumber
      source
      vendor
      vendorNumber
      doorStyles
      PurchaseOrderId
      customerRef
      salesRepRef
      transactionID
      transactionNumber
      transactionDate
      paymentStatus
      orderStatus
      fulfillmentStatus
      shippingStatus
      dueDate
      shipDate
      estimatedDeliveryDate
      subtotal
      taxAmount
      shippingAmount
      discountAmount
      totalAmount
      paymentMethod
      paymentGateway
      currency
      shippingMethod
      trackingNumber
      trackingURL
      carrier
      notes
      customerNotes
      metadata
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncSalesOrdersQueryVariables,
  APITypes.SyncSalesOrdersQuery
>;
export const getSalesOrderItems = /* GraphQL */ `query GetSalesOrderItems($id: ID!) {
  getSalesOrderItems(id: $id) {
    id
    txnLineID
    PurchaseOrderId
    itemListID
    itemFullName
    description
    assembly
    quantity
    rate
    total
    invoiced
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    salesOrderItemsId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSalesOrderItemsQueryVariables,
  APITypes.GetSalesOrderItemsQuery
>;
export const listSalesOrderItems = /* GraphQL */ `query ListSalesOrderItems(
  $filter: ModelSalesOrderItemsFilterInput
  $limit: Int
  $nextToken: String
) {
  listSalesOrderItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      txnLineID
      PurchaseOrderId
      itemListID
      itemFullName
      description
      assembly
      quantity
      rate
      total
      invoiced
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      salesOrderItemsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSalesOrderItemsQueryVariables,
  APITypes.ListSalesOrderItemsQuery
>;
export const syncSalesOrderItems = /* GraphQL */ `query SyncSalesOrderItems(
  $filter: ModelSalesOrderItemsFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncSalesOrderItems(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      txnLineID
      PurchaseOrderId
      itemListID
      itemFullName
      description
      assembly
      quantity
      rate
      total
      invoiced
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      salesOrderItemsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncSalesOrderItemsQueryVariables,
  APITypes.SyncSalesOrderItemsQuery
>;
export const getPurchaseOrder = /* GraphQL */ `query GetPurchaseOrder($id: ID!) {
  getPurchaseOrder(id: $id) {
    id
    SalesOrderId
    vendor
    vendorAddress
    vendorNumber
    doorStyles
    orderStatus
    fulfillmentStatus
    shippingStatus
    shipping {
      contact
      line1
      line2
      city
      state
      postalCode
      __typename
    }
    dueDate
    shipDate
    estimatedDeliveryDate
    shippingMethod
    trackingNumber
    trackingURL
    carrier
    notes
    metadata
    items {
      nextToken
      startedAt
      __typename
    }
    payloads {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPurchaseOrderQueryVariables,
  APITypes.GetPurchaseOrderQuery
>;
export const listPurchaseOrders = /* GraphQL */ `query ListPurchaseOrders(
  $filter: ModelPurchaseOrderFilterInput
  $limit: Int
  $nextToken: String
) {
  listPurchaseOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      SalesOrderId
      vendor
      vendorAddress
      vendorNumber
      doorStyles
      orderStatus
      fulfillmentStatus
      shippingStatus
      dueDate
      shipDate
      estimatedDeliveryDate
      shippingMethod
      trackingNumber
      trackingURL
      carrier
      notes
      metadata
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPurchaseOrdersQueryVariables,
  APITypes.ListPurchaseOrdersQuery
>;
export const syncPurchaseOrders = /* GraphQL */ `query SyncPurchaseOrders(
  $filter: ModelPurchaseOrderFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncPurchaseOrders(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      SalesOrderId
      vendor
      vendorAddress
      vendorNumber
      doorStyles
      orderStatus
      fulfillmentStatus
      shippingStatus
      dueDate
      shipDate
      estimatedDeliveryDate
      shippingMethod
      trackingNumber
      trackingURL
      carrier
      notes
      metadata
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncPurchaseOrdersQueryVariables,
  APITypes.SyncPurchaseOrdersQuery
>;
export const getPurchaseOrderItems = /* GraphQL */ `query GetPurchaseOrderItems($id: ID!) {
  getPurchaseOrderItems(id: $id) {
    id
    customer
    itemListID
    itemFullName
    description
    assembly
    quantity
    rate
    total
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    purchaseOrderItemsId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPurchaseOrderItemsQueryVariables,
  APITypes.GetPurchaseOrderItemsQuery
>;
export const listPurchaseOrderItems = /* GraphQL */ `query ListPurchaseOrderItems(
  $filter: ModelPurchaseOrderItemsFilterInput
  $limit: Int
  $nextToken: String
) {
  listPurchaseOrderItems(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      customer
      itemListID
      itemFullName
      description
      assembly
      quantity
      rate
      total
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      purchaseOrderItemsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPurchaseOrderItemsQueryVariables,
  APITypes.ListPurchaseOrderItemsQuery
>;
export const syncPurchaseOrderItems = /* GraphQL */ `query SyncPurchaseOrderItems(
  $filter: ModelPurchaseOrderItemsFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncPurchaseOrderItems(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      customer
      itemListID
      itemFullName
      description
      assembly
      quantity
      rate
      total
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      purchaseOrderItemsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncPurchaseOrderItemsQueryVariables,
  APITypes.SyncPurchaseOrderItemsQuery
>;
export const getConfirmationOrder = /* GraphQL */ `query GetConfirmationOrder($id: ID!) {
  getConfirmationOrder(id: $id) {
    id
    PurchaseOrderId
    SalesOrderId
    vendor
    salesPerson
    quoteDate
    style
    billingContact
    billing {
      contact
      line1
      line2
      city
      state
      postalCode
      __typename
    }
    shippingContact
    shipping {
      contact
      line1
      line2
      city
      state
      postalCode
      __typename
    }
    shippingMethod
    trackingNumber
    carrier
    subtotal
    upgrades
    modifications
    taxAmount
    shippingAmount
    discountAmount
    totalAmount
    items {
      nextToken
      startedAt
      __typename
    }
    payloads {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetConfirmationOrderQueryVariables,
  APITypes.GetConfirmationOrderQuery
>;
export const listConfirmationOrders = /* GraphQL */ `query ListConfirmationOrders(
  $filter: ModelConfirmationOrderFilterInput
  $limit: Int
  $nextToken: String
) {
  listConfirmationOrders(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      PurchaseOrderId
      SalesOrderId
      vendor
      salesPerson
      quoteDate
      style
      billingContact
      shippingContact
      shippingMethod
      trackingNumber
      carrier
      subtotal
      upgrades
      modifications
      taxAmount
      shippingAmount
      discountAmount
      totalAmount
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConfirmationOrdersQueryVariables,
  APITypes.ListConfirmationOrdersQuery
>;
export const syncConfirmationOrders = /* GraphQL */ `query SyncConfirmationOrders(
  $filter: ModelConfirmationOrderFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncConfirmationOrders(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      PurchaseOrderId
      SalesOrderId
      vendor
      salesPerson
      quoteDate
      style
      billingContact
      shippingContact
      shippingMethod
      trackingNumber
      carrier
      subtotal
      upgrades
      modifications
      taxAmount
      shippingAmount
      discountAmount
      totalAmount
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncConfirmationOrdersQueryVariables,
  APITypes.SyncConfirmationOrdersQuery
>;
export const getConfirmationOrderItems = /* GraphQL */ `query GetConfirmationOrderItems($id: ID!) {
  getConfirmationOrderItems(id: $id) {
    id
    PurchaseOrderId
    itemFullName
    description
    quantity
    rate
    total
    estDeliveryDate
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    confirmationOrderItemsId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetConfirmationOrderItemsQueryVariables,
  APITypes.GetConfirmationOrderItemsQuery
>;
export const listConfirmationOrderItems = /* GraphQL */ `query ListConfirmationOrderItems(
  $filter: ModelConfirmationOrderItemsFilterInput
  $limit: Int
  $nextToken: String
) {
  listConfirmationOrderItems(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      PurchaseOrderId
      itemFullName
      description
      quantity
      rate
      total
      estDeliveryDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      confirmationOrderItemsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConfirmationOrderItemsQueryVariables,
  APITypes.ListConfirmationOrderItemsQuery
>;
export const syncConfirmationOrderItems = /* GraphQL */ `query SyncConfirmationOrderItems(
  $filter: ModelConfirmationOrderItemsFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncConfirmationOrderItems(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      PurchaseOrderId
      itemFullName
      description
      quantity
      rate
      total
      estDeliveryDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      confirmationOrderItemsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncConfirmationOrderItemsQueryVariables,
  APITypes.SyncConfirmationOrderItemsQuery
>;
export const getIntegrationPayload = /* GraphQL */ `query GetIntegrationPayload($id: ID!) {
  getIntegrationPayload(id: $id) {
    id
    type
    source
    externalId
    receivedAt
    payload
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    salesOrderPayloadsId
    purchaseOrderPayloadsId
    confirmationOrderPayloadsId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIntegrationPayloadQueryVariables,
  APITypes.GetIntegrationPayloadQuery
>;
export const listIntegrationPayloads = /* GraphQL */ `query ListIntegrationPayloads(
  $filter: ModelIntegrationPayloadFilterInput
  $limit: Int
  $nextToken: String
) {
  listIntegrationPayloads(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      type
      source
      externalId
      receivedAt
      payload
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      salesOrderPayloadsId
      purchaseOrderPayloadsId
      confirmationOrderPayloadsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIntegrationPayloadsQueryVariables,
  APITypes.ListIntegrationPayloadsQuery
>;
export const syncIntegrationPayloads = /* GraphQL */ `query SyncIntegrationPayloads(
  $filter: ModelIntegrationPayloadFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncIntegrationPayloads(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      type
      source
      externalId
      receivedAt
      payload
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      salesOrderPayloadsId
      purchaseOrderPayloadsId
      confirmationOrderPayloadsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncIntegrationPayloadsQueryVariables,
  APITypes.SyncIntegrationPayloadsQuery
>;
export const listCabinetProductBywSku = /* GraphQL */ `query ListCabinetProductBywSku(
  $wSKU: String!
  $sortDirection: ModelSortDirection
  $filter: ModelCabinetProductFilterInput
  $limit: Int
  $nextToken: String
) {
  listCabinetProductBywSku(
    wSKU: $wSKU
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      wSKU
      vSKU
      brand
      doorStyle
      cabinetType
      cabinetSubType
      productType
      productSubType
      retailPrice
      discountScalingOn
      discountScalingOff
      listPrice
      assemblyMarkupFactor
      assemblyFee
      costFactor
      unitCost
      doesVendorAssemble
      vendorAssemblyCost
      waverlyAssemblyCost
      height
      width
      weight
      line
      finish
      finishColor
      overlay
      boxConstruction
      doors
      drawers
      shelves
      species
      shippingClass
      fullHeight
      pantry
      oven
      corner
      blindCabinet
      flipUpDoor
      pullout
      sink
      numberOfSinks
      microwave
      microWaveDrawer
      range
      rangeDrawer
      desk
      lineDrawingImagePath
      doorStyleImagePath
      tags
      stockItem
      availableForPickup
      publish
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCabinetProductBywSkuQueryVariables,
  APITypes.ListCabinetProductBywSkuQuery
>;
export const listCabinetProductByvSku = /* GraphQL */ `query ListCabinetProductByvSku(
  $vSKU: String!
  $sortDirection: ModelSortDirection
  $filter: ModelCabinetProductFilterInput
  $limit: Int
  $nextToken: String
) {
  listCabinetProductByvSku(
    vSKU: $vSKU
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      wSKU
      vSKU
      brand
      doorStyle
      cabinetType
      cabinetSubType
      productType
      productSubType
      retailPrice
      discountScalingOn
      discountScalingOff
      listPrice
      assemblyMarkupFactor
      assemblyFee
      costFactor
      unitCost
      doesVendorAssemble
      vendorAssemblyCost
      waverlyAssemblyCost
      height
      width
      weight
      line
      finish
      finishColor
      overlay
      boxConstruction
      doors
      drawers
      shelves
      species
      shippingClass
      fullHeight
      pantry
      oven
      corner
      blindCabinet
      flipUpDoor
      pullout
      sink
      numberOfSinks
      microwave
      microWaveDrawer
      range
      rangeDrawer
      desk
      lineDrawingImagePath
      doorStyleImagePath
      tags
      stockItem
      availableForPickup
      publish
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCabinetProductByvSkuQueryVariables,
  APITypes.ListCabinetProductByvSkuQuery
>;
export const listCabinetProductByBrandAndDoorStyle = /* GraphQL */ `query ListCabinetProductByBrandAndDoorStyle(
  $brand: String!
  $doorStyle: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelCabinetProductFilterInput
  $limit: Int
  $nextToken: String
) {
  listCabinetProductByBrandAndDoorStyle(
    brand: $brand
    doorStyle: $doorStyle
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      wSKU
      vSKU
      brand
      doorStyle
      cabinetType
      cabinetSubType
      productType
      productSubType
      retailPrice
      discountScalingOn
      discountScalingOff
      listPrice
      assemblyMarkupFactor
      assemblyFee
      costFactor
      unitCost
      doesVendorAssemble
      vendorAssemblyCost
      waverlyAssemblyCost
      height
      width
      weight
      line
      finish
      finishColor
      overlay
      boxConstruction
      doors
      drawers
      shelves
      species
      shippingClass
      fullHeight
      pantry
      oven
      corner
      blindCabinet
      flipUpDoor
      pullout
      sink
      numberOfSinks
      microwave
      microWaveDrawer
      range
      rangeDrawer
      desk
      lineDrawingImagePath
      doorStyleImagePath
      tags
      stockItem
      availableForPickup
      publish
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCabinetProductByBrandAndDoorStyleQueryVariables,
  APITypes.ListCabinetProductByBrandAndDoorStyleQuery
>;
