import { Router } from 'express'

import { AppError } from '../errors/AppError'
import { CreateRecommendedAnalysisService } from '../services/analysis/CreateRecommendedAnalysisService'
import { CreateCompleteAnalysisService } from '../services/analysis/CreateCompleteAnalysisService'
import { CreateMiningAnalysisService } from '../services/analysis/CreateMiningAnalysisService'
import { CreateAnalysisService } from '../services/analysis/CreateAnalysisService'

const analysisRouter = Router()

analysisRouter.post('/', async (request, response) => {
  const { recommended = 'true', videoId = '' } = request.query

  if (typeof (videoId) === 'string') {
    if (recommended === 'true') {
      const createAnalysis = new CreateRecommendedAnalysisService()

      const analysis = await createAnalysis.execute({ videoId })
      return response.json(analysis)
    }
    if (recommended === 'false') {
      const { type = 'complete', usersMood = 'false', mostCommentedWords = 'true' } = request.query
      const { words = [] } = request.body

      if (type === 'complete') {
        const createAnalysis = new CreateCompleteAnalysisService()

        const getMood = usersMood === 'true'
        const getMostCommentedWords = mostCommentedWords === 'true'

        const analysis = await createAnalysis.execute({ videoId, requestedWords: words, getMood, getMostCommentedWords })

        return response.json(analysis)
      }

      if (type === 'mining') {
        const createAnalysis = new CreateMiningAnalysisService()

        const getMostCommentedWords = mostCommentedWords === 'true'

        const analysis = await createAnalysis.execute({ videoId, requestedWords: words, getMostCommentedWords })

        return response.json(analysis)
      }

      if (type === 'analysis') {
        const createAnalysis = new CreateAnalysisService()

        const getMood = usersMood === 'true'

        const analysis = await createAnalysis.execute({ videoId, getMood })

        return response.json(analysis)
      }
    }
  }

  throw new AppError('Invalid query')
})

export { analysisRouter }
