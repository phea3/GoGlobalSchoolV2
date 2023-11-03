import { gql } from "@apollo/client";

export const TRANKING_STUDENTINPICKUP = gql`
  query TrackingStudentInPickUp($studentId: String!) {
    trackingStudentInPickUp(studentId: $studentId)
  }
`;

export const CHECK_STUDENTINPICKUP = gql`
  query CheckIsStudentInPickUp($studentId: String!) {
    checkIsStudentInPickUp(studentId: $studentId)
  }
`;
