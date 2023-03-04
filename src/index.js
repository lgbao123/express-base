const express = require('express')
const path = require('path')
require('dotenv').config()
const configViewEngine = require('./config/viewEngine')
const webRouters = require('./routes/web')

const app = express()
const port = process.env.PORT || 8000
const hostname = process.env.hostname

// config template - config static file 
configViewEngine(app)

// route
app.use('/v1', webRouters);

app.listen(port, hostname, () => {
   console.log(`Example app listening on port :${port}`)
})

