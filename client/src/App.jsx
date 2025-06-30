import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Place Public Routes Here */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
