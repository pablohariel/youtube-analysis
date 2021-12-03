import { Prisma, Analysis } from '@prisma/client'

import { ICompleteAnalysis, IDefaultAnalysis, IMiningAnalysis } from '../../interfaces/analysis'

import { prisma } from '../../database/connection'
import { AppError } from '../../errors/AppError'

import { CreateDefaultAnalysisService } from '../analysis/CreateDefaultAnalysisService'
import { CreateMiningAnalysisService } from './CreateMiningAnalysisService'
import { CreateCompleteAnalysisService } from './CreateCompleteAnalysisService'

interface Request {
  id: string
}

interface Response {
  updatedAnalysis: Analysis
}

class UpdateAnalysisService {
  public async execute ({ id }: Request): Promise<Response> {
    const analysis = await prisma.analysis.findFirst({
      where: {
        id
      }
    })

    if (analysis) {
      switch (analysis.type) {
        case 'DEFAULT': {
          const { requestData } = analysis as unknown as IDefaultAnalysis
          const createAnalysis = new CreateDefaultAnalysisService()

          const { content, videoData } = await createAnalysis.execute({ ...requestData, save: false })

          const updatedAnalysis = await prisma.analysis.update({
            where: {
              id
            },
            data: {
              content: content as unknown as Prisma.JsonArray,
              videoData: videoData as unknown as Prisma.JsonArray
            },
            select: {
              id: true,
              userId: true,
              type: true,
              videoTitle: true,
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

          return { updatedAnalysis }
        }
        case 'MINING': {
          const { requestData } = analysis as unknown as IMiningAnalysis
          const createAnalysis = new CreateMiningAnalysisService()

          const { content, videoData } = await createAnalysis.execute({ ...requestData, save: false })

          const updatedAnalysis = await prisma.analysis.update({
            where: {
              id
            },
            data: {
              content: content as unknown as Prisma.JsonArray,
              videoData: videoData as unknown as Prisma.JsonArray
            },
            select: {
              id: true,
              userId: true,
              type: true,
              videoTitle: true,
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

          return { updatedAnalysis }
        }
        case 'COMPLETE': {
          const { requestData } = analysis as unknown as ICompleteAnalysis
          const createAnalysis = new CreateCompleteAnalysisService()

          const { content, videoData } = await createAnalysis.execute({ ...requestData, save: false })

          const updatedAnalysis = await prisma.analysis.update({
            where: {
              id
            },
            data: {
              content: content as unknown as Prisma.JsonArray,
              videoData: videoData as unknown as Prisma.JsonArray
            },
            select: {
              id: true,
              userId: true,
              type: true,
              videoTitle: true,
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

          return { updatedAnalysis }
        }
        default:
          throw new AppError('Analysis type not found')
      }
    } else {
      throw new AppError('Analysis not found')
    }
  }
}

export { UpdateAnalysisService }
