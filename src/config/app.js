const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const router = require('./../routes/index')
require('./database')

const app = express()

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, "../public")))

require('../routes')(app)


module.exports = app