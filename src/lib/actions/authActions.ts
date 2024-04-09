"use server"

import prisma from "@/prisma";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { compileActivationTemplate, sendMail } from "../mail";
import { signJWT } from "../jwt";



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