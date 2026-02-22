import React, { useEffect} from 'react'
// import { socket } from '../socket';
// import StreamedMarkdown from '../components/Markdown';
// import DropFileInput from '../components/DropFileInput';

import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/authSlice';
import api from '../../api/instance';

import { useSelector } from 'react-redux'
import type {RootState} from '../../redux/store'
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';


// type Message = {
//   sender: 'User' | 'AI';
//   text: string;
// }


const Chatpage = () => {
  const {isAuthenticated, initialized} = useSelector((state: RootState) => state.auth)
   
    const dispatch = useDispatch()
    const navigate = useNavigate()
  
   
 


useEffect(() => {
  if(!initialized) return;

  if(!isAuthenticated){
    navigate("/", {replace: true})
  }
 
}, [isAuthenticated, initialized])
  

     const logoutUser = async() => {
    try {
      const response = await api.post('/users/logout')
      if(response.data){
       dispatch(logout())
      toast.success(response.data.message)
      navigate('/')
      }
      
    } catch (error) {
      console.log(error)
      toast.error('Unknown error, Try again later')
    }
  }






  



 
  return (
   <div className="drawer min-h-screen">
  {/* Drawer toggle */}
  <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />

  {/* ================= MAIN PAGE ================= */}
  <div className="drawer-content relative bg-[#262626] min-h-screen w-full flex flex-col items-center gap-4">

    {/* Logout button */}
    <button
      className="tooltip tooltip-bottom fixed top-4 right-4 cursor-pointer h-10 w-10 z-50 bg-white rounded-[10px] flex justify-center items-center"
      data-tip="Logout"
      onClick={logoutUser}
    >
     <img 
     className="w-6 h-6 "
     src='/logout.png'
     />
    </button>

    {/* Open drawer button */}
    <div
      className="tooltip tooltip-bottom absolute top-5 left-5 bg-white rounded-md p-2 tooltip-white z-40 fixed"
      data-tip="Open Sidebar"
    >
      <label htmlFor="my-drawer-1" className="btn drawer-button">
        <img src="/menu-alt-svgrepo-com.svg" className="w-8 h-8" />
      </label>
    </div>

    {/* ================= CHAT MESSAGES ================= */}
  
    <Outlet />

    {/* ================= INPUT BAR ================= */}
 
  </div>

  {/* ================= SIDEBAR ================= */}
   <Sidebar />
</div>

  )
}

export default Chatpage