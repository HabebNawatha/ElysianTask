import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const RegistrationPage = React.lazy(() => import('./pages/RegistrationPage'));

const App = () => {
  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<RegistrationPage />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;
