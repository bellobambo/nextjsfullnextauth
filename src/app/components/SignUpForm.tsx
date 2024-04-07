'use client'

import { EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon, PhoneIcon, UserIcon } from '@heroicons/react/16/solid'
import { Button, Checkbox, Input, Link } from '@nextui-org/react'
import validator from "validator"
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { Controller, Form, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordStrength } from 'check-password-strength'
import PasswordStrength from './PasswordStrength'
import { registerUser } from '@/lib/actions/authActions'
import { toast } from 'react-toastify'



const FormSchema = z.object({
    firstName: z.string().min(2, 'First Name Must Be 2 Characters')
        .max(45, "First Name Must Be less Than 45 Characters").regex(new RegExp("^[a-zA-Z]+$"), "No Special Characters Allowed"),
    lastName: z.string().min(2, 'Last Name Must Be 2 Characters')
        .max(45, "Last Name Must Be less Than 45 Characters").regex(new RegExp("^[a-zA-Z]+$"), "No Special Characters Allowed"),
    email: z.string().email('Please enter a Valid Email Address'),
    phone: z.string().refine(validator.isMobilePhone, "Please Enter A valid Phone Number"),
    password: z.string().min(6, 'Password must be at least 6 characters long')
        .max(50, 'Password Must Be less Than 50 characters '),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters long')
        .max(50, 'Password Must Be less Than 50 characters '),
    accepted: z.literal(true, {
        errorMap: () => ({
            message: "Please Accept All Terms"
        })
    })

}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords Do Not Match!",
    path: ['password', 'confirmPassword']
})

type InputType = z.infer<typeof FormSchema>

const SignUpForm = () => {
    const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<InputType>({
        resolver: zodResolver(FormSchema),
    })
    const [isVisiblePass, setIsVisiblePass] = useState(false)
    const toggleVisiblePass = () => setIsVisiblePass(prev => !prev)

    const saveUser: SubmitHandler<InputType> = async (data) => {
        const { accepted, confirmPassword, ...user } = data;
        try {
            const result = await registerUser(user);
            toast.success('The User Registered successful')
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    const [passStrength, setPassStrength] = useState(0);

    useEffect(() => {
        setPassStrength(passwordStrength(watch().password).id);
    }, [watch().password])

    return (
        <form onSubmit={handleSubmit(saveUser)} className='grid grid-cols-2 gap-3 p-2 shadow border rounded-md place-self-stretch'>
            <Input errorMessage={errors.firstName?.message} isInvalid={!!errors.firstName} {...register("firstName")} label='First Name' startContent={<UserIcon className='w-4' />} />
            <Input errorMessage={errors.lastName?.message} isInvalid={!!errors.lastName} {...register("lastName")} label='Last Name' startContent={<UserIcon className='w-4' />} />
            <Input errorMessage={errors.email?.message} isInvalid={!!errors.email} {...register("email")} className='col-span-2' label='Email' startContent={<EnvelopeIcon className='w-4' />} />
            <Input errorMessage={errors.phone?.message} isInvalid={!!errors.phone} {...register("phone")} className='col-span-2' label='Phone' startContent={<PhoneIcon className='w-4' />} />
            <Input errorMessage={errors.password?.message} isInvalid={!!errors.password}  {...register("password")} className='col-span-2' label='Password' type={isVisiblePass ? "text" : "password"} startContent={<KeyIcon className='w-4' />} endContent={isVisiblePass ? <EyeSlashIcon className='w-4 cursor-pointer' onClick={toggleVisiblePass} />
                : <EyeIcon className='w-4 cursor-pointer' onClick={toggleVisiblePass} />} />

            <PasswordStrength passStrength={passStrength} />
            <Input errorMessage={errors.confirmPassword?.message} isInvalid={!!errors.confirmPassword} className='col-span-2' {...register("confirmPassword")} type={isVisiblePass ? "text" : "password"} label='Confirm Password' startContent={<KeyIcon className='w-4' />} />

            <div className='flex  items-center'>

                <Controller control={control} name='accepted' render={({ field }) =>
                (
                    <Checkbox

                        onChange={field.onChange} onBlur={field.onBlur} className='col-span-2'>

                    </Checkbox>
                )
                } />
                {errors.accepted && <p className='text-red-500'>{errors.accepted.message}  </p>}


                I Accept The <Link className='ml-2' href='/terms'>Terms</Link>
            </div>
            <div className='flex justify-center col-span-2'>
                <Button className='w-48' color='primary' type="submit">Submit </Button>

            </div>
        </form>
    )
}

export default SignUpForm