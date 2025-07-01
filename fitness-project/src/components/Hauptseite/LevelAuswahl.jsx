import React, { useEffect, useState } from 'react';
import '../../styles/LevelDisplay.css';

export default function LevelDisplay() {
  // State, um das aktuelle Fitness-Level anzuzeigen
  const [level, setLevel] = useState('');

  useEffect(() => {
    // Level aus localStorage laden (z.B. 'beginner', 'intermediate', 'pro')
    const gespeichertesLevel = localStorage.getItem('level');
    const levelMapping = {
      beginner: 'Anfänger',
      intermediate: 'Fortgeschritten',
      pro: 'Profi',
    };
    // Falls ein Level gespeichert ist, wird das entsprechende Label gesetzt
    if (gespeichertesLevel) {
      setLevel(levelMapping[gespeichertesLevel] || gespeichertesLevel);
    }
  }, []);

  return (
    <div className="level-display">
      <span>Level: {level}</span>
    </div>
  );
}
