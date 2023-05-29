const express = require("express");
const { graphqlHTTP } = require("express-graphql");
require("dotenv").config();
const cors = require("cors");

const schema = require("./schema/schema");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Listening on 4000");
});
