import React, { useState,useEffect } from 'react';

const TippDesTages = () => {
  const [tipp, setTipp] = useState('');
  

const tipps = [
  "Trinke genug Wasser während des Trainings.",
  "Achte auf korrekte Ausführung – Qualität vor Quantität!",
  "Aufwärmen nicht vergessen: 5-10 Minuten genügen.",
  "Regelmäßiger Schlaf unterstützt Muskelwachstum.",
  "Ernähre dich ausgewogen für bessere Leistung."
];


  const zeigeTipp = () => {
    const zufallstipp = tipps[Math.floor(Math.random() * tipps.length)];
    setTipp(zufallstipp);
    localStorage.setItem('tippGedrueckt', 'true');
  };

  return (
    <div className="tipp-container">
      <button id="button2" onClick={zeigeTipp}>Tipp des Tages</button>
      <p id="tipp-text" style={{fontFamily: "Arial"}}>{tipp}</p>
    </div>
  );
}
export default TippDesTages;
