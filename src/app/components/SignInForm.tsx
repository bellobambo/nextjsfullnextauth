'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

interface Props {
    callbackUrl?: string;
}


const FormSchema = z.object({
    email: z.string().email('Please Enter a Valid Email Adresss'),
    password: z.string({
        required_error: "Please Enter Your Password",
    }),

})

type InputType = z.infer<typeof FormSchema>;

const SignInForm = (props: Props) => {
    const router = useRouter()
    const [visiblePass, setVisiblePass] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InputType>({

        resolver: zodResolver(FormSchema)
    })

    const onSubmit: SubmitHandler<InputType> = async (data) => {
        const result = await signIn('credentials', {
            redirect: false,
            username: data.email,
            password: data.password,
        });

        if (!result?.ok) {
            toast.error(result?.error)
            return;
        }
        toast.success('Bambo Welcomes You')

        router.push(props.callbackUrl ? props.callbackUrl : '/')

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2  rounded-md border shadow  overflow-hidden w-full'>
            <div className='bg-gradient-to-b from-white-slate-200 dark:from-slate-700 to-slate-900 p-2  text-center'>
                SignIn Form
            </div>
            <div className='p-2 flex flex-col gap-2'>


                <Input label='Email' {...register('email')} errorMessage={errors.email?.message} />
                <Input type={visiblePass ? 'text' : 'password' } label='Password' {...register('password')}
                    endContent={<button type='button' onClick={() => setVisiblePass(prev => !prev)}>
                        {visiblePass ? (<EyeSlashIcon className='w-4' />) : (<EyeIcon className='w-4' />)}
                    </button>}
                    errorMessage={errors.password?.message} />
                <div className='flex items-center justify-center gap-2'>

                    <Button color='primary' type='submit' disabled={isSubmitting} isLoading={isSubmitting}>
                        {isSubmitting ? "Signing In..." : 'Sign In'}
                    </Button>
                    <Button as={Link} href='/auth/signup'> Sign Up</Button>
                </div>
            </div>
        </form>
    )
}

export default SignInForm