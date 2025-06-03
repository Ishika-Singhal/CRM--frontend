import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import Tailwind CSS
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the entire application with AuthProvider to provide authentication context */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// reportWebVitals();