import React,{useState,useEffect} from 'react'
import swal from 'sweetalert2'
import {setEntries} from '../entry/entrySlice'
import {useSelector,useDispatch} from 'react-redux'
import {rootState} from '../../../store/store'
import dayjs from 'dayjs'
import { updateDiary } from './diarySlice'
import {Entry,Diary} from '../../types/types'
import './DiaryEntries.css'


const DiaryEntriesList:React.FC<{id:string}>=({id})=>{
    
    
    const [activeEntry,setActiveEntry]=useState<Entry>()
    const dispatch=useDispatch()
    const entries=useSelector((state:rootState)=>state.entries)
    const user=useSelector((state:rootState)=>state.user)
    
    
    useEffect(()=>{
        if(id!=null){
            const fetchEntries=async()=>{
                const res=await fetch(`http://diaries.app/diaries/entries/${id}`)
                const data=await res.json()
                const {entries}=data as {entries:Entry[]}
                
                if(entries.length>0)
                {
                    const sortByLastUpdated = entries.sort((a:Entry, b:Entry) => {
                        return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
                    });
                    
                    
                    dispatch(setEntries(sortByLastUpdated))
                }
                
            }
        fetchEntries()
        
        }
    },[id,activeEntry])
    
    const handleClick=async()=>{
        const result=swal.mixin({
            input:'text',
            confirmButtonText:'Next &rarr;',
            showCancelButton:true,
            progressSteps:['1','2']
        }).queue([
            {
                titleText:'Entry Title',
                input:'text'
            },
            {
                titleText:'Content?',
                input:'textarea',
                inputValue:'Any thing you want to mention?'
                
            }
        ]).then(async(result:any)=>{
            if(result.value){
                const {value}=result
                try{
                    const res=await fetch(`http://diaries.app/diaries/entries/`,{
                    method:'POST',
                    body:JSON.stringify({title:value[0],content:value[1],diaryId:id,userId:user?.id,username:user?.username})
                })
                
                const {entry,exDiary}=await res.json() as {entry:Entry,exDiary:Diary}
                
                
                return {
                    entry,exDiary
                }
                
            }catch(error){throw(error)}
            
        }
        }).then(async(result:any)=>{
            
            try{
                const res=await fetch(`http://diaries.app/diaries/${id}`,{
                    method:'PUT',
                    body:JSON.stringify({...result.exDiary,updatedAt:result.entry.updatedAt})
                })
                const data=await res.json() as Diary
                setActiveEntry(result.entry)
                dispatch(updateDiary(data))
            }catch(error){throw(error)}
        }
        )
    }
    function updateEntry(activeEntry:Entry){
        const result=swal.mixin({
            input:'text',
            confirmButtonText:'Next &rarr;',
            showCancelButton:true,
            progressSteps:['1','2']
        }).queue([
            {
                titleText:'Entry Title',
                input:'text',
                inputValue:`${activeEntry.title}`
            },
            {
                titleText:'Content?',
                input:'textarea',
                inputValue:`${activeEntry.content}`
                
            }
        ]).then(async(result:any)=>{
            if(result.value){
                const {value}=result
                
                try{
                    const res=await fetch(`http://diaries.app/diaries/entries/${activeEntry.id}`,{
                    method:'PUT',
                    body:JSON.stringify({title:value[0],content:value[1]})
                })
                
                const entry=await res.json() as Entry
                setActiveEntry(entry)
                
                
                
            }catch(error){throw(error)}
            
        }
        })
    }
    return(
        <div className='entries-container'>
            
            {
                Array.isArray(entries) && entries.map((entry,i)=>{
                    let ownEntry=false
                    if(entry.userId===user?.id){
                        ownEntry=true
                    }
                     return (
                         <div key={i} className='entry-card'>
                             <div className='entry-card-title'>
                                <div className='entry-card-title-user'>{entry.username}</div>
                                <div className='entry-card-title-time'>{entry.createdAt}</div>
                                <div className='entry-card-title-title'>{entry.title}</div>
                             </div>
                             <div className='entry-card-content'>
                                 {entry.content}
                             </div>             
                             <div className={`${ownEntry?"entry-card-buttons":""}`}>
                                {ownEntry&&
                                    <button onClick={()=>updateEntry(entry)} key={i}>Edit Entry</button>
                                }
                             </div>
                            
                            
                        </div>
                     )
                    
                })
            }
            <div className='entry-button'>
            <button title="Add New Entry" onClick={handleClick}>+</button>
            </div>
        </div>
    )
}

export default DiaryEntriesList