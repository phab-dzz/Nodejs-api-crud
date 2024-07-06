import { internalServerError,badRequest } from "../middlewares/handle_error";
import * as services from "../services";
import { email,password,refreshToken } from "../helpers/joi_schema";
import joi from 'joi';


export const register = async (req, res) => {
try {
    // const {email, password} = req.body;
    // console.log(email, password)
    // if(!email || !password){
    //     return res.status(400).json({
    //         err: 1,
    //         mes: 'Missing required fields'
    //     });
    // }
    const {error} = joi.object({email,password}).validate(req.body);
    console.log(error);
    if(error){
       
        return badRequest(error.details[0]?.message,res);
    }
      
    
    const response = await services.register(req.body);
    return res.status(200).json(response);
    
} catch (error) {
    // return res.status(500).json({
    //  err:-1,
    //  mes:'Iternal server error'
        
    //     });
    return internalServerError(res);
}
};

export const login = async (req, res) => {
    try {
        const {error} = joi.object({email,password}).validate(req.body);
        console.log(error);
        if(error){
           
            return badRequest(error.details[0]?.message,res);
        }
          
        const response = await services.login(req.body);
        return res.status(200).json(response);
        
    } catch (error) {
        // return res.status(500).json({
        //  err:-1,
        //  mes:'Iternal server error'
            
        //     });
        return internalServerError(res);
    }
    };

    
export const refreshTokenController= async (req, res) => {
    try {
        const {error} = joi.object({refreshToken}).validate(req.body);
        console.log(error);
        if(error){          
            return badRequest(error.details[0]?.message,res);
        }
          
        const response = await services.refreshToken(req.body.refreshToken);
        return res.status(200).json(response);
        
    } catch (error) {
        // return res.status(500).json({
        //  err:-1,
        //  mes:'Iternal server error'
            
        //     });
        return internalServerError(res);
    }
    };