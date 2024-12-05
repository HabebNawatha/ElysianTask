import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const RegistrationPage = React.lazy(() => import('./pages/RegistrationPage'));

const App = () => {
  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
        <Route
            path="/"
            element={
              <GoogleOAuthProvider clientId="813868909137-is97602306lj5d4qkcif71rc2atnuc8f.apps.googleusercontent.com">
                <RegistrationPage />
              </GoogleOAuthProvider>
            }
          />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;
