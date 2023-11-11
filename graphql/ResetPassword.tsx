import { gql } from "@apollo/client";

export const RESET_PASSWORD = gql`
  mutation ResetPasswordParentsMobileApp($id: ID!, $newPassword: String!) {
    resetPasswordParentsMobileApp(_id: $id, newPassword: $newPassword) {
      status
      message
    }
  }
`;
