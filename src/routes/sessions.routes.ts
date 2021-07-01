import { Router } from 'express'

import { AuthenticateUserService } from '../services/user/AuthenticateUserService'

const sessionsRouter = Router()

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  const authenticateUser = new AuthenticateUserService()

  const { token, user } = await authenticateUser.execute({ email, password })

  return response.status(201).json({
    token,
    user
  })
})

export { sessionsRouter }
