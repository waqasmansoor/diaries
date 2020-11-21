import React, { FormEvent } from 'react'
import { useState } from 'react'
import {useDispatch} from 'react-redux'
import {setUser} from './userSlice'
import {setAuthState} from './authSlice'
import './Auth.css'
import { useCallback } from 'react'


export default function Auth(){
    const [isLogin,setIsLogin]=useState(true)
    
    const [userRequired,setUserRequired]=useState(false)
    const [passRequired,setPassRequired]=useState(false)
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [email,setEmail]=useState('')
    const [userError,setUserError]=useState(false)
    const dispatch=useDispatch()
    
    
    const handleSubmit=useCallback(
        async(e:FormEvent)=>{
            e.preventDefault()
            if(username===''){
                setUserRequired(true)
            }
            else if(password===''){
                setPassRequired(true)
            }
            
            else{
                setUserRequired(false)
                setPassRequired(false)
                let path=isLogin?"auth/login":"auth/signup"
                try{
                    const res=await fetch(`http://diaries.app/${path}`,{
                    method:'POST',
                    body:JSON.stringify({username,password,email})})
                    const resData=await res.json()
                    const {user}=resData
                    if(user){
                        
                        dispatch(setUser(user))
                        dispatch(setAuthState(true))
                    }
                    else{
                        setUserError(true)
                    }
                }catch(error){throw error}
            }

        },[username,password,email,dispatch,isLogin]
    );
    
    
    return(
        <div className="auth-container">
            <div className='diaries-app-title'>
                Diaries <span>App</span>
            </div>
            <div className='auth-form'>
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <input placeholder=" Username" name='username' onChange={(e)=>setUsername(e.target.value)}/>
                    <div className='required-error'>{userRequired?"*required":""}</div>
                    {userError&&
                        <div className="no-user">
                     The user name or password that you've entered doesn't match any account. <span className='no-user-link'onClick={()=>{setUserError(false); setIsLogin(!isLogin);setUserRequired(false);setPassRequired(false)}}>Sign up for an account.</span>
                    </div>}
                    <input type="password" placeholder=" Password" name="password" onChange={(e)=>setPassword(e.target.value)}/>
                    <div className='required-error'>{passRequired?"*required":""}</div>
                    {
                        !isLogin &&  
                        <div className="email-container">
                            <input name="email" placeholder=" Email (optional)" onChange={(e)=>setEmail(e.target.value)}/>
                            
                        </div>
                    }
                    <button type='submit'>
                        {isLogin?'Log In':'Create New Account'}
                    </button>
                    <div className='form-newAccount'>
                        

                        <p onClick={()=>{setIsLogin(!isLogin);setUserError(false);setPassRequired(false);setUserRequired(false)}}>
                            {isLogin?"No Account? Create One":"Already have an Account? Log In"}
                        </p>
                        
                    </div>
                </form>
            </div>
        </div>
    )
}