import { gql } from "@apollo/client";

export const GET_ACADEMIC_YEAR = gql`
  query GetAcademicYear {
    getAcademicYear {
      academicYear
      _id
    }
  }
`;
