/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../app/API.service";
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
` as GeneratedMutation<
  APITypes.DeleteCabinetProductMutationVariables,
  APITypes.DeleteCabinetProductMutation
>;
