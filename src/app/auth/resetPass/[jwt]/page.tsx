import ResetPasswordForm from '@/app/components/ResetPasswordForm';
import React from 'react'

interface Props{
    params : {
        jwt : string;
    }
}

const ResetPasswordPage = ({params} : Props) => {
  return (
<ResetPasswordForm jwtUserId={params.jwt}/>
  )
}

export default ResetPasswordPage