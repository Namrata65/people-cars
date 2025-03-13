import { gql } from '@apollo/client';

export const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
    }
  }
`;

export const GET_CARS = gql`
  query GetCars {
    cars {
      id
      year
      make
      model
      price
      personId
    }
  }
`;
