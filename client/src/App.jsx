import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import CompleteProfile from "../pages/CompleteProfile.jsx";
// Leo Nguyen - import login and register pages
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import "./index.css";
import VolunteerHistoryPage from "../pages/VolunteerHistoryPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Place Public Routes Here */}
        <Route path="/" element={<HomePage />} />

        {/* Leo Nguyen - added login and registration routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/volunteer-history" element={<VolunteerHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
