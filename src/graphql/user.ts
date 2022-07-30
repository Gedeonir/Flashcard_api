import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";

export const User = objectType({
    name:"User",
    definition(t){
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.list.nonNull.field("QuestionsAsked",{
            type:"Question",
            resolve(parent,args,context){
                return context.prisma.user.findUnique({where:{id:parent.id}}).questions();
            }
        })
    }
});

export const userQuery = extendType({
    type:"Query",
    definition(t){
        t.nonNull.list.nonNull.field("allUsers",{
            type:"User",
            resolve(parent,args,context){
                return context.prisma.user.findMany();
            }
        }),
        
        t.field("getOneUser",{
            type:"User",
            args:{
                id:nonNull(intArg())
            },

            async resolve(parent,args,context){
                const getUser = await context.prisma.user.findUnique({
                    where:{id:args.id}
                })

                if(!getUser){
                    throw new Error("No user with that ID")
                }

                return getUser
            }
        })
    }
})


export const userMutation = extendType({
    type:"Mutation",
definition(t){
    t.nonNull.field("updateUser",{
        type:"User",
        args:{
            id:nonNull(intArg()),
            name:nonNull(stringArg()),
            email:nonNull(stringArg())
        },

        async resolve(parent,args,context){
            const {userId} = context;

            if(!userId){
                throw new Error("You must login first")
            }

            const getUser = await context.prisma.user.findUnique({
                where:{id:args.id}
            })

            if(!getUser){
                throw new Error("No user with that ID")
            }

            const updatedUser = context.prisma.user.update({
                where:{id:args.id},
                data:{
                    ...args
                }
            })

            return updatedUser;
        }
    })

    t.nonNull.field("deleteUser",{
        type:"User",
        args:{
            id:nonNull(intArg()),
        },

        async resolve(parent,args,context){
            const {userId} = context;

            if(!userId){
                throw new Error("You must login first")
            }

            const getUser = await context.prisma.user.findUnique({
                where:{id:args.id}
            })

            if(!getUser){
                throw new Error("No user with that ID")
            }

            const deletedUser = context.prisma.user.delete({
                where:{id:args.id}
            })

            return deletedUser;
        }
    })
}

})