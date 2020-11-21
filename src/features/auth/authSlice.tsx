import {createSlice} from '@reduxjs/toolkit'

const auth=createSlice({
    name:'auth',
    initialState:{
        isAuthenticated:false
    },
    reducers:{
        setAuthState(state,{payload}){
            
            state.isAuthenticated=payload
        }
    }
    
})

export const {setAuthState}=auth.actions
export default auth.reducer