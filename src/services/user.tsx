import {Request,Response} from 'miragejs'
import {handleErrors} from './server'
import {User} from '../features/types/types'


const login=(schema:any,req:Request):{user:User}|Response=>{
    
    const {username,password}=JSON.parse(req.requestBody)
    const user=schema.users.findBy({username})
    if(!user){
        return handleErrors(null,"No user with that username exists")
    }
    if(password!==user.password){
        return handleErrors(null,"Wrong Password")
    }
    return {
        user:user.attrs as User
    }

}
const signup=(schema:any,req:Request):{user:User}|Response=>{
    const data=JSON.parse(req.requestBody)
    
    const exUser=schema.users.findBy({username:data.username})
    if(exUser){
        return handleErrors(null,"User already exist")
    }
    const user=schema.users.create(data)
    
    return {
        user:user.attrs as User
    }
}
const getUser=(schema:any,req:Request):User|{users:User[]}|Response=>{
    try{
        if(req.params.id==='all')
        {
            const users=schema.users.all()
            return users as {users:User[]}
        }
        else{

            const user=schema.users.find(req.params.id)
            return user.attrs as User
        }
    }catch(error){return handleErrors(null,'User not exist')}
}
export default {
    login,signup,getUser
}