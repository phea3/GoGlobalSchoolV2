import { gql } from "@apollo/client";

export const GET_ACTIVE_ACADEMIC_YEAR = gql`
  query GetActiveAcademicYear {
    getActiveAcademicYear {
      _id
      academicYearName
      academicYearKhName
    }
  }
`;
