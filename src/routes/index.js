const { Model } = require("sequelize");
const express = require('./user');
import user  from './user';
import auth from './auth'
import  insertData  from './insert';
import { internalServerError,notFound } from '../middlewares/handle_error';
import book from './book';

const initRoutes = (app) => {

    app.use('/api/v1/user', user);
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/insert', insertData);
    app.use('/api/v1/book', book);



    // return app.use('/', (req,res)=>{
    //     return res.send('API is working')
    // })

    app.use(notFound)
};

module.exports = initRoutes;