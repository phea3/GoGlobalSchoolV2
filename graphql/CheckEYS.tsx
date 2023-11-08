import { gql } from "@apollo/client";

export const CHECK_IS_STUDENT_FOR_EYS = gql`
  query CheckIsStudentEYSReport($stuId: String!) {
    checkIsStudentEYSReport(stuId: $stuId)
  }
`;
