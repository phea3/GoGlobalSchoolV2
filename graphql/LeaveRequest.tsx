import { gql } from "@apollo/client";

export const LEAVE_REQUEST = gql`
  mutation LeaveRequest($input: LeaveInput!) {
    leaveRequest(input: $input) {
      status
      message
    }
  }
`;
