import {createSlice} from '@reduxjs/toolkit'
import {User} from '../types/types'


const user=createSlice({
    name:'user',
    initialState: null as User|null,
    reducers:{
        setUser(state,{payload}){
            state=(payload!=null)?payload:null
            
            return state
        }
        
    }

})

export const {setUser}=user.actions
export default user.reducer