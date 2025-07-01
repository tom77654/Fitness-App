import React from 'react';

export default function TrainingstagButton({ tag, completed, onToggle }) {
  return (
    <button className="trainingstag-button" onClick={() => onToggle(tag)}>
      {completed ? '✅ Erledigt' : '⬜ Noch offen'}
    </button>
  );
}
