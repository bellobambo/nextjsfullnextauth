import SignInForm from '@/app/components/SignInForm'
import Link from 'next/link'
import React from 'react'

interface Props {
    searchParams: {
        callbackUrl?: string;
    }
}

const page = ({searchParams} : Props) => {
    console.log({searchParams})
    return (
        <div className='flex items-center justify-center flex-col'>
            <SignInForm callbackUrl={searchParams.callbackUrl}/>
            <Link href={'/auth/forgotPassword'}>Forgot Your Password?</Link>
        </div>
    )
}

export default page