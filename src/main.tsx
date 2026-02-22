import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import { Provider } from 'react-redux'
import {store} from '../redux/store.ts'
import '../api/interceptors.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Toaster
  position="bottom-right"
  reverseOrder={false}
  />
  <Provider store={store}>
      <App />
  </Provider>
    
    </BrowserRouter>
   
  </StrictMode>,
)
