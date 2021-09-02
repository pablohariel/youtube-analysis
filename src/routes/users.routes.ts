import { Router } from 'express'

import { CreateUserService } from '../services/user/CreateUserService'
import { UpdateUserService } from '../services/user/UpdateUserService'
import { GetUserService } from '../services/user/GetUserService'
import { GetUsersService } from '../services/user/GetUsersService'
import { DeleteUserService } from '../services/user/DeleteUserService'
import { GetAnalysisHistoryService } from '../services/analysis/GetAnalysisHistoryService'

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
  const getUsers = new GetUsersService()

  const users = await getUsers.execute()

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

usersRouter.get('/:id/history', async (request, response) => {
  const { id } = request.params

  const getHistory = new GetAnalysisHistoryService()

  const history = await getHistory.execute({
    userId: id
  })

  return response.json(history)
})

export { usersRouter }
