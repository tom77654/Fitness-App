import React from 'react';

export default function ExerciseDetails({ exercise }) {
  return (
    <div className="exercise-details">
      <p><strong>Anleitung:</strong> {exercise.howTo}</p>
      <p><strong>Sätze x Wiederholungen:</strong> {exercise.sets} x {exercise.reps}</p>
      {exercise.video_url && (
        <iframe
          width="100%"
          height="200"
          src={exercise.video_url}
          title={exercise.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}
