/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../app/API.service";
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCabinetProductsQueryVariables,
  APITypes.ListCabinetProductsQuery
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
    nextToken
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
    nextToken
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCabinetProductByBrandAndDoorStyleQueryVariables,
  APITypes.ListCabinetProductByBrandAndDoorStyleQuery
>;
