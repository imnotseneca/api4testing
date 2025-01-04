import readJSON from '../utils/readJSON.js'
import { randomUUID } from 'node:crypto'

const moviesList = readJSON('../movies.json')

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      return moviesList.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    }
    return moviesList
  }

  static async getById ({ id }) {
    if (!id) {
      return 'id query parameter is required'
    }
    const movie = moviesList.find(movie => movie.id === id)
    return movie
  }

  static async createMovie ({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }

    moviesList.push(newMovie)

    return newMovie
  }

  static async deleteMovie ({ id }) {
    const movieIndex = moviesList.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return false
    }
    moviesList.splice(movieIndex, 1)
    return true
  }

  static async updateMovie ({ id, input }) {
    const movieIndex = moviesList.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return false
    }
    moviesList[movieIndex] = {
      ...moviesList[movieIndex],
      ...input
    }
    return moviesList[movieIndex]
  }
}
