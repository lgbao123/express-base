const express = require('express')
const path = require('path')
require('dotenv').config()


const app = express()
const port = process.env.PORT || 8000

// config template 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'view'));
//config static file 
app.use(express.static(path.join(__dirname, 'public')))

// route
app.get('/', (req, res) => {
   res.render('index')
})

app.listen(port, () => {
   console.log(`Example app listening on port :${port}`)
})

console.log(path.join(__dirname));