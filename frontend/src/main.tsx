import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store/store"
import App from './App'
import './index.css'
import { StrictMode } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <StrictMode>
        <App />
        <ToastContainer />
      </StrictMode>
    </Provider>
  </BrowserRouter>,
)
