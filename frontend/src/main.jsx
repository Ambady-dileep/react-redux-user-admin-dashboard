import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-center" autoClose={700} hideProgressBar newestOnTop closeOnClick toastClassName="!rounded-xl !text-sm !font-medium !shadow-lg !text-center"/>
    </Provider>
  </StrictMode>,
)
