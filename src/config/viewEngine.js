const path = require('path')
const express = require('express')
const configViewEngine = (app) => {

   // config template 
   app.set("view engine", "ejs");
   app.set("views", path.join('./src', 'view'));
   //config static file 
   app.use(express.static(path.join('./src', 'public')))
}
module.exports = configViewEngine;