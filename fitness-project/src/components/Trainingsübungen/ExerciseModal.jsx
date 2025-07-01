import React from 'react';
import ExerciseDetails from './ExerciseDetails';
import '../../styles/ExerciseModal.css';

export default function ExerciseModal({ exercise, onClose }) {
  if (!exercise) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>schließen</button>
        <h2>{exercise.name}</h2>
        <ExerciseDetails exercise={exercise} />
      </div>
    </div>
  );
}
