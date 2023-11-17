import { gql } from "@apollo/client";

export const GET_ACADEMICYEARFORSELECT = gql`
  query GetAcademicYearsForSelect {
    getAcademicYearsForSelect {
      _id
      academicYearTitle
      status
    }
  }
`;
