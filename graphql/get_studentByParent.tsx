import { gql } from "@apollo/client";

export const GET_STUDENT = gql`
  query GetStudentByParentsMobile($parentsId: ID!) {
    getStudentByParentsMobile(parentsId: $parentsId) {
      _id
      firstName
      lastName
      englishName
      profileImg
    }
  }
`;
