import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'
export const moviesRouter = Router()

moviesRouter.get('/', MovieController.getAll)
moviesRouter.post('/', MovieController.createMovie)

moviesRouter.get('/:id', MovieController.getById)
moviesRouter.patch('/:id', MovieController.updateMovie)
moviesRouter.delete('/:id', MovieController.deleteMovie)
