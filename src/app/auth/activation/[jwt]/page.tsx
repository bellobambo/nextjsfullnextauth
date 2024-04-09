import { activateUser } from '@/lib/actions/authActions';
import React from 'react'

interface Props {
    params: {
        jwt: string;
    }
}

const ActivationPage = async ({ params }: Props) => {
    const result = await activateUser(params.jwt)

    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            {result === 'userNotExist' ? <p className='text-red-500 text-2xl'>The User Does Not Exist</p> : result === 'alreadyActivated' ?
                <p className='text-red-500 text-2xl'>The User Is Already Activated</p> : result === 'success' ? <p className='text-green-500'>Success!</p>
                    : <p className='text-yellow-500 text-2xl'> Oops! SomeThing Went Wrong</p>
            }
        </div>
    )
}

export default ActivationPage