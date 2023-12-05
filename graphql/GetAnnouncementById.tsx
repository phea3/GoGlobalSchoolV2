import { gql } from "@apollo/client";

export const GETANNOUNCEMENTBYID = gql`
  query GetAnnouncementById($id: String!) {
    getAnnouncementById(_id: $id) {
      _id
      coverSrc
      title
      date
      description
      publish
      publishBy {
        profileImg
        publishName
      }
      referenceFiles
    }
  }
`;
