import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import {Entry} from '../../types/types'


const entries=createSlice({
    name:'entries',
    initialState: [] as Entry[],
    reducers:{
        setEntries(state,{payload}){
            return state=payload
            
            
        },
        updateEntry(state,{payload}: PayloadAction<Entry>){
            const {id}=payload
            const diaryIndex=state.findIndex((diary)=>diary.id===id)
            if(diaryIndex!==-1){
                state.splice(diaryIndex,1,payload)
            }
        }
        
    }

})

export const {setEntries,updateEntry}=entries.actions
export default entries.reducer