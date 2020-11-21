import {Response,Server, createServer,Model,hasMany,belongsTo,Factory } from "miragejs"
import user from './user'
import diary from './diary'
import entry from './entry'

export const handleErrors=(error:any,message="An error occurred")=>{
 return new Response(400,undefined,{
   data:{
     message,
     isError:true,
   }
 })
}
export const setupServer=(env?:string):Server=> {

  return new Server({
    environment:env??'development',

    models:{
      entry:Model.extend({
        diary:belongsTo()
      }),
      diary:Model.extend({
        entry:hasMany(),
        user:belongsTo()
      }),
      user:Model.extend({
        diary:hasMany()
      })
      
    },
    factories:{
      user:Factory.extend({
        username:'test',
        password:'password',
        email:'test@email.com'
      })
    },
    seeds(server:any){
        server.create('user')
    },
    routes():void{
      this.urlPrefix='http://diaries.app'

      this.post('/auth/login',user.login)
      this.post('/auth/signup',user.signup)
      this.get('/auth/user/:id',user.getUser)

      this.post('/diaries/',diary.create)
      this.post('/diaries/entries/',entry.create)

      this.get('/diaries/:id',diary.getDiary)
      this.get('/diaries/entries/:id',entry.getEntry)

      this.put('/diaries/:id',diary.updateDiary)
      this.put('/diaries/entries/:id',entry.updateEntry)
    },
  })
}

