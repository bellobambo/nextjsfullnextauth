'use client'

import { Button } from '@nextui-org/react';
import { useSession } from 'next-auth/react'
import Link from 'next/link';
import React from 'react'

const SigninButton = () => {
    const { data: session } = useSession();

    return (
        <div className='flex items-center gap-2'>
            {session && session.user ? (
                <>
                    <p>{`${session.user.firstName} , ${session.user.lastName}`}</p>
                    <Link className='text-sky-500 hover:text-sky-600 transition-colors' href={'/api/auth/signout'}>SignOut</Link>
                </>
            ) : (<>
            
            <Button as={Link} href={'/api/auth/signin'}>Sign In</Button>
            <Button as={Link} href={'/auth/signup'}>Sign up</Button>
            </>
            )}
        </div>
    );
};


export default SigninButton