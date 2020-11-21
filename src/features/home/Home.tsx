import React from 'react'
import Diaries from './diary/Diaries'
import {useDispatch,useSelector} from 'react-redux'
import {setAuthState} from '../auth/authSlice'
import './Home.css'
import {rootState} from '../../store/store'
import { useEffect,useState } from 'react'
import {User} from '../types/types'
import dForDiary from './images/d.png'


export default function Home(){
    const [allUsersName,setAllUsersName]=useState<User[]>()
    const [toggle,setToggle]=useState(false)
    const currentUserName=useSelector((state:rootState)=>state.user?.username)
    const dispatch=useDispatch()
    function handleLogOut(){
        dispatch(setAuthState(false))
    }
    console.log(toggle,'clicked')
    useEffect(()=>{
        async function getAllUsers(){
            try{
                const res=await fetch(`http://diaries.app/auth/user/all`)
                const data=await res.json()
                const {users}=data as {users:User[]}
                setAllUsersName(users)
            }catch(error){throw(error)}
        }
        getAllUsers()
    },[])
    return(
        <div className='home-container'>
            <div className='home-navbar'>
                <img className='dforDiary'src={dForDiary} alt='Diaries'onClick={()=>setToggle(!toggle)}/>
                <div className='title'>Diaries</div>
                <div className='user-name'>{currentUserName}</div>
                <button onClick={handleLogOut}>Log out</button>

            </div>
            <div className='home-page'>
                

                <div className='diaries-col'>
                    <Diaries toggle={toggle} />
                    
                </div>
                <div className='users-col'>
                    <div>
                        <span>Users</span>
                        {
                            allUsersName?.map((user,i)=>{
                                return(
                                    <div key={i} className={`users ${user.username===currentUserName?'current-user':''}`}>
                                        {user.username}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            
            
        </div>
    )
}