import React from "react";
import Landing from './Pages/Landingpage/Landing';
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Cards from "./Pages/Cards/Cards";
import {BrowserRouter,Routes,Route, useLocation} from "react-router-dom"
import Hauptseite1 from "./Pages/Hauptseite/Hauptseite1";
import Sidebar from "./components/Hauptseite/Sidebar";
import LevelDisplay from "./components/Hauptseite/LevelAuswahl";
import Trainingsplan from "./Pages/Trainingsplan/Trainingsplan";
import Videopage from "./Pages/Videopage/Videopage";

function LayoutWithSidebar({ children }) {
  const location = useLocation();
  const showSidebar = ["/cards", "/hauptseite","/trainingsplan","/videos"].includes(location.pathname);
  const level =["/hauptseite"].includes(location.pathname)

  return (
    <>
      {showSidebar && <Sidebar />}
      {level && <LevelDisplay />}
      {children}
    </>
  );
}


function App() {
  return (
    <>
    <BrowserRouter>
    {/* Seiten ohne Sidebar */}
    <Routes>
      <Route path="/"element={<Landing/>}/>
      <Route path= "login" element={<Login/>}/>
      <Route path= "register"element={<Register/>}/>

    {/* Seiten mit Sidebar in Layout */}

      <Route path= "cards"element={<LayoutWithSidebar><Cards/></LayoutWithSidebar>}/>

      <Route path="hauptseite"element={<LayoutWithSidebar><Hauptseite1/></LayoutWithSidebar>}/>
      
      <Route path="trainingsplan"element={<LayoutWithSidebar><Trainingsplan/></LayoutWithSidebar>}/>
       
      <Route path="videos"element={<LayoutWithSidebar><Videopage/></LayoutWithSidebar>}/>
       </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
