import React from 'react'

interface Props {
    passStrength: number
}

const PasswordStrength = ({ passStrength }: Props) => {
    return (
        <div className='flex gap-2'>
            {Array.from({length: passStrength+1}).map((i, index)=>(<div key={index}></div>))}
        </div>
    )
}

export default PasswordStrength