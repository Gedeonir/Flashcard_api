import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import { schema } from "./schema";
import dotenv from 'dotenv'
import {context} from "./context";

dotenv.config()

export const server = new ApolloServer({
    schema,
    context,
    introspection: true,                                      // 1
    plugins: [ApolloServerPluginLandingPageLocalDefault()],   // 2
});

const port = process.env.PORT||5000;

server.listen({port}).then(({url})=>{
    console.log(`Server is running on ${url}`)
})