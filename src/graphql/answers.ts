import { objectType,extendType, stringArg, nonNull, intArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Answer = objectType({
    name:"Answer",
    definition(t){
        t.nonNull.int("id"),
        t.nonNull.string("answer")
        t.field("question",{
            type:"Question",
            resolve(parent,args,context){
                return context.prisma.answers.findUnique({where:{id:parent.id}}).question()
            }
        })
    }
})

export const answerQuery = extendType({
    type:"Query",
    definition(t){
        t.nonNull.list.nonNull.field("allAnswers",{
            type:"Answer",
            resolve(parent,args,context){
                return context.prisma.answers.findMany()
            }
        })

        t.field("readAnswer",{
            type:"Answer",
            args:{
                id:nonNull(intArg())
            },
            async resolve(parent,args,context){
                const getAnswer = await context.prisma.answers.findUnique(
                    {where:{id:args.id}}
                )

                if (!getAnswer) {
                    throw new Error("No Answer with that ID found")
                }

                return getAnswer
            }
        })
    }
})


export const answerMutation = extendType({
    type:"Mutation",
    definition(t){
        t.nonNull.field("postAnswer",{
            type:"Answer",
            args:{
                id:nonNull(intArg()),
                answer:nonNull(stringArg())
            },
            async resolve(parent,args,context){
                const {answer} = args;
                const {userId} = context;

                if (!userId) {
                    throw new Error("You must login first")
                }

                const getQuestion = await context.prisma.questions.findUnique({where:{id:args.id}})

                if (!getQuestion) {
                    throw new Error("No question with that ID found")
                }

                const newAnswer = context.prisma.answers.create({
                    data:{
                        answer,
                        question:{connect:{id:args.id}}
                    }
                })

                return newAnswer
            }
        })


        t.field("updateAnswer",{
            type:"Answer",
            args:{
                id:nonNull(intArg()),
                answer:nonNull(stringArg())
            },

            async resolve(parent,args,context){
                const {userId} = context;

                if(!userId){
                    throw new Error("You must login first")
                }

                const answer = await context.prisma.answers.findUnique(
                    {where:{id:args.id}}
                )

                if (!answer) {
                    throw new Error("No answer with that ID found")
                }

                const updatedAnswer = context.prisma.answers.update({
                    where:{id:args.id},
                    data:{
                        ...args
                    }
                })

                return updatedAnswer
            }
        })

        t.field("deleteAnswer",{
            type:"Answer",
            args:{
                id:nonNull(intArg())
            },

            async resolve(parent,args,context){
                const {userId} = context

                if(!userId){
                    throw new Error("You must login first")
                }

                const answer = await context.prisma.answers.findUnique(
                    {where:{id:args.id}}
                )
                
                if (!answer) {
                    throw new Error("No answer with that ID found")
                }

                const deletedAnswer = context.prisma.answers.delete({where:{id:args.id}});

                return deletedAnswer
            }
        })
    }
})