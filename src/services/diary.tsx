import {Request,Response} from 'miragejs'
import {handleErrors} from './server'
import dayjs from 'dayjs'
import {User,Diary} from '../features/types/types'


const create=(schema:any,req:Request):Diary|Response=>{
    
    const {title,type,userId}=JSON.parse(req.requestBody)
    const exUser=schema.users.findBy({id:userId})
    
    if(!exUser){
        handleErrors(null,'No such user exists')
    }
    const now=dayjs().format()
    const diary=exUser.createDiary({
        title,type,createdAt:now,updatedAt:now
    })
    
    return diary.attrs
        
    
}
const updateDiary=(schema:any,req:Request):Diary|Response=>{
    try{
        const diary=schema.diaries.find(req.params.id)
        const data=JSON.parse(req.requestBody)
        // const now=dayjs().format()
        
            diary.update(data)
        
        
        
        return diary.attrs as Diary
    }catch(error){return handleErrors(null,"Unable to Update diary")}
}
const getDiary=(schema:any,req:Request):Diary[]|Response=>{
    try{
        const user=schema.users.find(req.params.id)
        return user.diary as Diary[]
    }catch(error){return handleErrors(null,"Could not get user diaries")}
}
export default{
    create,
    getDiary,
    updateDiary
} 