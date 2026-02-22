import axios from 'axios';
import React, { useState } from 'react'
import { loginSuccess } from '../../redux/features/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import api from '../../api/instance'
const Form = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showUser, setShowUser] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const Login = async() => {
    try {
      const response = await api.post('/users/login', {
        email,
        password
      })
      if(response.data.accessToken){
        console.log('the token: ',response.data.accessToken)
          dispatch(loginSuccess(response.data.accessToken))
          toast.success(`Welcome`)
          setTimeout( () => navigate('/chat'), 2000)
          
      }
    } catch (error) {
       if(axios.isAxiosError(error)){
        if(error.response){
          toast.error(error.response.data.message)
        }else{
          toast.error("Server error")
        }
       }else{
        console.log(error)
        toast.error("Unknown error, try later!")
       }
    }
  }

  const SignIn = async() => {
    try {
      const response = await api.post('/users/sign-in', {
        username,
        email,
        password
      })
         if(response.data.accessToken){
          dispatch(loginSuccess(response.data.accessToken))
          toast.success(`Welcome, ${username}`)
          setTimeout( () => navigate('/chat'), 2000)
      }else{
        toast.error(response.data.error)
      }
    } catch (error) {
      console.log(error)
      toast.error('Unknown error, Try again later')
    }
  }



  return (
    <div className='bg-[#262626] min-h-screen w-full flex items-center justify-center'>
      <div className="card bg-white w-96 h-80 shadow-sm flex flex-col items-center p-6 gap-4 box-border">

        <h1 className='text-2xl font-["Lobster"]'>ChatPDF</h1>

        {showUser && (
          <input type="text" 
          placeholder="Username" 
          className="input" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input type="text" placeholder="Email" className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <input  type="password" placeholder="Password" className="input" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />

        {showUser ? <button className="btn btn-primary" onClick={SignIn}>SIGN-UP</button>:
        <button className="btn btn-success" onClick={Login}>LOGIN</button>
        } 

        <div className='flex gap-[5px]'>
         
         {showUser ?
         <>
          <p className='text-xs'>Have an account?, </p>
          <p
            className='text-xs link link-primary link-hover cursor-pointer'
            onClick={() => setShowUser(!showUser)}
          >
            Login!
          </p>
         </>
         :
         <>
            <p className='text-xs'>Don't have an account?,</p>
         <p
            className='text-xs link link-primary link-hover cursor-pointer'
            onClick={() => setShowUser(!showUser)}
          >
            Sign-up right now!
          </p>
         </>
       
         } 
        </div>
      </div>
    </div>
  );
};


export default Form