import * as services from '../services';
import { internalServerError,badRequest } from '../middlewares/handle_error';




export const insertData = async (req, res) => {
    try {

        
        const response = await services.insertData();
        console.log(response);
        return res.status(200).json(response);
        
    } catch (error) {

        return internalServerError(res);
    }
    };