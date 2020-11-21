import React from 'react'

export type User={
    username:string
    password:string
    email:string
    id:string
    diaryIds:string[]|null
}
export type Diary={
    title:string
    id:string
    userId:string
    entryIds:string[]|null
    createdAt:string
    updatedAt:string
}
export type Entry={
    title:string
    content:string
    id:string
    diaryId:string
    createdAt:string
    updatedAt:string
    userId:string
    username:string
}
