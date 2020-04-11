import express from 'express';
import expressGraphQL from 'express-graphql';
import mongoosen from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import schema from './graphql/GraphQLSchema';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

const PORT = process.env.PORT || "3000";
const db = process.env.MONGODB_URL;

mongoosen.connect(db, {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
    console.log("Connected to MongoDB");
}).catch(error => console.log(error));

app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressGraphQL({
        schema,
        graphql: true
    })
)

app.listen(PORT, () => {
    console.log("Server running at ${PORT}")
})