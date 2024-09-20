// src/graphql/mutations.ts

import gql from 'graphql-tag'

// Mutation for creating a fixed asset
export const CREATE_FIXED_ASSET = gql`
  mutation CreateFixedAsset($data: CreateFixedAssetInput!) {
    createFixedAsset(data: $data) {
      id
      name
      accountId
      number
      type
      acquisitionType
      acquisitionDate
      acquisitionAmount
      vatAmount
      comments
    }
  }
`

// Mutation for updating a fixed asset
export const UPDATE_FIXED_ASSET = gql`
  mutation UpdateFixedAsset($data: UpdateFixedAssetInput!) {
    updateFixedAsset(data: $data) {
      id
      name
      accountId
      number
      type
      acquisitionType
      acquisitionDate
      acquisitionAmount
      vatAmount
      comments
    }
  }
`
