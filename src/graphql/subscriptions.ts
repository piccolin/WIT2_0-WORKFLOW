/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateCabinetProduct = /* GraphQL */ `subscription OnCreateCabinetProduct(
  $filter: ModelSubscriptionCabinetProductFilterInput
) {
  onCreateCabinetProduct(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCabinetProductSubscriptionVariables,
  APITypes.OnCreateCabinetProductSubscription
>;
export const onUpdateCabinetProduct = /* GraphQL */ `subscription OnUpdateCabinetProduct(
  $filter: ModelSubscriptionCabinetProductFilterInput
) {
  onUpdateCabinetProduct(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCabinetProductSubscriptionVariables,
  APITypes.OnUpdateCabinetProductSubscription
>;
export const onDeleteCabinetProduct = /* GraphQL */ `subscription OnDeleteCabinetProduct(
  $filter: ModelSubscriptionCabinetProductFilterInput
) {
  onDeleteCabinetProduct(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCabinetProductSubscriptionVariables,
  APITypes.OnDeleteCabinetProductSubscription
>;
export const onCreateSalesOrder = /* GraphQL */ `subscription OnCreateSalesOrder(
  $filter: ModelSubscriptionSalesOrderFilterInput
) {
  onCreateSalesOrder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSalesOrderSubscriptionVariables,
  APITypes.OnCreateSalesOrderSubscription
>;
export const onUpdateSalesOrder = /* GraphQL */ `subscription OnUpdateSalesOrder(
  $filter: ModelSubscriptionSalesOrderFilterInput
) {
  onUpdateSalesOrder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSalesOrderSubscriptionVariables,
  APITypes.OnUpdateSalesOrderSubscription
>;
export const onDeleteSalesOrder = /* GraphQL */ `subscription OnDeleteSalesOrder(
  $filter: ModelSubscriptionSalesOrderFilterInput
) {
  onDeleteSalesOrder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSalesOrderSubscriptionVariables,
  APITypes.OnDeleteSalesOrderSubscription
>;
export const onCreateSalesOrderItems = /* GraphQL */ `subscription OnCreateSalesOrderItems(
  $filter: ModelSubscriptionSalesOrderItemsFilterInput
) {
  onCreateSalesOrderItems(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSalesOrderItemsSubscriptionVariables,
  APITypes.OnCreateSalesOrderItemsSubscription
>;
export const onUpdateSalesOrderItems = /* GraphQL */ `subscription OnUpdateSalesOrderItems(
  $filter: ModelSubscriptionSalesOrderItemsFilterInput
) {
  onUpdateSalesOrderItems(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSalesOrderItemsSubscriptionVariables,
  APITypes.OnUpdateSalesOrderItemsSubscription
>;
export const onDeleteSalesOrderItems = /* GraphQL */ `subscription OnDeleteSalesOrderItems(
  $filter: ModelSubscriptionSalesOrderItemsFilterInput
) {
  onDeleteSalesOrderItems(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSalesOrderItemsSubscriptionVariables,
  APITypes.OnDeleteSalesOrderItemsSubscription
>;
export const onCreatePurchaseOrder = /* GraphQL */ `subscription OnCreatePurchaseOrder(
  $filter: ModelSubscriptionPurchaseOrderFilterInput
) {
  onCreatePurchaseOrder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePurchaseOrderSubscriptionVariables,
  APITypes.OnCreatePurchaseOrderSubscription
>;
export const onUpdatePurchaseOrder = /* GraphQL */ `subscription OnUpdatePurchaseOrder(
  $filter: ModelSubscriptionPurchaseOrderFilterInput
) {
  onUpdatePurchaseOrder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePurchaseOrderSubscriptionVariables,
  APITypes.OnUpdatePurchaseOrderSubscription
>;
export const onDeletePurchaseOrder = /* GraphQL */ `subscription OnDeletePurchaseOrder(
  $filter: ModelSubscriptionPurchaseOrderFilterInput
) {
  onDeletePurchaseOrder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePurchaseOrderSubscriptionVariables,
  APITypes.OnDeletePurchaseOrderSubscription
>;
export const onCreatePurchaseOrderItems = /* GraphQL */ `subscription OnCreatePurchaseOrderItems(
  $filter: ModelSubscriptionPurchaseOrderItemsFilterInput
) {
  onCreatePurchaseOrderItems(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePurchaseOrderItemsSubscriptionVariables,
  APITypes.OnCreatePurchaseOrderItemsSubscription
>;
export const onUpdatePurchaseOrderItems = /* GraphQL */ `subscription OnUpdatePurchaseOrderItems(
  $filter: ModelSubscriptionPurchaseOrderItemsFilterInput
) {
  onUpdatePurchaseOrderItems(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePurchaseOrderItemsSubscriptionVariables,
  APITypes.OnUpdatePurchaseOrderItemsSubscription
>;
export const onDeletePurchaseOrderItems = /* GraphQL */ `subscription OnDeletePurchaseOrderItems(
  $filter: ModelSubscriptionPurchaseOrderItemsFilterInput
) {
  onDeletePurchaseOrderItems(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePurchaseOrderItemsSubscriptionVariables,
  APITypes.OnDeletePurchaseOrderItemsSubscription
>;
export const onCreateConfirmationOrder = /* GraphQL */ `subscription OnCreateConfirmationOrder(
  $filter: ModelSubscriptionConfirmationOrderFilterInput
) {
  onCreateConfirmationOrder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateConfirmationOrderSubscriptionVariables,
  APITypes.OnCreateConfirmationOrderSubscription
>;
export const onUpdateConfirmationOrder = /* GraphQL */ `subscription OnUpdateConfirmationOrder(
  $filter: ModelSubscriptionConfirmationOrderFilterInput
) {
  onUpdateConfirmationOrder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateConfirmationOrderSubscriptionVariables,
  APITypes.OnUpdateConfirmationOrderSubscription
>;
export const onDeleteConfirmationOrder = /* GraphQL */ `subscription OnDeleteConfirmationOrder(
  $filter: ModelSubscriptionConfirmationOrderFilterInput
) {
  onDeleteConfirmationOrder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteConfirmationOrderSubscriptionVariables,
  APITypes.OnDeleteConfirmationOrderSubscription
>;
export const onCreateConfirmationOrderItems = /* GraphQL */ `subscription OnCreateConfirmationOrderItems(
  $filter: ModelSubscriptionConfirmationOrderItemsFilterInput
) {
  onCreateConfirmationOrderItems(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateConfirmationOrderItemsSubscriptionVariables,
  APITypes.OnCreateConfirmationOrderItemsSubscription
>;
export const onUpdateConfirmationOrderItems = /* GraphQL */ `subscription OnUpdateConfirmationOrderItems(
  $filter: ModelSubscriptionConfirmationOrderItemsFilterInput
) {
  onUpdateConfirmationOrderItems(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateConfirmationOrderItemsSubscriptionVariables,
  APITypes.OnUpdateConfirmationOrderItemsSubscription
>;
export const onDeleteConfirmationOrderItems = /* GraphQL */ `subscription OnDeleteConfirmationOrderItems(
  $filter: ModelSubscriptionConfirmationOrderItemsFilterInput
) {
  onDeleteConfirmationOrderItems(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteConfirmationOrderItemsSubscriptionVariables,
  APITypes.OnDeleteConfirmationOrderItemsSubscription
>;
export const onCreateIntegrationPayload = /* GraphQL */ `subscription OnCreateIntegrationPayload(
  $filter: ModelSubscriptionIntegrationPayloadFilterInput
) {
  onCreateIntegrationPayload(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateIntegrationPayloadSubscriptionVariables,
  APITypes.OnCreateIntegrationPayloadSubscription
>;
export const onUpdateIntegrationPayload = /* GraphQL */ `subscription OnUpdateIntegrationPayload(
  $filter: ModelSubscriptionIntegrationPayloadFilterInput
) {
  onUpdateIntegrationPayload(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateIntegrationPayloadSubscriptionVariables,
  APITypes.OnUpdateIntegrationPayloadSubscription
>;
export const onDeleteIntegrationPayload = /* GraphQL */ `subscription OnDeleteIntegrationPayload(
  $filter: ModelSubscriptionIntegrationPayloadFilterInput
) {
  onDeleteIntegrationPayload(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteIntegrationPayloadSubscriptionVariables,
  APITypes.OnDeleteIntegrationPayloadSubscription
>;
