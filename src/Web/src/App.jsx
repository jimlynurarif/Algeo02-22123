import React, { useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Hero from "./components/Hero";
import { StickyNavbar } from "./components/StickyNavbar";
import ImageUpload from "./components/UploadImage";
import OurTeam from "./components/OurTeam";
import GuidePage from "./components/GuidePage";

function App() {

  const imageUploadRef = useRef(null);
  const scrollToImageUpload = () => {
    if (imageUploadRef.current) {
      imageUploadRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const HomePage = useRef(null);
  const scrollToHomePage = () => {
    if (HomePage.current) {
      HomePage.current.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <div>
      <Router>
        <div className="app">
          <StickyNavbar  onScrollToHomepage={scrollToHomePage} />
          <div className="content">
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <>
                    <div ref={HomePage}>
                      <Hero onScrollToImageUpload={scrollToImageUpload}/>
                    </div>
                    <div ref={imageUploadRef}>
                      <ImageUpload/>
                    </div>
                  </>
                }
              />
              <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
              />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/team" element={<OurTeam />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
