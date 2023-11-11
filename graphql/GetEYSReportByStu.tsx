import { gql } from "@apollo/client";

export const GET_EYE_REPORT = gql`
  query GetEYSReportByStu($stuId: ID!, $date: String!) {
    getEYSReportByStu(stuId: $stuId, date: $date) {
      _id
      date
      food {
        iconsrc
        iconname
        title
        qty
        description
      }
      activities {
        iconsrc
        iconname
        title
        qty
        description
      }
      atSchool {
        title
        description
      }
      parentsCheck {
        title
        description
      }
      parentsRequest
      nurseComment
      parentsComment
    }
  }
`;
