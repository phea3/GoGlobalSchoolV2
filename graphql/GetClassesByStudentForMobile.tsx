import { gql } from "@apollo/client";

export const GET_CLASSESBYSTUDENTFORMOBILE = gql`
  query GetClassesByStudentForMobile($studentId: ID!, $academicYearId: ID!) {
    getClassesByStudentForMobile(
      studentId: $studentId
      academicYearId: $academicYearId
    ) {
      _id
      classesId
      classesName
      programmeId
      programmeName
    }
  }
`;
