import {Request,Response} from 'miragejs'
import {handleErrors} from './server'
import dayjs from 'dayjs'
import {Diary,Entry} from '../features/types/types'



const create=(schema:any,req:Request):{entry:Entry,exDiary:Diary}|Response=>{
    const {title,content,diaryId,userId,username}=JSON.parse(req.requestBody)
    const exDiary=schema.diaries.findBy({id:diaryId})

    if(!exDiary){
        return handleErrors(null,'No such diary exists')
    }
    const now=dayjs().format()
    const entry=exDiary.createEntry({
        title,content,createdAt:now,updatedAt:now,userId,username
    })
    
    
    return {
        entry:entry.attrs,
        exDiary:exDiary.attrs
    }
        
    
}
const getEntry=(schema:any,req:Request):(Entry[])|Response=>{
    try{
        const diary=schema.diaries.find(req.params.id)
        return diary.entry as Entry[]
    }catch(error){return handleErrors(null,"Could not get Entries")}
}
const updateEntry=(schema:any,req:Request):Entry|Response=>{
    try{
        const entry=schema.entries.find(req.params.id)
        const data=JSON.parse(req.requestBody)
        const now=dayjs().format()
        entry.update({
            ...data,
            updatedAt:now
        })
        
        return entry.attrs as Entry
    }catch(error){return handleErrors(null,"Unable to Update Entry")}
}
export default{
    create,
    getEntry,
    updateEntry
}