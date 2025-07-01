import React from 'react'

export default function LoginInput({type,placeholder,value,onChange,className}) {
  return (
    <input type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="login-input"required/>
        
        
  )
}
