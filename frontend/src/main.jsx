import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import 'bootstrap'
import "./styles/index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./services/authConfig.js";
import { MsalProvider } from "@azure/msal-react";
import { Provider } from "react-redux";
import store from "./redux/store.js"

const msalInstance = new PublicClientApplication(msalConfig);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter>
          <App />            
        </BrowserRouter>
      </MsalProvider>
    </Provider>
    
    
  </StrictMode>
);
