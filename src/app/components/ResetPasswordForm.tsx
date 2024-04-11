'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { passwordStrength } from 'check-password-strength';
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import PasswordStrength from './PasswordStrength';
import { resetPassword } from '@/lib/actions/authActions';
import { toast } from 'react-toastify';

interface Props {
    jwtUserId: string;
}


const FormSchema = z.object({
    password: z.string().min(6, 'Password Must Be At Least 6 characters')
        .max(52, 'Password Must Be At Least 52 characters'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password does Not Match!',
    path: ['confirmPassword']
});

type InputType = z.infer<typeof FormSchema>;

const ResetPasswordForm = ({ jwtUserId }: Props) => {
    const [visiblePass, setVisiblePass] = useState(false)



    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<InputType>({
        resolver: zodResolver(FormSchema),
    })

    useEffect(() => {
        setPassStrength(passwordStrength(watch().password).id);
    }, [watch().password])


    const [passStrength, setPassStrength] = useState(0);

    const resetPass: SubmitHandler<InputType> = async (data) => {

        try {
            const result = await resetPassword(jwtUserId, data.password);
            if (result === 'success') toast.success('Your Password has been reset Successfully');
        } catch (error) {
            toast.error('Something went Wrong');
            console.log(error)
        }

    }


    return (
        <form className='flex flex-col gap-2 p-2 m-2 border rounded-md shadow' onSubmit={handleSubmit(resetPass)}>
            <div className='text-center p-2'>
                Reset Your Password
            </div>
            <Input
                endContent={<button type='button' onClick={() => setVisiblePass(prev => !prev)}>
                    {visiblePass ? (<EyeSlashIcon className='w-4' />) : (<EyeIcon className='w-4' />)}
                </button>}
                type={visiblePass ? 'text' : 'password'} label='Password' {...register('password')} errorMessage={errors.password?.message} />

            <PasswordStrength passStrength={passStrength} />

            <Input type={visiblePass ? 'text' : 'password'} label='Confirm Password' {...register('confirmPassword')} errorMessage={errors.confirmPassword?.message} />

            <div className='flex justify-center'>
                <Button isLoading={isSubmitting} type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Please Wait ...' : 'Submit'}
                </Button>
            </div>

        </form>
    )
}

export default ResetPasswordForm