import React from 'react'
import { useState } from 'react'
import { FC } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {updateDiary} from './diarySlice'
import swal from 'sweetalert2'
import './DiaryTile.css'
import {Diary} from '../../types/types'
import dayjs from 'dayjs'



const DiaryTile:FC<{diary:Diary,canEdit:boolean,setDiary:(id:string)=>void}>=({diary,canEdit,setDiary})=>{
   
    const dispatch=useDispatch()
    
   

    function handleClick(){
        setDiary(diary.id)
        
    }
    const editDiary=async()=>{
        const result=await swal.mixin({
            input:'text',
            confirmButtonText:'SAVE',
            showCancelButton:true,
            progressSteps:['1']
        }).queue([
            {
                titleText:'Diary Title',
                input:'text',
                inputValue:`${diary.title}`
            },
            
        ]).then(async(result:any)=>{
            if(result.value){
                const {value}=result
                const now=dayjs().format()
            try{
                const res=await fetch(`http://diaries.app/diaries/${diary.id}`,{
                method:'PUT',
                body:JSON.stringify({...diary,updatedAt:now,title:value[0]})
                
            })
            const data=await res.json() as Diary
                
            dispatch(updateDiary(data))
        }catch(error){throw(error)}
        }})
        
        
    }
    return(
        <div className='diary-tile'>
            
            <div onClick={handleClick}>
                
                <span>{diary.title}</span>
            </div>
            {canEdit&&
                <button onClick={editDiary}>Edit</button>
            }
            
        </div>
    )
}

export default DiaryTile