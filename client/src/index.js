import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
 <Auth0Provider
  domain="dev-u8nmi1cq4hyoy10r.us.auth0.com"
  clientId="vv8o4LY6611SMBwV5JVYSOIV5aOJES04"
  authorizationParams={{
    redirect_uri: window.location.origin,
  }}
>
  <App />
</Auth0Provider>
  </StrictMode>,
);
