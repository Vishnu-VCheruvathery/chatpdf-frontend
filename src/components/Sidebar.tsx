import React, { useEffect, useState } from 'react'
import api from '../../api/instance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

type Conversation = {
  _id: string;
  title: string;
  userId: string;
  createdAt: Date
}




const Sidebar = () => {
  const {isAuthenticated} = useSelector((state: RootState) => state.auth)
     const [conversations, setConversations] = useState<Conversation[]>([])
     const [toggleTitle, setToggleTitle] = useState(false);
      const [convTitle, setConvTitle] = useState('')
      const navigate = useNavigate();
      const createConversation = async() => {
    try {
      const response = await api.post('/users/create/conv', {title: convTitle});
      if(response.data){
      setConversations((prev) => [...prev, 
        response.data.conversation
      ])  
      toast.success('Conversation created!')
      setConvTitle('')
      }
    
    } catch (error) {
      console.log(error)
      toast.error('Unknown error, Try again later!')
    }
  }

     const getConversations = async() => {
       try {
         const response = await api.get('/users/conversations');
         console.log(response.data)
         if(response.data){
           setConversations(response.data)
         }
       } catch (error) {
         console.log(error)
         toast.error('Unknown error, Try again later!')
       }
     }

    
    useEffect(() => {
     getConversations()
    }, [isAuthenticated])

  return (
     <div className="drawer-side z-50">
    <label htmlFor="my-drawer-1" className="drawer-overlay"></label>

    <ul className="menu bg-base-200 min-h-full w-80 p-4 relative">
      {/* <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li> */}
      {conversations.map((conv) => (
        <li onClick={() => navigate(`/chat/conversation/${conv._id}`)}><a>{conv.title}</a></li>
      ))}

      {toggleTitle ? (
     <div className="absolute bottom-4 left-0 right-0 px-4 flex items-center justify-between">
  <button
    className="btn btn-error"
    onClick={() => setToggleTitle(false)}
  >
    X
  </button>

  <input
    type="text"
    className="input w-40"
    placeholder="Enter title..."
    value={convTitle}
    onChange={(e) => setConvTitle(e.target.value)}
  />

  <button className="btn btn-success" onClick={createConversation}>
    <img
      src="/send.png"
      className="w-6 h-6 mix-blend-multiply"
    />
  </button>
</div>

      ) : (
        <button
          className="btn absolute bottom-4 left-1/2 -translate-x-1/2 w-60"
          onClick={() => setToggleTitle(true)}
        >
          New Conversation +
        </button>
      )}
    </ul>
  </div>
  )
}

export default Sidebar