import { where } from 'sequelize';
import db from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { notAuth } from '../middlewares/handle_error';




const hasdPassword= password => bcrypt.hashSync(password,bcrypt.genSaltSync(8));

export const register=({email,password})=> new Promise( async (resolve,reject)=>{
try{
const response= await db.User.findOrCreate({

    where:{email},
    defaults:{
        email,
        password:hasdPassword(password)
    }
})
const accesstoken=response[1] 
?jwt.sign({id:response[0].id,email:response[0].email,role_code:response[0].role_code},process.env.JWT_SECRET,{expiresIn:'30s'})
:null
//JWT_refresh_token
// const access_token
const refreshtoken=response[1] 
?jwt.sign({id:response[0].id},process.env.JWT_SECRET_REFRESH,{expiresIn:'15d'})
:null

resolve({

    err: response[1] ? 0 : 1,
    mess: response[1] ? 'register success' : 'email already exist',
    'access_token': accesstoken?`Bearer ${accesstoken}` : accesstoken,
    'refresh_token':  refreshtoken
})


if(refreshtoken){
    await db.User.update(
        {refresh_token:refreshtoken},
        {where:{id:response[0].id}})


}
}catch(error){
    reject(error)
    

}
})
//login


export const login=({email,password})=> new Promise( async (resolve,reject)=>{
    try{
    const response= await db.User.findOne({
    
        where:{email},
       raw:true
    })
   const isChecked= response && bcrypt.compareSync(password,response.password)
   const token=isChecked ?jwt.sign({id:response.id,email:response.email,role_code:response.role_code},process.env.JWT_SECRET,{expiresIn:'30s'}):null
   //JWT_refresh_token
// const access_token
const refreshtoken=isChecked 
?jwt.sign({id:response.id},process.env.JWT_SECRET_REFRESH,{expiresIn:'15d'})
:null

   
   resolve({
    
        err: token ? 0 : 1,
        mess: token ? 'login success' : response ? 'password incorrect' : 'email not found',
        'access_token': token?`Bearer ${token}` :null,
        'refresh_token':  refreshtoken
    })
    
    
    if(refreshtoken){
        await db.User.update(
            {refresh_token:refreshtoken},
            {where:{id:response.id}})
    
    
    } 
    }catch(error){
        reject(error)
        
    
    }
    })


    
export const refreshToken=(refresh_token)=> new Promise( async (resolve,reject)=>{
    try{
    const response= await db.User.findOne({
    
        where:{refresh_token},
       raw:true
    })
    if(response){
        jwt.verify(refresh_token,process.env.JWT_SECRET_REFRESH,(err)=>{
       
       if(err)
      {
        resolve({
        
            err: 1,
            mess: 'refresh token expired',
      })

    }
    else
   {
    const accessToken=jwt.sign({id:response.id,email:response.email,role_code:response.role_code},process.env.JWT_SECRET,{expiresIn:'30s'})
  
    resolve({
    
        err: accessToken ?0:1,
        mess: accessToken ? 'OK' :'Fail to generate access token',
        'access_token': accessToken,
        'refresh_token':  refresh_token
    })
}
})
        
    } }
    catch(error){
        reject(error)
        
    
    }
    })