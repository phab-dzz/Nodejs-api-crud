import createrError from 'http-errors';

export const badRequest = (err, res) => {
    const error= createrError.BadRequestRequest(err);
    // res.status(error.status).json({error});

    return res.status(error.status).json({
        err:1,
        mes:error.message


    });

    }

 export const internalServerError= (res) => {
        const error= createrError.InternalServerError();
        // res.status(error.status).json({error});
    
        return res.status(error.status).json({
            err:-1,
            mes:error.message
    
    
        });
    
        }
export const notFound = (req, res) => {
    const error=createrError.NotFound('This route does not exist');
    return res.status(error.status).json({
        err:1,
        mes:error.message
    });
}

export const notAuth = (err, res,isExpired) => {
    const error=createrError.Unauthorized(err);
    return res.status(error.status).json({
        err:isExpired ? 2 : 1,
        mes:error.message
    });
}