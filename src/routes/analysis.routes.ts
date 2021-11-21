import { Router } from 'express'

import { AppError } from '../errors/AppError'
// import { CreateCustomAnalysisService } from '../services/analysis/CreateCustomAnalysisService'
import { CreateMiningAnalysisService } from '../services/analysis/CreateMiningAnalysisService'
import { CreateDefaultAnalysisService } from '../services/analysis/CreateDefaultAnalysisService'
import { GetAnalysisService } from '../services/analysis/GetAnalysisService'
import { DeleteAnalysisService } from '../services/analysis/DeleteAnalysisService'
import { GetAnalysisHistoryService } from '../services/analysis/GetAnalysisHistoryService'
import { ListAnalysisService } from '../services/analysis/ListAnalysisService'

import { ensureAuthenticated, ensureCanDeleteAnalysis } from '../middlewares/usersAuth'
import { IDefaultAnalysis, IMiningAnalysis } from '../interfaces/analysis'

const analysisRouter = Router()

analysisRouter.get('/', async (request, response) => {
  const { videoId, videoTitle, channelTitle } = request.query
  const listAnalysis = new ListAnalysisService()

  let analysis: (IDefaultAnalysis | IMiningAnalysis)[] = []
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

// put ensureAuthenticated on release
analysisRouter.post('/', async (request, response) => {
  const {
    videoId,
    type = 'default',
    options,
    save = false
  } = request.body

  if (typeof (videoId) !== 'string' || !options) {
    throw new AppError('Invalid query')
  }

  if (type === 'mining') {
    const createAnalysis = new CreateMiningAnalysisService()
    const analysis = await createAnalysis.execute({ videoId, userId: '613201b800bb0e8800464192', save, options, type: 'mining' })

    return response.json(analysis)
  }

  if (type === 'default') {
    const createAnalysis = new CreateDefaultAnalysisService()
    const analysis = await createAnalysis.execute({ videoId, userId: '613201b800bb0e8800464192', save, options, type: 'default' })

    return response.json(analysis)
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
