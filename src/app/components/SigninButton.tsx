'use client'

import { Button } from '@nextui-org/react';
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const SigninButton = () => {
    const { data: session } = useSession();
    console.log({session})



    return (
        <div className='flex items-center gap-2'>
            {session && session.user ? (
                <>
                <Link href={'/profile'}>

                    <p>{`${session.user.firstName} , ${session.user.lastName}`}</p>

                </Link>
                    <Link className='text-sky-500 hover:text-sky-600 transition-colors' href={'/api/auth/signout'}>SignOut</Link>
                </>
            ) : (<>
            
            <Button onClick={()=>signIn()}>Sign In</Button>
            <Button as={Link} href={'/auth/signup'}>Sign up</Button>
            </>
            )}
        </div>
    );
};


export default SigninButton