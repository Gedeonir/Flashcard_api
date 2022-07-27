import { objectType,extendType, stringArg, nonNull, intArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Question = objectType({
    name:"Question",
    definition(t){
        t.nonNull.int("id");
        t.nonNull.string("question"),
        t.nonNull.string("correctAnswer")
        t.nonNull.string("weight"),
        t.field("postedBy",{
            type:"User",
            resolve(parent,args,context){
                return context.prisma.questions.findUnique({where:{id:parent.id}}).postedBy()
            }
        })
        t.nonNull.list.nonNull.field("answers",{
            type:"Answer",
            resolve(parent,args,context){
                return context.prisma.questions.findUnique({where:{id:parent.id}}).answers();
            }
        })
    }
});

export const questionQuery = extendType({
    type:"Query",
    definition(t){
        t.nonNull.list.nonNull.field("allQuestions",{
            type:"Question",
            resolve(parent,args,context){
                return context.prisma.questions.findMany();
            }
        })

        t.field("getSingleQuestion",{
            type:"Question",
            args:{
                id:nonNull(intArg())
            },
            async resolve(parent,args,context){
                const getQuestion =  await context.prisma.questions.findUnique({where:{id:args.id}})

                if(!getQuestion){
                    throw new Error("No question with that ID found")
                }

                return getQuestion;
            }
        })
    }
})

export const questionMutation = extendType({
    type:"Mutation",
    definition(t){
        t.nonNull.field("postQuestion",{
            type:"Question",
            args:{
                question:nonNull(stringArg()),
                correctAnswer:nonNull(stringArg()),
                weight:nonNull(stringArg())
            },

            resolve(parent,args,context){
                const {question,correctAnswer,weight} = args;
                const {userId} = context;

                if(!userId){
                    throw new Error("You must login first")
                }

                const newQuestion = context.prisma.questions.create({
                    data:{
                        question,
                        correctAnswer,
                        weight,
                        postedBy:{connect:{id:userId}}
                    }
                })

                return newQuestion;
            }
        })

        t.field("updateQuestion",{
            type:"Question",
            args:{
                id:nonNull(intArg()),
                question:nonNull(stringArg()),
                correctAnswer:nonNull(stringArg()),
                weight:nonNull(stringArg())
            },

            async resolve(parent,args,context){
                const {userId} = context;

                if(!userId){
                    throw new Error("You must login first")
                }

                const question1 =  await context.prisma.questions.findUnique({where:{id:args.id}})

                if(!question1){
                    throw new Error("No question with that ID found")
                }

                const updatedQuestion = context.prisma.questions.update({where:{id:args.id}, 
                data:{
                    ...args
                }})

                return updatedQuestion;
            }
        })

        t.field("deleteQuestion",{
            type:"Question",
            args:{id:nonNull(intArg())},
            
            async resolve(parent,args,context){
                const {userId} = context;

                if(!userId){
                    throw new Error("You must login first")
                }

                const question2 = await context.prisma.questions.findUnique({
                    where:{id:args.id}
                });

                if(!question2){
                    throw new Error("No question with that ID found")
                }

                const deletedQuestion = context.prisma.questions.delete({where:{id:args.id}});

                return deletedQuestion
            }
        })
    }
}) 

