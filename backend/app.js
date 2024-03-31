const express=require('express')
const DBConnection=require('./config/DBConnection')
require('dotenv').config()

// DataBase Connection
DBConnection()

// The app
const app=express()

// Middleware
app.use(express.json())

// Routes
app.use('/api/auth',require('./router/authRoute'))

// Running server
const PORT=process.env.PORT || 8000
app.listen(PORT,()=>console.log('Server is running on', process.env.NODE_ENV,'mode, on port: ',process.env.PORT))

