import React, { useEffect, useState } from "react";
import '../../styles/hauptseite.css'; 

export default function Header() {
  const [username, setUsername] = useState('');

  useEffect(()=>{
    const name=localStorage.getItem('username');
    if(name){
      setUsername(name);
    }
  },[])
  
     return (
    <div className="header-overlay">
      <div className="header-top">
        <div className="header-links">
          
        </div>
      </div>
      <div className="header-center">
        <h1>Servus {username}</h1>
      </div>
    </div>
  );
}
//   return (
    
//       <div className="header-overlay">
//         <div className="header-top">
//           <div className="header-links">
            
//           </div>
//         </div>
//         <div className="header-center">
//           <h1>Willkommen, {username}!</h1>
          
//           </div>
//         </div>
//   );
 
  
