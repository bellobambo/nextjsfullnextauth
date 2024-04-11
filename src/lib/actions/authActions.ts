"use server"

import prisma from "@/prisma";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { compileActivationTemplate, compileResetPassTemplate, compileTemplate, sendMail } from "../mail";
import { signJWT, verifyJWT } from "../jwt";



export async function registerUser(user: Omit<User, 'id' | 'emailVerified' | 'image'>) {

    const result = await prisma.user.create({
        data: {
            ...user,
            password: await bcrypt.hash(user.password, 10),
        }
    });

    const jwtUserId = signJWT({
        id: result.id,
        email: result.email,
    })
    const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`

    const body = compileActivationTemplate(user.firstName, activationUrl)
    await sendMail({ to: user.email, subject: 'Activate Your Account', body })
    return result;

}

type ActivateUserFunc = (jwtUserId: string) => Promise<'userNotExist' | 'alreadyActivated' | 'success'>;

export const activateUser: ActivateUserFunc = async (jwtUserID) => {
    const payload = verifyJWT(jwtUserID);
    const userId = payload?.id

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) return 'userNotExist';
    if (user.emailVerified) return 'alreadyActivated';

    const result = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            emailVerified: new Date()
        }
    });
    return 'success';
}


export async function forgotPassword(email : string){
    const user = await prisma.user.findUnique({
        where : {
            email : email,
        },
    });

    if (!user) throw new Error('the User Does Not Exist');

const jwtUserId = signJWT({
    id : user.id,
})

const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/resetPass/${jwtUserId}`

const body = compileResetPassTemplate(user.firstName ,resetPassUrl)

const sendResult = await sendMail({
    to: user.email,
    subject: 'Reset Password',
    body: body
  });
return sendResult;  

}


type ResetPasswordFun = (jwtUserId: string, password: string) => Promise<"userNotExist" | "success">;




export const resetPassword : ResetPasswordFun = async (jwtUserId, password ) => {
    const payload = verifyJWT(jwtUserId);

    if(!payload) return "userNotExist" ;
    const userId = payload.id;
    const user = await prisma.user.findUnique({
        where : {
            id : userId,

        }
    })
    if(!user) return "userNotExist" ;

    const result = await prisma.user.update({
        where : {
            id : userId,
        },
        data : {
            password : await bcrypt.hash(password, 10),
        }
    })

    if(result) return "success"
    else throw new Error('Something went wrong')
}