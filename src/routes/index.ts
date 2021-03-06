import { Router } from 'express'

import { usersRouter } from './users.routes'
import { sessionsRouter } from './sessions.routes'
import { analysisRouter } from './analysis.routes'
import { videosRouter } from './videos.routes'
import { emailRouter } from './email.routes'

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/analysis', analysisRouter)
routes.use('/videos', videosRouter)
routes.use('/contact', emailRouter)

export { routes }
