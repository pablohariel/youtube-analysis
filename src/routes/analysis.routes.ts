import { Router } from 'express'

import { AppError } from '../errors/AppError'
import { CreateCustomAnalysisService } from '../services/analysis/CreateCustomAnalysisService'
import { CreateMiningAnalysisService } from '../services/analysis/CreateMiningAnalysisService'
import { CreateDefaultAnalysisService } from '../services/analysis/CreateDefaultAnalysisService'
import { GetAnalysisService } from '../services/analysis/GetAnalysisService'

import { ensureAuthenticated } from '../middlewares/usersAuth'

const analysisRouter = Router()

analysisRouter.post('/', ensureAuthenticated, async (request, response) => {
  const { type = 'default', videoId = '', save = 'false' } = request.query

  const { id: userId } = request.user
  const isToSave = save === 'true'

  if (typeof (videoId) === 'string') {
    const { usersMood = 'true', mostCommentedWords = 'true' } = request.query
    const { words = [] } = request.body

    if (type === 'custom') {
      const createAnalysis = new CreateCustomAnalysisService()

      const getMood = usersMood === 'true'
      const getMostCommentedWords = mostCommentedWords === 'true'

      const analysis = await createAnalysis.execute({ videoId, requestedWords: words, getMood, getMostCommentedWords, save: isToSave, userId })

      return response.json(analysis)
    }

    if (type === 'mining') {
      const createAnalysis = new CreateMiningAnalysisService()

      const getMostCommentedWords = mostCommentedWords === 'true'

      const analysis = await createAnalysis.execute({ videoId, requestedWords: words, getMostCommentedWords, save: isToSave, userId })

      return response.json(analysis)
    }

    if (type === 'default') {
      const createAnalysis = new CreateDefaultAnalysisService()

      const getMood = usersMood === 'true'

      const analysis = await createAnalysis.execute({ videoId, getMood, save: isToSave, userId })

      return response.json(analysis)
    }
  }

  throw new AppError('Invalid query')
})

analysisRouter.get('/:id', async (request, response) => {
  const { id } = request.params
  const getAnalysis = new GetAnalysisService()

  const analysis = await getAnalysis.execute({ id })

  return response.json(analysis)
})

export { analysisRouter }
