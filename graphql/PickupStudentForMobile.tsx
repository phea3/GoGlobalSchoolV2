import { gql } from "@apollo/client";

export const PICK_UPSTUDENT = gql`
  mutation PickingUpStudent($studentId: String!) {
    pickingUpStudent(studentId: $studentId) {
      status
      message
    }
  }
`;
