"use server"

import prisma from "@/prisma";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { compileActivationTemplate, sendMail } from "../mail";
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

export const activateUser:ActivateUserFunc = async (jwtUserID) =>{
    const payload = verifyJWT(jwtUserID);
    const userId = payload?.id

    const user = await prisma.user.findUnique({
        where : {
            id : userId
        }
    })
    if(!user) return 'userNotExist';
    if(user.emailVerified) return 'alreadyActivated';

    const result = await prisma.user.update({
        where : {
            id : userId,
        },
        data : {
            emailVerified  : new Date()
        }
    });
    return 'success';
}