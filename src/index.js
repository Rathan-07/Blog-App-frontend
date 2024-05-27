import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from  './components/context/AuthContext'
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import './styles.css'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    <AuthProvider>
     <BrowserRouter>
       <App />
      
    </BrowserRouter>
    </AuthProvider>
  
   
 
);


