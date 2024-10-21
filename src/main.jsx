import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContextProvider from './Context/AuthContext.jsx'
import { NextUIProvider } from '@nextui-org/react'

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <AuthContextProvider>
       <App/>
      </AuthContextProvider>
    </NextUIProvider>
  </React.StrictMode>
)
