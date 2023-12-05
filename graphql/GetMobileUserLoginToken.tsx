import { gql } from "@apollo/client";

export const SENDMOBILETOKEN = gql`
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
