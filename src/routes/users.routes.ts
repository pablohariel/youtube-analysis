import { Router } from 'express'

import { CreateUserService } from '../services/user/CreateUserService'
import { UpdateUserService } from '../services/user/UpdateUserService'
import { GetUserService } from '../services/user/GetUserService'
import { ListUserService } from '../services/user/ListUserService'
import { DeleteUserService } from '../services/user/DeleteUserService'
import { AuthenticateUserService } from '../services/user/AuthenticateUserService'

import { ensureAuthenticated, ensureIsTheUser, ensureIsAdmin } from '../middlewares/usersAuth'

const usersRouter = Router()

usersRouter.get('/:id', ensureAuthenticated, ensureIsTheUser, async (request, response) => {
  const { id } = request.params

  const getUser = new GetUserService()

  const user = await getUser.execute({
    id
  })

  return response.json(user)
})

usersRouter.get('/', ensureAuthenticated, ensureIsAdmin, async (request, response) => {
  const listUsers = new ListUserService()

  const users = await listUsers.execute()

  return response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { email, password, name } = request.body

  const createUser = new CreateUserService()

  const user = await createUser.execute({ email, password, name })

  return response.status(201).json(user)
})

usersRouter.put('/:id', ensureAuthenticated, ensureIsTheUser, async (request, response) => {
  const { id } = request.params
  const { name } = request.body

  const updateUser = new UpdateUserService()

  const updatedUser = await updateUser.execute({ id, name })

  return response.status(201).json(updatedUser)
})

usersRouter.delete('/:id', ensureAuthenticated, ensureIsTheUser, async (request, response) => {
  const { id } = request.params
  const { email, password } = request.body

  const authenticateUser = new AuthenticateUserService()

  await authenticateUser.execute({ email, password })

  const deleteUser = new DeleteUserService()

  const deletedUser = await deleteUser.execute({
    id
  })

  return response.json(deletedUser)
})

export { usersRouter }
