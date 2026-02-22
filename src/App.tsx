import { Route, Routes } from "react-router-dom"
import Chatpage from "./pages/Chatpage"
import Form from "./pages/Form"
import {useDispatch} from 'react-redux'
import { useEffect } from "react";
import { initializeAuth, loginSuccess } from "../redux/features/authSlice";
import EmptyState from "./components/EmptyState";
import Conversation from "./components/Conversation";


function App() {
   const dispatch = useDispatch();

   useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    dispatch(loginSuccess(token));
  } else {
    dispatch(initializeAuth());
  }
}, []);

  return (
    <>
         <Routes>
           <Route path="/" element={<Form />}/>
           <Route path="/chat" element={<Chatpage />}>
           <Route index element={<EmptyState/>} />
           <Route path="conversation/:id" element={<Conversation />}/>
           </Route>
         </Routes>
    </>
  )
}

export default App
