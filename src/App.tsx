import React from 'react';
import Auth from './features/auth/Auth'
import {useSelector} from 'react-redux'
import {rootState} from './store/store'
import Home from './features/home/Home'
import './App.css';

import { useState } from 'react';

function App() {
  
  const logged=useSelector((state:rootState)=>state.auth.isAuthenticated)
  
  return (
    <div className="app-container">
      
            {logged?  <Home/>:<Auth/>}
          
    </div>
  );
}

export default App;
