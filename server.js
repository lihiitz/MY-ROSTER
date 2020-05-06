const express = require('express')
const bodyParser = require(`body-parser`)
const api = require(`./server/routes/api`)
const path = require(`path`)
///////////////////////////
const app = express()
////////////////////////////
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, `dist`)))
app.use(express.static(path.join(__dirname, `node_modules`)))
app.use(`/`, api)
//////////////////////


///////////////////////////////////
const port = 3000
app.listen(port, function () {
    console.log("listening");

})