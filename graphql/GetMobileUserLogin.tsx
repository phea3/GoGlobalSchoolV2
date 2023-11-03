import { gql } from "@apollo/client";

export const GET_MOBILEUSERLOGIN = gql`
  query GetMobileUserLogin {
    getMobileUserLogin {
      _id
      firstName
      lastName
      englishName
      profileImg
    }
  }
`;
