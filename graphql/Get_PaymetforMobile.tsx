import { gql } from "@apollo/client";

export const GET_PAYMENT_FOR_MOBILE = gql`
  query GetPaymetforMobile($limit: Int!) {
    getPaymetforMobile(limit: $limit) {
      date
      type
      period
      total
    }
  }
`;
