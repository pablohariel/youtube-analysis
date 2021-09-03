import { Router } from 'express'
import { Analysis } from '@prisma/client'

import { AppError } from '../errors/AppError'
import { CreateCustomAnalysisService } from '../services/analysis/CreateCustomAnalysisService'
import { CreateMiningAnalysisService } from '../services/analysis/CreateMiningAnalysisService'
import { CreateDefaultAnalysisService } from '../services/analysis/CreateDefaultAnalysisService'
import { GetAnalysisService } from '../services/analysis/GetAnalysisService'
import { DeleteAnalysisService } from '../services/analysis/DeleteAnalysisService'
import { GetAnalysisHistoryService } from '../services/analysis/GetAnalysisHistoryService'
import { ListAnalysisService } from '../services/analysis/ListAnalysisService'

import { ensureAuthenticated, ensureCanDeleteAnalysis } from '../middlewares/usersAuth'

const analysisRouter = Router()

analysisRouter.get('/', async (request, response) => {
  const { videoId, videoTitle, channelTitle } = request.query
  const listAnalysis = new ListAnalysisService()

  let analysis: Analysis[] = []
  if (typeof (videoId) === 'string' || typeof (videoId) === 'undefined') {
    if (typeof (videoTitle) === 'string' || typeof (videoTitle) === 'undefined') {
      if (typeof (channelTitle) === 'string' || typeof (channelTitle) === 'undefined') {
        analysis = await listAnalysis.execute({ videoId, videoTitle, channelTitle })
      }
    }
  }

  if (analysis.length < 1) {
    throw new AppError('No analysis found', 404)
  }

  return response.json(analysis)
})

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

analysisRouter.get('/history', ensureAuthenticated, async (request, response) => {
  const { id } = request.user

  const getHistory = new GetAnalysisHistoryService()

  const history = await getHistory.execute({
    userId: id
  })

  return response.json(history)
})

analysisRouter.get('/:id', async (request, response) => {
  const { id } = request.params
  const getAnalysis = new GetAnalysisService()

  const analysis = await getAnalysis.execute({ id })

  return response.json(analysis)
})

analysisRouter.delete('/:id', ensureAuthenticated, ensureCanDeleteAnalysis, async (request, response) => {
  const { id } = request.params
  const deleteAnalysis = new DeleteAnalysisService()

  const deletedAnalysis = await deleteAnalysis.execute({ id })

  return response.json(deletedAnalysis)
})

export { analysisRouter }
