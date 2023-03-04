const express = require('express')
const path = require('path')
require('dotenv').config()
const configViewEngine = require('./config/viewEngine')
const webRouters = require('./routes/web')


const app = express()
const port = process.env.PORT || 8000
const hostname = process.env.HOST_NAME

// config template - config static file 
configViewEngine(app)

// route
app.use('/', webRouters);




app.listen(port, hostname, () => {
   console.log(`App listening on port :${port} , ${hostname}`)
})

