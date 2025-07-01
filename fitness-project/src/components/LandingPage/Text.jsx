import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TextBlock() {
  const navigate=useNavigate();
  return (
    <div className="text">
      <h1>
        Imperial Fitness
      </h1>
      <p>Trainiere smarter. Werde stärker. <br></br>Hol dir deinen Traumkörper.</p>
      <button className="button_start" onClick={()=>navigate("login")}>Starte jetzt</button> 
    </div>
  );
}

/**
 * LandingText-Komponente
 * Zeigt Überschrift, Beschreibung und einen Start-Button an.
 * Beim Klick auf den Button wird zur Login-Seite navigiert.
 */

