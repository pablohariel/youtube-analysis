import { Router } from 'express'

import { CreateUserService } from '../services/user/CreateUserService'
import { UpdateUserService } from '../services/user/UpdateUserService'
import { GetUserService } from '../services/user/GetUserService'
import { ListUserService } from '../services/user/ListUserService'
import { DeleteUserService } from '../services/user/DeleteUserService'

import { ensureAuthenticated, secureUserPermission } from '../middlewares/usersAuth'

const usersRouter = Router()

usersRouter.get('/:id', ensureAuthenticated, secureUserPermission, async (request, response) => {
  const { id } = request.params

  const getUser = new GetUserService()

  const user = await getUser.execute({
    id
  })

  return response.json(user)
})

usersRouter.get('/', ensureAuthenticated, async (request, response) => {
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

usersRouter.put('/:id', ensureAuthenticated, secureUserPermission, async (request, response) => {
  const { id } = request.params
  const { name } = request.body

  const updateUser = new UpdateUserService()

  const updatedUser = await updateUser.execute({ id, name })

  return response.status(201).json(updatedUser)
})

usersRouter.delete('/:id', ensureAuthenticated, secureUserPermission, async (request, response) => {
  const { id } = request.params

  const deleteUser = new DeleteUserService()

  const deletedUser = await deleteUser.execute({
    id
  })

  return response.json(deletedUser)
})

export { usersRouter }
