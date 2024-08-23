import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './globle.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from './context/userContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <UserProvider>
    <App />
    </UserProvider>
    <Toaster  />
    </BrowserRouter>  
  </StrictMode>,
)
