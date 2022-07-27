import { extendType, nonNull, objectType, stringArg } from "nexus";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import {JWT_SECRET} from "../utils/authentication";
import { prisma } from "@prisma/client";


export const AuthPayload = objectType({
    name:"AuthPayload",
    definition(t){
        t.nonNull.string("token");
        t.nonNull.field("user",{
            type:"User",
        });
    },
});

export const AuthMutation = extendType({
    type:"Mutation",
    definition(t){
        t.nonNull.field("registerUser",{
            type:"AuthPayload",
            args:{
                name:nonNull(stringArg()),
                email:nonNull(stringArg()),
                password:nonNull(stringArg())
            },
            async resolve(parent,args,context) {
                const {email,name} = args;

                const findUser = await context.prisma.user.findUnique({
                    where: { email: args.email },
                });

                if(findUser){
                    throw new Error("User already exists!");
                }

                const password = await bcrypt.hash(args.password,12);

                const user = await context.prisma.user.create({
                    data:{email,name,password},
                });

                const token =jwt.sign({userId:user.id},JWT_SECRET)

                if(user){
                    return{
                        token:token,
                        user:user
                    }
                }else{
                    throw new Error("User creation failed,try again");
                }

                
                
            }
        })

        t.nonNull.field("login",{
            type:"AuthPayload",
            args:{
                email:nonNull(stringArg()),
                password:nonNull(stringArg()),
            },

            async resolve(parent,args,context){
                const user = await context.prisma.user.findUnique({where:{email:args.email}})
                if(!user){
                    throw new Error("No such user with that email found");
                }

                const validPassword = await bcrypt.compare(
                    args.password,
                    user.password,
                )

                if(!validPassword){
                    throw new Error("Invalid password");
                }

                const token = jwt.sign({ userId: user.id }, JWT_SECRET);

                return {
                    token:token,
                    user:user
                }
            }
        })
    }
})