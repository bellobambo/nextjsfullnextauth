"use server"

import prisma from "@/prisma";
import { User } from "@prisma/client";


export async function registerUser(user : Omit<User, 'id' | 'emailVerified' | 'image'>){

    const result = await prisma.user.create({
        data : user,
    })

}