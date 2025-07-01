import React from "react";
import "../../styles/Landing.css";
import TextBlock from "../../components/LandingPage/Text";
import Picture from "../../components/LandingPage/Picture";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <TextBlock />
      <Picture />
    </div>
  );
}

/**
 * LandingPage-Komponente
 * Hauptkomponente der Landingpage, die Text und Bild kombiniert.
 * Verwendet die Komponenten LandingText und LandingImage.
 */
