import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Title is required.'
  }),
  year: z.number().int().positive().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number({
    required_error: 'rate is required',
    invalid_type_error: 'rate must be an integer from 0 to 10'
  }).min(0).max(10).default(5),
  poster: z.string().url({ message: 'Poster must have a real URL.' }),
  genre: z.array(z.enum(['Crime', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an array of the enum genres.'
    })

})

export function validateMovie (input) {
  return movieSchema.safeParse(input)
}

export function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}
