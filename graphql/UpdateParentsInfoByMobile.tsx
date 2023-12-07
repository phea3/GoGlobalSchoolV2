import { gql } from "@apollo/client";

export const UPDATE_IMAGE = gql`
  mutation UpdateParentsInfoByMobile($id: String!, $profileImg: String!) {
    updateParentsInfoByMobile(_id: $id, profileImg: $profileImg) {
      status
      message
    }
  }
`;
