import { Request, Router } from 'express'

import { AppError } from '../errors/AppError'
import { CreateCompleteAnalysisService } from '../services/analysis/CreateCompleteAnalysisService'
import { CreateMiningAnalysisService } from '../services/analysis/CreateMiningAnalysisService'
import { CreateDefaultAnalysisService } from '../services/analysis/CreateDefaultAnalysisService'
import { GetAnalysisService } from '../services/analysis/GetAnalysisService'
import { DeleteAnalysisService } from '../services/analysis/DeleteAnalysisService'
import { GetAnalysisHistoryService } from '../services/analysis/GetAnalysisHistoryService'
import { ListAnalysisService } from '../services/analysis/ListAnalysisService'
import { UpdateAnalysisService } from '../services/analysis/UpdateAnalysisService'

import { ensureAuthenticated, ensureCanDeleteAnalysis, ensureAuthenticatedHistory } from '../middlewares/usersAuth'
import { prisma } from '../database/connection'

const analysisRouter = Router()

interface IQueries {
  videoTitle?: string
  searchBy: 'videoTitle' | 'all'
  orderBy: 'created_at' | 'updated_at' | 'viewCount' | 'videoTitle'
  direction: 'desc' | 'asc'
  analysisType?: 'DEFAULT' | 'MINING' | 'COMPLETE'
  pageNumber: number
}

analysisRouter.get('/', async (request: Request<{}, {}, {}, IQueries>, response) => {
  const { searchBy, orderBy, direction, pageNumber, analysisType, videoTitle } = request.query

  const listAnalysis = new ListAnalysisService()
  const result = await listAnalysis.execute({ searchBy, orderBy, pageNumber, direction, analysisType, videoTitle })

  return response.json(result)
})

analysisRouter.post('/', ensureAuthenticated, async (request, response) => {
  const {
    videoId,
    type = 'default',
    options,
    privacy,
    save = false
  } = request.body
  const { id } = request.user

  if (typeof (videoId) !== 'string' || !options) {
    throw new AppError('Invalid query')
  }

  if (type === 'mining') {
    const createAnalysis = new CreateMiningAnalysisService()
    const analysis = await createAnalysis.execute({ videoId, userId: id, save, options, type: 'mining', privacy })

    return response.json(analysis)
  }

  if (type === 'default') {
    const createAnalysis = new CreateDefaultAnalysisService()
    const analysis = await createAnalysis.execute({ videoId, userId: id, save, options, type: 'default', privacy })

    return response.json(analysis)
  }

  if (type === 'complete') {
    const createAnalysis = new CreateCompleteAnalysisService()
    const analysis = await createAnalysis.execute({ videoId, userId: id, save, options, type: 'complete', privacy })

    return response.json(analysis)
  }

  throw new AppError('Invalid query')
})

analysisRouter.patch('/:id/privacy', ensureAuthenticated, ensureCanDeleteAnalysis, async (request, response) => {
  const { id: analysisId } = request.params
  const { privacy } = request.body

  const result = await prisma.analysis.update({
    where: {
      id: analysisId
    },
    data: {
      privacy: privacy === 'private' ? 'public' : 'private'
    },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true
        }
      },
      requestData: true,
      videoData: true,
      content: true,
      viewCount: true,
      privacy: true,
      created_at: true,
      updated_at: true
    }
  })

  return response.json(result)
})

analysisRouter.patch('/:id/views', async (request, response) => {
  const { id: analysisId } = request.params
  const { views } = request.body

  const result = await prisma.analysis.update({
    where: {
      id: analysisId
    },
    data: {
      viewCount: parseInt(views) + 1
    },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true
        }
      },
      requestData: true,
      videoData: true,
      content: true,
      viewCount: true,
      privacy: true,
      created_at: true,
      updated_at: true
    }
  })

  return response.json(result)
})

analysisRouter.get('/history', ensureAuthenticatedHistory, async (request: Request<{}, {}, {}, IQueries>, response) => {
  const { searchBy, orderBy, direction, pageNumber, analysisType } = request.query
  const { id } = request.user

  const getHistory = new GetAnalysisHistoryService()
  const result = await getHistory.execute({ userId: id, searchBy, orderBy, pageNumber, direction, analysisType })

  return response.json(result)
})

analysisRouter.get('/:id', async (request, response) => {
  const { id } = request.params
  const getAnalysis = new GetAnalysisService()

  const analysis = await getAnalysis.execute({ id })

  return response.json(analysis)
})

analysisRouter.put('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params

  const updateAnalysis = new UpdateAnalysisService()

  const { updatedAnalysis } = await updateAnalysis.execute({ id })

  console.log('updated analysis', updatedAnalysis)

  return response.json(updatedAnalysis)
})

analysisRouter.delete('/:id', ensureAuthenticated, ensureCanDeleteAnalysis, async (request, response) => {
  const { id } = request.params
  const deleteAnalysis = new DeleteAnalysisService()

  const deletedAnalysis = await deleteAnalysis.execute({ id })

  return response.json(deletedAnalysis)
})

export { analysisRouter }
