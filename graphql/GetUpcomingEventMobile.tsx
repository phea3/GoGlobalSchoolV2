import { gql } from "@apollo/client";

export const GET_UPCOMINGEVENT = gql`
  query GetUpcomingEventMobile {
    getUpcomingEventMobile {
      _id
      title
      from
      to
      academicYearId
      academicYear
      lg
    }
  }
`;
