import { gql } from "@apollo/client";

export const GET_ACADEMICYEAR_PAGINATION = gql`
  query GetAcademicCalendarPagination(
    $page: Int!
    $limit: Int!
    $lg: String!
    $academicYearId: ID!
    $keyword: String
  ) {
    getAcademicCalendarPagination(
      page: $page
      limit: $limit
      lg: $lg
      academicYearId: $academicYearId
      keyword: $keyword
    ) {
      data {
        _id
        title
        from
        to
        academicYearId
        academicYear
        lg
      }
    }
  }
`;
