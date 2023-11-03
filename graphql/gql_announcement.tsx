import { gql } from "@apollo/client/core";

export const QUERY_ANNOUNCEMENT = gql`
  query GetAnnouncementsPagination(
    $page: Int!
    $limit: Int!
    $from: String
    $to: String
    $keyword: String
    $publish: Boolean!
  ) {
    getAnnouncementsPagination(
      page: $page
      limit: $limit
      from: $from
      to: $to
      keyword: $keyword
      publish: $publish
    ) {
      data {
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
      paginator {
        slNo
        prev
        next
        perPage
        totalPosts
        totalPages
        currentPage
        hasPrevPage
        hasNextPage
        totalDocs
      }
    }
  }
`;
