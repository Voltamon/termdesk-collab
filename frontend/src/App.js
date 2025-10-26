import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './components/Landing';
import Session from './components/Session';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/session/:sessionId" element={<Session />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;