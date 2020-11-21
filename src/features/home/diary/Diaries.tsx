import React,{useState} from 'react'
import swal from 'sweetalert2'
import {useSelector,useDispatch} from 'react-redux'
import {rootState} from '../../../store/store'
import {addDiary} from './diarySlice'
import DiaryTile from './DiaryTile'
import { useEffect } from 'react'
import {User,Diary} from '../../types/types'
import DiaryEntriesList from './DiaryEntriesList'
import './Diaries.css'
import {setEntries} from '../entry/entrySlice'





const Diaries:React.FC<{toggle:boolean}>=({toggle})=>{
    const [showDiaryEntries,setShowDiaryEntries]=useState(false)
    const [activeDiaryId,setActiveDiaryId]=useState('')
    const [userDiaryIds,setUserDiaryIds]=useState<string[]|null>()
    const [activeDiary,setActiveDiary]=useState<Diary>()
    const user=useSelector((state:rootState)=>state.user)
    const diaries=useSelector((state:rootState)=>state.diaries)
    const entries=useSelector((state:rootState)=>state.entries)
    const dispatch=useDispatch()
    
    useEffect(()=>{
        
        const fetchDiaries=async()=>{
            
                const res=await fetch(`http://diaries.app/diaries/${user?.id}`)
                const data=await res.json()
                
                const {diaries}=data as {diaries:Diary[]}
                
                if(diaries&&diaries.length>0)
                {
                    
                    dispatch(addDiary(diaries))
                    
                }
            }
        fetchDiaries()                
    },[user,activeDiary,entries,diaries,dispatch])
    useEffect(()=>{
        const getUser=async()=>{
            const res=await fetch(`http://diaries.app/auth/user/${user?.id}`)
            const data=await res.json() as User
            const {diaryIds}=data
            setUserDiaryIds(diaryIds)
        }
        getUser()
    },[activeDiary,user?.id])

    const createDiary=async()=>{
        const result=await swal.mixin({
            input:'text',
            confirmButtonText:'Next &rarr;',
            showCancelButton:true,
            progressSteps:['1']
        }).queue([
            {
                titleText:'Diary Title',
                input:'text'
            },
            
        ]).then(async(result:any)=>{
            if(result.value){
                const {value}=result
                try{
                    const res=await fetch(`http://diaries.app/diaries/`,{
                    method:'POST',
                    body:JSON.stringify({title:value[0],type:value[1],userId:user?.id})
                    
                })
                const data=await res.json() as Diary
                
                
                setActiveDiary(data)
                
                } catch(error){throw(error)}
            }
        })
        
        // Swal.fire({
        //     titleText:"Cancelled"
        // })
    }
    function clearEntries(){
        
            
        dispatch(setEntries([] as null[]))
        
    }
    function setDiary(id:string){
        
        if(id!==activeDiaryId){
            setShowDiaryEntries(false)
            setActiveDiaryId(id)
            clearEntries()
            setShowDiaryEntries(true)
        }
    }
    return(
        <div className='diaries-container'>
            
            
                    
                <div className={`${toggle?'toggle':''} diaries`}>
                    <span>Diaries List</span>
                    <div className='diaries-buttons'>
                        <button onClick={createDiary}>Create New Diary</button>
                    </div>                        
                    <div>
                        {

                            diaries.map((diary,i)=>{
                                let ownDiary=-1
                                if(userDiaryIds&&userDiaryIds.length>0){
                                    ownDiary=userDiaryIds?.findIndex((id)=>id===diary.id) 
                                }
                             
                             return(
                                <DiaryTile diary={diary} key={i} setDiary={setDiary} canEdit={ownDiary===-1?false:true}/>
                            )
                            })
                        }
                    </div>
                </div>
                <div className='entries'>
                    
                {
                    showDiaryEntries&&
                    <DiaryEntriesList id={activeDiaryId}/>
                }
                </div>
        </div>
    )
}
export default Diaries