import { gql } from "@apollo/client";

export const GET_USERPROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      _id
      firstName
      lastName
      englishName
      profileImg
      customerType
      permanentVillage
      permanentCommune
      permanentDistrict
      permanentProvince
      permanentCountry
      email
      tel
    }
  }
`;
