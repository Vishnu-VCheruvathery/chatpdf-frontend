import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from 'jwt-decode'

type decodedToken = {
   id: string;
}

type AuthState = {
  user: string | null,
  token: string | null,
  isAuthenticated: boolean,
  initialized: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    initialized: false
}

const decodeToken = (token : string) => {
      console.log('the type of : ' + typeof token + 'and ' + token)
      const decoded = jwtDecode<decodedToken>(token)
      const id = decoded.id
      return id
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      loginSuccess(state, action) {
        console.log(action)
        state.user = decodeToken(action.payload);
        state.token = action.payload;
        state.isAuthenticated = true;
        state.initialized = true
        localStorage.setItem('token', action.payload)
      },
      logout(state){
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.initialized = true;
        localStorage.removeItem('token')
      },
       initializeAuth(state) {
      state.initialized = true;
    }
    }
})

export const {loginSuccess, logout, initializeAuth} = authSlice.actions;
export default authSlice.reducer;