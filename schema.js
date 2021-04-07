const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    user(id: Int!): User
  }
  type Mutation {
    login(email: String!, password: String!): AuthToken
    register(
      email: String!,
      password: String!,
      name: String!
    ): User
  }

  type User {
    id: Int
    name: String
    email: String
    createdAt: String
    updatedAt: String
  }
  type AuthToken {
    token: String
  }
`);
