import React, { useState } from 'react';
import LevelCard from '../../components/Cards/LevelCard';
import '../../styles/Cards.css';
import beginner from '../../assets/anfänger.png';
import intermediate from '../../assets/fortgeschritten.PNG';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Cards() {

  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const levels = [
    {
      id: 'beginner',
      title: 'Anfänger',
      description: 'Starte deine Fitness-Reise mit einfachen Übungen.',
      imageUrl: beginner,
    },
    {
      id: 'intermediate',
      title: 'Fortgeschritten',
      description: 'Baue auf deinen Erfolgen auf und steigere deine Power!',
      imageUrl: intermediate,
    },
    {
      id: 'pro',
      title: 'Profi',
      description: 'Maximiere dein Training und erreiche deine Limits!',
      imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?crop=entropy&cs=tinysrgb&fit=crop&h=800&w=1200',
    },
  ];

  const handleSelect = async (level) => {
    console.log("Level ausgewählt:", level);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/user/level', 
        { level: level.id }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
          
        }
      );
      await axios.put('http://localhost:3001/api/progress/reset', {}, {   //lvl ändern Progress rücksetzen
  headers: { Authorization: `Bearer ${token}` }
});


      localStorage.setItem('level', level.id);
      
      navigate('/hauptseite');
    } catch (error) {
      console.error('Fehler beim Setzen des Levels:', error);
    }
  };

  return (
    <div className="level-selection-page">
  <h1>Wähle dein Fitness-Level</h1>

  <div className="card-container">
    {levels.map(level => (
      <LevelCard key={level.id} level={level} onSelect={handleSelect} />
    ))}
  </div>

  <div className="info-button-wrapper">
    <button className="info-button" onClick={() => setShowInfo(true)}>
      Info
    </button>
  </div>

  {showInfo && (
    <div className="info-popup-overlay" onClick={() => setShowInfo(false)}>
      <div className="info-popup-content" onClick={e => e.stopPropagation()}>
        <p>Du kannst dein Fitness-Level später jederzeit im Hauptmenü ändern.</p>
        <button onClick={() => setShowInfo(false)} className="close-button">Schließen</button>
      </div>
    </div>
  )}
</div>

  );
}
