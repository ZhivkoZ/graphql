import express from 'express';
import expressGraphQL from 'express-graphql';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import schema from './graphql/GraphQLSchema';
import ValidationError from './graphql/validationError';

import dotenv from 'dotenv';
dotenv.config();

import jwt from 'express-jwt';

const auth = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
})

const app = express();

const PORT = process.env.PORT || "3003";
const db = process.env.MONGODB_URL;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false,
    autoIndex: true,
    useCreateIndex: true,
}

mongoose.connect(db, options).then(()=>{
    console.log("Connected to MongoDB");
}).catch(error => console.log(error));

app.use(
    '/graphql',
    cors(),
    auth,
    bodyParser.json(),
    expressGraphQL(req => {
        return {
            schema,
            context: {
                user: req.user
            },
            graphql: true,
            formatError: error => {
                if(error.originalError instanceof ValidationError) {
                    return {
                        message: error.message,
                        validationErrors: error.originalError && error.originalError.validationErrors,
                    }
                }
                return error
            }
        }
       
    })
)

app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`)
})