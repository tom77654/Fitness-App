import React, { useEffect, useState } from 'react';
import '../../styles/LevelDisplay.css';

export default function LevelDisplay() {
  const [level, setLevel] = useState('');

  useEffect(() => {
    const gespeichertesLevel = localStorage.getItem('level');
    const levelMapping = {
      beginner: 'Anfänger',
      intermediate: 'Fortgeschritten',
      pro: 'Profi',
    };
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
