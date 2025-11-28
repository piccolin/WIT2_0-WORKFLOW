/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../app/API.service";
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
    discount
    costFactor
    assemblyFee
    assemblyCost
    retailPrice
    discountPrice
    discountFactor
    name
    height
    width
    weight
    doors
    drawers
    shelves
    species
    shippingClass
    imagePath
    categories
    tags
    publish
    createdAt
    updatedAt
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
    discount
    costFactor
    assemblyFee
    assemblyCost
    retailPrice
    discountPrice
    discountFactor
    name
    height
    width
    weight
    doors
    drawers
    shelves
    species
    shippingClass
    imagePath
    categories
    tags
    publish
    createdAt
    updatedAt
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
    discount
    costFactor
    assemblyFee
    assemblyCost
    retailPrice
    discountPrice
    discountFactor
    name
    height
    width
    weight
    doors
    drawers
    shelves
    species
    shippingClass
    imagePath
    categories
    tags
    publish
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCabinetProductSubscriptionVariables,
  APITypes.OnDeleteCabinetProductSubscription
>;
