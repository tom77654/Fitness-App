import React from 'react'

export default function SubmitButtonLogin({label,onClick,}) {
  return (
    <button onClick={onClick} className="login-button">{label}</button>
  )
}
