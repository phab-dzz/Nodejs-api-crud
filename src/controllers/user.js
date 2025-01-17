import * as services from '../services';
import { internalServerError,badRequest } from '../middlewares/handle_error';



export const getCurrent = async (req, res) => {
    try {

        const{id}=req.user;
        
        const response = await services.getOne(id);
        console.log(response);
        return res.status(200).json(response);
        
    } catch (error) {

        return internalServerError(res);
    }
    };
    