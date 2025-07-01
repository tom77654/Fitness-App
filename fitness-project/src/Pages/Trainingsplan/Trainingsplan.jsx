import React, { useEffect, useState } from 'react';
import ExerciseList from '../../components/Trainingsübungen/ExerciseList';
import TrainingstagButton from '../../components/Trainingsübungen/TrainingsTagButton';
import '../../styles/TrainingstagButton.css';
import axios from 'axios';


const muscles = [
  { id: 1, name: "Brust" },
  { id: 2, name: "Schulter" },
  { id: 3, name: "Bauch" },
  { id: 4, name: "Trizeps" },
  { id: 5, name: "Bizeps" },
  { id: 6, name: "Beine" },
  { id: 7, name: "Rücken" },
];

const trainingPlanData = {
  beginner: [
    { tag: 1, label: '1. Trainingstag', muscles: 'Schulter/Brust/Trizeps' },
    { tag: 2, label: '2. Trainingstag', muscles: 'Rücken/Bizeps' },
    { tag: 3, label: '3. Trainingstag', muscles: 'Beine/Bauch' },
  ],
  intermediate: [
    { tag: 1, label: '1. Trainingstag', muscles: 'Schulter/Brust' },
    { tag: 2, label: '2. Trainingstag', muscles: 'Beine,Cardio' },
    { tag: 3, label: '3. Trainingstag', muscles: 'Trizeps/Bizeps' },
    { tag: 4, label: '4. Trainingstag', muscles: 'Rücken/Bauch' },
  ],
  pro: [
    { tag: 1, label: '1. Trainingstag', muscles: 'Brust/Bizeps' },
    { tag: 2, label: '2. Trainingstag', muscles: 'Beine/Bauch' },
    { tag: 3, label: '3. Trainingstag', muscles: 'Trizeps/Schulter' },
    { tag: 4, label: '4. Trainingstag', muscles: 'Rücken/Bauch' },
    { tag: 5, label: '5. Trainingstag', muscles: 'Beine/Bizeps' },
  ],
};


export default function Trainingsplan() {
const [selectedMuscle, setSelectedMuscle] = useState(1);
  const [level, setLevel] = useState(() => localStorage.getItem('level') || 'beginner');
  const [completedTags, setCompletedTags] = useState([]);

  const updateProgress = async (progress) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/progress/update', {progress}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.progress !== undefined) {
      setProgress(res.data.progress); // Fortschritt aktualisieren
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Fortschritts:', error);
  }
};



const [progress, setProgress] = useState(0);
const fetchProgress = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token beim Laden:', token);
    const res = await axios.get('http://localhost:3001/api/progress', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('API Progress Response:', res.data);
    setProgress(res.data.progress);
  } catch (error) {
    console.error('Fehler beim Laden des Fortschritts:', error);
  }
};

const fetchCompletedTags = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3001/api/trainingstage/completed', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCompletedTags(res.data.tags);
  } catch (error) {
    console.error('Fehler beim Laden der erledigten Trainingstage:', error);
  }
};
useEffect(() => {
  fetchProgress();
  fetchCompletedTags();
  
}, []);



  
  const toggleTag = async (tag) => {
  let updatedTags;
  if (completedTags.includes(tag)) {
    updatedTags = completedTags.filter(t => t !== tag);
  } else {
    updatedTags = [...completedTags, tag];
  }
  setCompletedTags(updatedTags);

  // Fortschritt berechnen als Prozentsatz der erledigten Trainingstage
  const totalTags = trainingPlanData[level].length;
  const progressValue = Math.round((updatedTags.length / totalTags) * 100);

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:3001/api/trainingstag/complete', { tag }, {
  headers: { Authorization: `Bearer ${token}` },
});

    if (res.data.progress !== undefined) {
      setProgress(res.data.progress);
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Fortschritts:', error);
  }
};

  return (
    <div className='trainingsplan-only'>
      <h1>Wochenplan</h1>
       <div className="trainingstage-container">
        {trainingPlanData[level].map(({ tag, label, muscles }) => (
          <div key={tag} className="trainingstag-row">
            <span className="trainingstag-label">
              {label} = {muscles}
            </span>
            <TrainingstagButton 
              tag={tag} 
              completed={completedTags.includes(tag)} 
              onToggle={toggleTag} 
            />
          </div>
  ))}
</div>

      <div>
        <label>Muskelgruppe wählen: </label>
        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(Number(e.target.value))}
        >
          {muscles.map(muscles => (
            <option key={muscles.id} value={muscles.id}>{muscles.name}</option>
          ))}
        </select>
      </div>

      <ExerciseList level={level} muscle={selectedMuscle} />
    </div>
  );
}
