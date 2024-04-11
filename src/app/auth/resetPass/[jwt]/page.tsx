import ResetPasswordForm from '@/app/components/ResetPasswordForm';
import { verifyJWT } from '@/lib/jwt';
import React from 'react'

interface Props {
  params: {
    jwt: string;
  }
}

const ResetPasswordPage = ({ params }: Props) => {
  const payload = verifyJWT(params.jwt);
  if(!payload) return <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
    The Url Not Valid
  </div>
  return (
    <div className='flex  justify-center'>
      <ResetPasswordForm jwtUserId={params.jwt} />

    </div>
  )
}

export default ResetPasswordPage