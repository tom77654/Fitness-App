import React from 'react'
import landingpage from '../../assets/landingpage.png';



export default function Picture() {
  return (
    <div className="image">
      <img src={landingpage} alt="Imperial Fitness Landing Page" />
    </div>
  )
}

/**
 * LandingImage-Komponente
 * Zeigt das Bild der Landingpage an.
 * Das Bild ist responsiv und skaliert je nach Bildschirmgröße.
 */

