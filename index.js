// const express= require('express');
// const cors = require('cors');
import express from 'express';
import cors from 'cors';
require('dotenv').config();
const initRoutes = require('./src/routes/index');
require('./connection_database');
const app = express();
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        modethods: ['GET', 'POST','PUT','DELETE'],
        credentials: true
    }
))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// vd roui
initRoutes(app);

const PORT= process.env.PORT || 8000;
 const listener = app.listen(PORT, () => {
    console.log('Server is running on port'+ listener.address().port)
});