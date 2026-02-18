import express from 'express'
import dotenv from 'dotenv'
import authRouter from './Routes/auth.routes.js'
import messageRouter from './Routes/message.routes.js'
import path from 'path'

dotenv.config()

const app = express()
const __dirname = path.resolve()

const PORT = process.env.PORT || 3000

// app.get('/', (req,res) => {
//   res.send('Hello World')
// }
// )

app.use('/api/auth', authRouter)
app.use('/api/messages', messageRouter)

//make ready for deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get('*', (_,res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  }
  )
}

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
}
)