
require('dotenv').config()

import express from 'express'
import configViewEngine from './config/viewEngine'
import connection from './config/database'
import initRoutes from './routes/index'
import bodyParser from 'body-parser';

const app = express()
const port = process.env.PORT || 8000
const hostname = process.env.HOST_NAME

// config template - config static file 
configViewEngine(app)


// middleware- config req.body
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
// app.use(upload.array());

// route
initRoutes(app)


//connect database
connection();

app.listen(port, hostname, () => {
   console.log(`App listening on port :${port} , ${hostname}`)
})

