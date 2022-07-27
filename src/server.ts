import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import dotenv from 'dotenv'
import {context} from "./context";

dotenv.config()

export const server = new ApolloServer({
    schema,
    context,
});

const port = process.env.PORT;

server.listen({port}).then(({url})=>{
    console.log(`Server is running on ${url}`)
})