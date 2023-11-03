import { gql } from "@apollo/client";

export const GET_LEAVE_FOR_MOBILE = gql`
  query GetLeaveForMobile(
    $studentId: String!
    $from: String!
    $to: String!
    $limit: Int!
  ) {
    getLeaveForMobile(
      studentId: $studentId
      from: $from
      to: $to
      limit: $limit
    ) {
      _id
      firstName
      lastName
      englishName
      profileImg
      requestType
      status
      from
      to
      reason
      requestAt
    }
  }
`;
