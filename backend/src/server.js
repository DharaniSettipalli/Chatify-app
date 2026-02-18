import express from 'express'
import dotenv from 'dotenv'
import authRouter from './Routes/auth.routes.js'
import messageRouter from './Routes/message.routes.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req,res) => {
  res.send('Hello World')
}
)

app.use('/api/auth', authRouter)
app.use('/api/messages', messageRouter)

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
}
)