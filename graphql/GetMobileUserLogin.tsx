import { gql } from "@apollo/client";

export const GET_MOBILEUSERLOGIN = gql`
  query GetMobileUserLogin($token: String!) {
    getMobileUserLogin(token: $token) {
      _id
      firstName
      lastName
      englishName
      profileImg
    }
  }
`;
