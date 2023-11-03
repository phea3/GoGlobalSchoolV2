import { gql } from "@apollo/client";

export const ATT_BY_STUDENT = gql`
  query GetAttendantsByStudent(
    $studentId: String!
    $from: String
    $to: String
    $limit: Int
    $academicYearId: ID
  ) {
    getAttendantsByStudent(
      studentId: $studentId
      from: $from
      to: $to
      limit: $limit
      academicYearId: $academicYearId
    ) {
      date
      className
      checkIn
      checkOut
      attendace
    }
  }
`;
