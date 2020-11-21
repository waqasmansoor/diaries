import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import {Diary} from '../../types/types'


const diaries=createSlice({
    name:'diaries',
    initialState: [] as Diary[],
    reducers:{
        addDiary(state,{payload}){
            
            const diariesToSort:Diary[] = payload.filter((diary:Diary) => {
                return state.findIndex((item) => item.id === diary.id) === -1
              });
            
              state.push(...diariesToSort);
              if(state.length>1){
                
                    const sortedByUpdatedAt=state.sort((a:Diary,b:Diary)=>{
                        return dayjs(b.updatedAt).unix()-dayjs(a.updatedAt).unix()
                    })
                    
                    return state=sortedByUpdatedAt
                }
            
            
        },
        updateDiary(state,{payload}: PayloadAction<Diary>){
            const {id}=payload
            const diaryIndex=state.findIndex((diary)=>diary.id===id)
            if(diaryIndex!==-1){
                state.splice(diaryIndex,1,payload)
            }
        }
        
    }

})

export const {addDiary,updateDiary}=diaries.actions
export default diaries.reducer