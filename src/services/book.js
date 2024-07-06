import { Model, where } from 'sequelize'
import db from '../models/index.js'
import {v4 as generateId} from 'uuid'
import { defaults } from 'joi'
import { filename, image } from '../helpers/joi_schema.js'
const cloudinary = require('cloudinary').v2;
const { Op } = require('sequelize');


export const getBooks=({ page, limit, order, name, available, ...query })=> new Promise( async (resolve,reject)=>{
    try{
        
    
         const queries={raw:true,nest:true}
        const offset=(!page || +page<=1) ? 0 : (+page -1);
        const flimit= +limit || +process.env.LIMIT_BOOK
        queries.offset=offset * flimit
        queries.limit=flimit
      console.log("queries", queries);
        if(order) queries.order=[order]
        console.log("query",query); 
        if(name) query.title={ [Op.substring]: name }
  
        if(available) query.available= {[Op.between]: available}

       const response= await db.Book.findAndCountAll({

        where: query,
        ...queries,
        attributes:{
            exclude: ['category_code']
        },
        include: [
           { model: db.Category,
            attributes:{
            exclude: ['createdAt','updatedAt']
           },as: 'categoryData'}
            
           
        ]
       })

  resolve({
    
        err: response ? 0 : 1,
        mess:response ? 'Got' : 'Cannot found books', 
        bookData: response
    })
 } catch(error){
        reject(error)
    }
    })
//create

export const createNewBook=(body,fileData)=> new Promise( async (resolve,reject)=>{
    try{
    


       const response= await db.Book.findOrCreate({
       where: {title: body?.title},
       defaults:{
        ...body,
        id: generateId(),
        image:fileData?.path,
        filename:fileData?.filename
       }
       
       })
    //    console.log(response);

  resolve({
    
        err: response[1] ? 0 : 1,
        mess:response[1] ? 'Created' : 'Cannot create new book', 
        data: response[1]?response[0]:null
        
    })
    if(fileData && response[1]) cloudinary.uploader.destroy(fileData.filename);

} catch(error){
        reject(error)
        if(fileData) cloudinary.uploader.destroy(fileData.filename);

    }
    })
//update
export const updateBook=({id,...body},fileData)=> new Promise( async (resolve,reject)=>{
    try{
       
        if(fileData){
         body.image=fileData?.path
            
        }
        const response= await db.Book.update(body,{
    
            where:{id:body.bid}
        })
        resolve({
            err: response[0]>0 ? 0 : 1,
            mess:response[0]>0 ? `Updated ${response[0]} book` : 'Cannot update book/id book not found', 
            data: response[0]
        })
        if(fileData&& response[0]===0) cloudinary.uploader.destroy(fileData.filename);
    } catch(error){
        reject(error)
        if(fileData) cloudinary.uploader.destroy(fileData.filename);

    }
    })
//delete
export const deleteBook=(bids,filename)=> new Promise( async (resolve,reject)=>{
    
    try{
        console.log("bids",bids,filename);
        const response= await db.Book.destroy({
            where:{id: bids}
        })
        resolve({
            err: response>0 ? 0 : 1,
            mess:response>0 ? `Deleted ${response} book` : 'Cannot delete book/id book not found', 
            data: response
        })
 cloudinary.api.delete_resources(filename);
    } catch(error){
        reject(error);
       

    }
    })