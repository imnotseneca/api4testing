import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
const app = express()
app.use(json())
app.use(corsMiddleware())

const PORT = process.env.PORT ?? 1233

app.disable('x-powered-by')

app.use('/movies', moviesRouter)

app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`)
})
