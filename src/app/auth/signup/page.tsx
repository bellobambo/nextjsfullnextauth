import SignUpForm from '@/app/components/SignUpForm'
import { Image } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

const SignupPage = () => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-3 place-items-center'>
            <div className='md:col-span-2 flex justify-center items-center'>
            <p className='text-center p-2'>Already SignUp?</p>
            <Link href={"/auth/signin"}>Sign In</Link>

            </div>
            <SignUpForm/>
            <Image src='/login.png' alt='Login Form' width={500} height={500} />
        </div>
    )
}

export default SignupPage