import React from 'react'

export default function SubmitButton({label,onClick}) {
  return (
    <button className='register-button' onClick={onClick}>{label}</button>
  )
}
