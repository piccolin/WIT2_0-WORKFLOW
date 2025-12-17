/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createCabinetProduct = /* GraphQL */ `mutation CreateCabinetProduct(
  $input: CreateCabinetProductInput!
  $condition: ModelCabinetProductConditionInput
) {
  createCabinetProduct(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateCabinetProductMutationVariables,
  APITypes.CreateCabinetProductMutation
>;
export const updateCabinetProduct = /* GraphQL */ `mutation UpdateCabinetProduct(
  $input: UpdateCabinetProductInput!
  $condition: ModelCabinetProductConditionInput
) {
  updateCabinetProduct(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateCabinetProductMutationVariables,
  APITypes.UpdateCabinetProductMutation
>;
export const deleteCabinetProduct = /* GraphQL */ `mutation DeleteCabinetProduct(
  $input: DeleteCabinetProductInput!
  $condition: ModelCabinetProductConditionInput
) {
  deleteCabinetProduct(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteCabinetProductMutationVariables,
  APITypes.DeleteCabinetProductMutation
>;
export const createSalesOrder = /* GraphQL */ `mutation CreateSalesOrder(
  $input: CreateSalesOrderInput!
  $condition: ModelSalesOrderConditionInput
) {
  createSalesOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateSalesOrderMutationVariables,
  APITypes.CreateSalesOrderMutation
>;
export const updateSalesOrder = /* GraphQL */ `mutation UpdateSalesOrder(
  $input: UpdateSalesOrderInput!
  $condition: ModelSalesOrderConditionInput
) {
  updateSalesOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateSalesOrderMutationVariables,
  APITypes.UpdateSalesOrderMutation
>;
export const deleteSalesOrder = /* GraphQL */ `mutation DeleteSalesOrder(
  $input: DeleteSalesOrderInput!
  $condition: ModelSalesOrderConditionInput
) {
  deleteSalesOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteSalesOrderMutationVariables,
  APITypes.DeleteSalesOrderMutation
>;
export const createSalesOrderItems = /* GraphQL */ `mutation CreateSalesOrderItems(
  $input: CreateSalesOrderItemsInput!
  $condition: ModelSalesOrderItemsConditionInput
) {
  createSalesOrderItems(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateSalesOrderItemsMutationVariables,
  APITypes.CreateSalesOrderItemsMutation
>;
export const updateSalesOrderItems = /* GraphQL */ `mutation UpdateSalesOrderItems(
  $input: UpdateSalesOrderItemsInput!
  $condition: ModelSalesOrderItemsConditionInput
) {
  updateSalesOrderItems(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateSalesOrderItemsMutationVariables,
  APITypes.UpdateSalesOrderItemsMutation
>;
export const deleteSalesOrderItems = /* GraphQL */ `mutation DeleteSalesOrderItems(
  $input: DeleteSalesOrderItemsInput!
  $condition: ModelSalesOrderItemsConditionInput
) {
  deleteSalesOrderItems(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteSalesOrderItemsMutationVariables,
  APITypes.DeleteSalesOrderItemsMutation
>;
export const createPurchaseOrder = /* GraphQL */ `mutation CreatePurchaseOrder(
  $input: CreatePurchaseOrderInput!
  $condition: ModelPurchaseOrderConditionInput
) {
  createPurchaseOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePurchaseOrderMutationVariables,
  APITypes.CreatePurchaseOrderMutation
>;
export const updatePurchaseOrder = /* GraphQL */ `mutation UpdatePurchaseOrder(
  $input: UpdatePurchaseOrderInput!
  $condition: ModelPurchaseOrderConditionInput
) {
  updatePurchaseOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePurchaseOrderMutationVariables,
  APITypes.UpdatePurchaseOrderMutation
>;
export const deletePurchaseOrder = /* GraphQL */ `mutation DeletePurchaseOrder(
  $input: DeletePurchaseOrderInput!
  $condition: ModelPurchaseOrderConditionInput
) {
  deletePurchaseOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePurchaseOrderMutationVariables,
  APITypes.DeletePurchaseOrderMutation
>;
export const createPurchaseOrderItems = /* GraphQL */ `mutation CreatePurchaseOrderItems(
  $input: CreatePurchaseOrderItemsInput!
  $condition: ModelPurchaseOrderItemsConditionInput
) {
  createPurchaseOrderItems(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePurchaseOrderItemsMutationVariables,
  APITypes.CreatePurchaseOrderItemsMutation
>;
export const updatePurchaseOrderItems = /* GraphQL */ `mutation UpdatePurchaseOrderItems(
  $input: UpdatePurchaseOrderItemsInput!
  $condition: ModelPurchaseOrderItemsConditionInput
) {
  updatePurchaseOrderItems(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePurchaseOrderItemsMutationVariables,
  APITypes.UpdatePurchaseOrderItemsMutation
>;
export const deletePurchaseOrderItems = /* GraphQL */ `mutation DeletePurchaseOrderItems(
  $input: DeletePurchaseOrderItemsInput!
  $condition: ModelPurchaseOrderItemsConditionInput
) {
  deletePurchaseOrderItems(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePurchaseOrderItemsMutationVariables,
  APITypes.DeletePurchaseOrderItemsMutation
>;
export const createConfirmationOrder = /* GraphQL */ `mutation CreateConfirmationOrder(
  $input: CreateConfirmationOrderInput!
  $condition: ModelConfirmationOrderConditionInput
) {
  createConfirmationOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConfirmationOrderMutationVariables,
  APITypes.CreateConfirmationOrderMutation
>;
export const updateConfirmationOrder = /* GraphQL */ `mutation UpdateConfirmationOrder(
  $input: UpdateConfirmationOrderInput!
  $condition: ModelConfirmationOrderConditionInput
) {
  updateConfirmationOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConfirmationOrderMutationVariables,
  APITypes.UpdateConfirmationOrderMutation
>;
export const deleteConfirmationOrder = /* GraphQL */ `mutation DeleteConfirmationOrder(
  $input: DeleteConfirmationOrderInput!
  $condition: ModelConfirmationOrderConditionInput
) {
  deleteConfirmationOrder(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConfirmationOrderMutationVariables,
  APITypes.DeleteConfirmationOrderMutation
>;
export const createConfirmationOrderItems = /* GraphQL */ `mutation CreateConfirmationOrderItems(
  $input: CreateConfirmationOrderItemsInput!
  $condition: ModelConfirmationOrderItemsConditionInput
) {
  createConfirmationOrderItems(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConfirmationOrderItemsMutationVariables,
  APITypes.CreateConfirmationOrderItemsMutation
>;
export const updateConfirmationOrderItems = /* GraphQL */ `mutation UpdateConfirmationOrderItems(
  $input: UpdateConfirmationOrderItemsInput!
  $condition: ModelConfirmationOrderItemsConditionInput
) {
  updateConfirmationOrderItems(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConfirmationOrderItemsMutationVariables,
  APITypes.UpdateConfirmationOrderItemsMutation
>;
export const deleteConfirmationOrderItems = /* GraphQL */ `mutation DeleteConfirmationOrderItems(
  $input: DeleteConfirmationOrderItemsInput!
  $condition: ModelConfirmationOrderItemsConditionInput
) {
  deleteConfirmationOrderItems(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConfirmationOrderItemsMutationVariables,
  APITypes.DeleteConfirmationOrderItemsMutation
>;
export const createIntegrationPayload = /* GraphQL */ `mutation CreateIntegrationPayload(
  $input: CreateIntegrationPayloadInput!
  $condition: ModelIntegrationPayloadConditionInput
) {
  createIntegrationPayload(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateIntegrationPayloadMutationVariables,
  APITypes.CreateIntegrationPayloadMutation
>;
export const updateIntegrationPayload = /* GraphQL */ `mutation UpdateIntegrationPayload(
  $input: UpdateIntegrationPayloadInput!
  $condition: ModelIntegrationPayloadConditionInput
) {
  updateIntegrationPayload(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateIntegrationPayloadMutationVariables,
  APITypes.UpdateIntegrationPayloadMutation
>;
export const deleteIntegrationPayload = /* GraphQL */ `mutation DeleteIntegrationPayload(
  $input: DeleteIntegrationPayloadInput!
  $condition: ModelIntegrationPayloadConditionInput
) {
  deleteIntegrationPayload(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteIntegrationPayloadMutationVariables,
  APITypes.DeleteIntegrationPayloadMutation
>;
