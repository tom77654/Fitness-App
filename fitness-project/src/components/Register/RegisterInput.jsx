import React from 'react'

export default function RegisterInput({type,placeholder, value,onChange}) {

  const checkUsernameExists = async (username) => {
  try {
    const res = await fetch(`http://localhost:3001/check-username?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    return data.exists;
  } catch (error) {
    console.error("Fehler bei der Prüfung des Benutzernamens:", error);
    return false;
  }
};


  return (
   <input  type={type}
          placeholder={placeholder} required
          value={value}
          onChange={onChange} 
          className='register-input'/> 
  )
}
