import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { errorMiddleware } from './middlewares/error-middleware'
import router from './routes/index'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/api/v1', router)

app.use(errorMiddleware)

export default app
