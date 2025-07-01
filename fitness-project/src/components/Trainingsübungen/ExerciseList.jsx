import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ExerciseCard from './ExerciseCard';
import '../../styles/Trainingsplan.css';

export default function ExerciseList({ level, muscle }) {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (level && muscle) {
      axios
        .get(`http://localhost:3001/trainingsplan?level=${level}&muscle_group_id=${muscle}`)
        .then((res) => setExercises(res.data))
        .catch((err) => console.error('Fehler beim Laden:', err));
    }
  }, [level, muscle]);

   //if (!level || !muscle) return null;

  return (
    <div className="exercise-list">
      
      <div className="exercise-grid">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}

