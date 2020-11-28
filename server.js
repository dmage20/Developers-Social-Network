const express = require('express')
const connectDB = require('./db/mongoose')
const usersRouter = require('./routes/api/users')
const postsRouter = require('./routes/api/posts')
const authRouter = require('./routes/api/auth')
const profileRouter = require('./routes/api/profile')

const app = express()
app.use(express.json())
connectDB()
const PORT = process.env.PORT || 5000
app.use(usersRouter)
app.use(postsRouter)
app.use(authRouter)
app.use(profileRouter)




app.listen(PORT, ()=>{
    console.log('server listening on ' + PORT)
})

app.get('/', (req, res)=>{
    res.send('API is running')
})