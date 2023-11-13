import { gql } from "@apollo/client";

export const PARENTS_CHECKSTUDENTSEYS = gql`
  mutation ParentsCheckStudentsEYS(
    $date: Date!
    $stuId: ID!
    $input: EYSParentCheckInput!
  ) {
    parentsCheckStudentsEYS(date: $date, stuId: $stuId, input: $input) {
      status
      message
    }
  }
`;
