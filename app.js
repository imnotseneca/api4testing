const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8000'
    ]
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed By CORS'))
  }
}))

const moviesList = require('./movies.json')
const PORT = process.env.PORT ?? 8000
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

app.disable('x-powered-by')
app.use(express.json())

app.get('/', (req, res) => {
  return res.json(moviesList)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesList.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.get('/movies', (req, res) => {
  res.header('Access-Control-Alow-Origin', '*')
  const { genre } = req.query // Recuperar el parámetro 'genre' de la URL
  if (!genre) {
    return res.status(400).json({ error: 'Genre query parameter is required' })
  }

  // Filtrar las películas según el género
  const filteredMovies = moviesList.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
  if (filteredMovies.length === 0) {
    return res.status(404).json({ message: 'No movies found for the specified genre.' })
  }

  res.json(filteredMovies)
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(422).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  moviesList.push(newMovie)
  res.status(201).json({
    message: 'Movie successfully created',
    newMovie
  })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = moviesList.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  const updateMovie = {
    ...moviesList[movieIndex],
    ...result.data
  }

  moviesList[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.listen(PORT, () => {
  console.log(`Escuchando en http:localhost:${PORT}`)
})
