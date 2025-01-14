import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { Provider } from "react-redux";
import store from './redux/store/store.js'



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <App />
    </Provider>
  </BrowserRouter>,
)
