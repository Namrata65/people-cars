const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

let people = [
  { id: '1', firstName: 'Bill', lastName: 'Gates' },
  { id: '2', firstName: 'Steve', lastName: 'Jobs' },
  { id: '3', firstName: 'Linux', lastName: 'Torvalds' }
];

let cars = [
  { id: '1', year: '2019', make: 'Toyota', model: 'Corolla', price: '40000', personId: '1' },
  { id: '2', year: '2018', make: 'Lexus', model: 'LX 600', price: '13000', personId: '1' },
  { id: '3', year: '2017', make: 'Honda', model: 'Civic', price: '20000', personId: '1' },
  { id: '4', year: '2019', make: 'Acura', model: 'MDX', price: '60000', personId: '2' },
  { id: '5', year: '2018', make: 'Ford', model: 'Focus', price: '35000', personId: '2' },
  { id: '6', year: '2017', make: 'Honda', model: 'Pilot', price: '45000', personId: '2' },
  { id: '7', year: '2019', make: 'Volkswagen', model: 'Golf', price: '40000', personId: '3' },
  { id: '8', year: '2018', make: 'Kia', model: 'Sorento', price: '45000', personId: '3' },
  { id: '9', year: '2017', make: 'Volvo', model: 'XC40', price: '55000', personId: '3' }
];

const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }

  type Query {
    people: [Person]
    person(id: ID!): Person
    cars: [Car]
    car(id: ID!): Car
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: ID!, firstName: String, lastName: String): Person
    deletePerson(id: ID!): String

    addCar(year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    updateCar(id: ID!, year: Int, make: String, model: String, price: Float, personId: ID): Car
    deleteCar(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    people: () => people,
    person: (_, { id }) => people.find(p => p.id === id),
    cars: () => cars,
    car: (_, { id }) => cars.find(c => c.id === id),
  },
  Mutation: {
    addPerson: (_, { firstName, lastName }) => {
      const newId = (parseInt(people[people.length - 1].id) + 1).toString();
      const newPerson = { id: newId, firstName, lastName };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (_, { id, firstName, lastName }) => {
      const person = people.find(p => p.id === id);
      if (person) {
        if (firstName) person.firstName = firstName;
        if (lastName) person.lastName = lastName;
      }
      return person;
    },
    deletePerson: (_, { id }) => {
      people = people.filter(p => p.id !== id);
      cars = cars.filter(c => c.personId !== id);
      return `Person with ID ${id} deleted`;
    },
    addCar: (_, { year, make, model, price, personId }) => {
      console.log('add car', year, make, model, price, personId);
      const newId = (parseInt(cars[cars.length - 1].id) + 1).toString();
      const newCar = { id: newId, year, make, model, price, personId };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (_, { id, year, make, model, price, personId }) => {
      const car = cars.find(c => c.id === id);
      if (car) {
        if (year) car.year = year;
        if (make) car.make = make;
        if (model) car.model = model;
        if (price) car.price = price;
        if (personId) car.personId = personId;
      }
      return car;
    },
    deleteCar: (_, { id }) => {
      cars = cars.filter(c => c.id !== id);
      return `Car with ID ${id} deleted`;
    }
  },
  Person: {
    cars: (parent) => cars.filter(car => car.personId === parent.id),
  }
};

const app = express();
app.use(cors());

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(4000, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
});
