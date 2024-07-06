import * as services from '../services';
import { internalServerError,badRequest } from '../middlewares/handle_error';
import { title,image,category_code,price,available,bid,bids,filename } from '../helpers/joi_schema';
import joi from 'joi';
const cloudinary = require('cloudinary').v2;

export const getBooks= async (req, res) => {
   
    try {
        console.log("role",req.file);
        const response = await services.getBooks(req.query);

        return res.status(200).json(response);
        
    } catch (error) {

        return internalServerError(res);
    }
    };
//create
export const createNewBook= async (req, res) => {
    try {
        const fileData = req.file;
        console.log(fileData);
           const { error } = joi.object({ title,image,category_code,price,available }).validate({ ...req.body,image:fileData?.path });
           if(error) {
            if(fileData)
            console.log(error.details[0].message);
            cloudinary.uploader.destroy(fileData.filename);
            return badRequest(error.details[0].message,res);
           }
           
        const response = await services.createNewBook(req.body,fileData);
         
        return res.status(200).json(response);
        
    } catch (error) {

        return internalServerError(res);
    }
    };
//update
export const updateBook= async (req, res) => {

    // console.log(req.user.role);
    try {
        console.log(req.user);
        const fileData = req.file;
        const { error } = joi.object({bid }).validate({bid:req.body.bid });
        console.log(req.body.bid);
        if(error) {
            console.log(error.details[0].message);
            if(fileData)
            
            cloudinary.uploader.destroy(fileData.filename);
            return badRequest(error.details[0].message,res);
        }
        console.log("fileData",fileData);
        console.log("req.body",req.body);
        const response = await services.updateBook(req.body,req.body.filename);
        // console.log("response",response);
        return res.status(200).json(response);
        
    } catch (error) {

        return internalServerError(res);
    }
    };
    // delete book

    export const deleteBook= async (req, res) => {

        try {
          
           
            const { error } = joi.object({bids ,filename}).validate(req.query );
            console.log("bids",req.query);
            if(error) {
               
                console.log("erroer",error.details[0].message);
                if(filename)
            
                cloudinary.uploader.destroy(filename);
                return badRequest(error.details[0].message,res);
            }
         
            // console.log("req.body",req);
        
            const response = await services.deleteBook(req.query.bids,req.query.filename);
            // // // console.log("response",response);
            return res.status(200).json(response);
            
        } catch (error) {
            console.error("Internal server error: ", error);
            return internalServerError(res);
        }
        };