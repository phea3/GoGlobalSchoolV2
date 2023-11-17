import { gql } from "@apollo/client";

export const GET_TAKEMEALATTENDANCEMOBILEREPORT = gql`
  query GetTakeMealAttendanceMobileReport(
    $studentId: ID!
    $month: String!
    $year: String!
  ) {
    getTakeMealAttendanceMobileReport(
      studentId: $studentId
      month: $month
      year: $year
    ) {
      day
      status
    }
  }
`;
