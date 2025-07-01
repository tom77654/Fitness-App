import React from 'react';



export default function LevelCard({ level, onSelect }) {
  
  return (
    <div
      className="card"
      style={{ backgroundImage: `url(${level.imageUrl})` }}
      onClick={() => onSelect(level)}
    >
      <div className="card-content">
        <h2>{level.title}</h2>
        <p>{level.description}</p>
      </div>
    </div>
  );
}
