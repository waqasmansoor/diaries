import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/auth/userSlice'
import authReducer from '../features/auth/authSlice'
import diariesReducer from '../features/home/diary/diarySlice'
import entriesReducer from '../features/home/entry/entrySlice'
import {User,Diary,Entry} from '../features/types/types'


export type rootState={
    user:User|null
    auth:{
        isAuthenticated:boolean
    }
    diaries:Diary[]
    entries:Entry[]
    
}


const rootReducer=combineReducers({
    user:userReducer,
    auth:authReducer,
    diaries:diariesReducer,
    entries:entriesReducer,
    
})


const store=configureStore({
    reducer:rootReducer
})

export default store
// export type rootState=ReturnType<typeof rootReducer>