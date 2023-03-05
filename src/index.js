const express = require('express')
const path = require('path')
require('dotenv').config()
const configViewEngine = require('./config/viewEngine')
const webRouters = require('./routes/web')
const connection = require('./config/database')

const app = express()
const port = process.env.PORT || 8000
const hostname = process.env.HOST_NAME

// config template - config static file 
configViewEngine(app)


// middleware- config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));     // for application/x-www-form-urlencode


// route
app.use('/', webRouters);


//connect database
connection();

app.listen(port, hostname, () => {
   console.log(`App listening on port :${port} , ${hostname}`)
})

