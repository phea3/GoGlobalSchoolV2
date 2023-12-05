import { gql } from "@apollo/client";

export const GETNOTIFICATIONS = gql`
query GetNotifications($userId: ID!, $limit: Int!, $type: String!) {
    getNotifications(user_id: $userId, limit: $limit, type: $type) {
      _id
      notifBy {
        image
        name
        id
      }
      type
      navigetId
      title
      body
      viewers
      createdAt
    }
  }
`;
