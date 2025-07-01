import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import CompleteProfile from "../pages/CompleteProfile.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Place Public Routes Here */}
        <Route path="/" element={<HomePage />} />

        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
