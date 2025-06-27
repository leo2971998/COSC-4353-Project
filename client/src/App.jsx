import { useState } from "react";
import "./index.css";

function App() {
  return (
    <>
      <div className="text-3xl font-bold text-blue-500">
        Tailwind is working!
      </div>

      <div>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
          Test Button
        </button>
      </div>
    </>
  );
}

export default App;
