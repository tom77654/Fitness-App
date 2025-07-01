import React, { useState } from "react";
import '../../styles/hauptseite.css';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import ProgressBar from './ProgressBar';
import axios from "axios";



export default function Body() {
  const[progress,setProgress]=useState(0);
  const [level, setLevel] = useState('');

  const navigate=useNavigate();

useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Kein Token vorhanden? Weiterleiten zur Login-Seite
      navigate('/login');
    }
  }, [navigate]);

  const handleStartTraining = () => {
    navigate('/trainingsplan');
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Progress Response:', res.data);
        setProgress(res.data.progress || 0);
      } catch (error) {
        console.error('Fehler beim Laden des Fortschritts:', error);
      }
    };

    fetchProgress();
  }, []);

  useEffect(() => {
  if (!level) return;   //Bei lvl änderung progress auf 0 setzen
  setProgress(0);
}, [level]);


console.log('Aktueller Fortschritt im State:', progress);
  return (
    <div className="content">
      
      <h2>Dein Weg zu mehr Fitness beginnt hier</h2>
      <p>
        Starte jetzt mit deinem individuell angepassten Trainingsplan
        und erreiche deine Ziele Schritt für Schritt!
      </p>
      
      <div className="chart-container">
            <ProgressBar key={progress} value={progress} />
      </div>

      <button className="button" onClick={handleStartTraining}>
        Trainingsplan starten
      </button>

      <div className="cards">
        <div className="card-hauptseite">
          <h3>Schritt 1</h3>
          <p>Leichte Übungen zur Gewöhnung und Aktivierung der Muskulatur.</p>
        </div>
        <div className="card-hauptseite">
          <h3>Schritt 2</h3>
          <p>Mehr Fokus auf Ausdauer und Koordination.</p>
        </div>
        <div className="card-hauptseite">
          <h3>Schritt 3</h3>
          <p>Steigere deine Kraft und halte durch!</p>
        </div>
      </div>
    </div>
  );
}
