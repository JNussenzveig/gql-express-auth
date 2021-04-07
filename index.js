const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const root = require('./resolvers');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP((req, res, graphqlParams) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: {
      token: req.headers.Authorization
    }
  })),
);

app.listen(process.env.PORT || 4000);
