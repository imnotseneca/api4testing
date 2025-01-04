import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req?.query // Recuperar el parámetro 'genre' de la URL
    const moviesList = await MovieModel.getAll({ genre })
    res.header('Access-Control-Alow-Origin', '*')

    res.json(moviesList)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })

    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
  }

  static async createMovie (req, res) {
    const result = validateMovie(req.body)
    const newMovie = await MovieModel.createMovie({ input: result.data })

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    res.status(201).json({
      message: 'Movie successfully created',
      newMovie
    })
  }

  static async updateMovie (req, res) {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedMovie = await MovieModel.updateMovie({ id, input: result.data })
    return res.json(updatedMovie)
  }

  static async deleteMovie (req, res) {
    const { id } = req.params
    const result = await MovieModel.deleteMovie({ id })
    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    return res.json({ message: 'Movie deleted.' })
  }
}
