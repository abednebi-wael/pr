require('dotenv').config()
const express = require("express")
const connectDB = require('./config/connectDB')
const user = require('./routes/user')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

app.use("/user", user)

connectDB()

const port = process.envPORT || process.env.port

app.listen(port , err => {
    err ? console.log(err) : console.log(`server ranning on http://localhost:${port}`)
})

