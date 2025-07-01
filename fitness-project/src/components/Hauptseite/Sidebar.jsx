import { useNavigate } from 'react-router-dom';
import '../../styles/Sidebar.css';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Alles löschen, was beim Login gespeichert wurde
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('tippGedrueckt');
    // Weiterleitung zum Login
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <ul>
        <li><a onClick={() => navigate('/hauptseite')}>Hauptseite</a></li>
        <li><a onClick={() => navigate('/videos')}>Videos</a></li>
        <li><a onClick={() => navigate('/cards')}>Lvl-Auswahl</a></li>
        <li><a onClick={handleLogout}>Logout</a></li>
      </ul>
    </nav>
  );
}


