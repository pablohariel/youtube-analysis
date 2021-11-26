import { AppError } from '../../errors/AppError'
import { ObjectId } from 'bson'

import { prisma } from '../../database/connection'
import { ICompleteAnalysis, IDefaultAnalysis, IMiningAnalysis } from '../../interfaces/analysis'

interface Request {
  userId: string
  videoTitle?: string
  searchBy: 'videoTitle' | 'all'
  orderBy: 'created_at' | 'updated_at' | 'viewCount' | 'videoTitle'
  direction: 'desc' | 'asc'
  analysisType?: 'DEFAULT' | 'MINING' | 'COMPLETE'
  pageNumber: number
}

interface Response {
  analysisCount: number
  analysis: (IDefaultAnalysis | IMiningAnalysis | ICompleteAnalysis)[]
}

class GetAnalysisHistoryService {
  public async execute ({
    userId,
    videoTitle,
    searchBy = 'all',
    pageNumber = 1,
    orderBy = 'created_at',
    analysisType, direction = 'desc'
  }: Request): Promise<Response> {
    try {
      userId = new ObjectId(userId).toHexString()
    } catch (error) {
      throw new AppError('No analysis found')
    }

    const orderByData = {} as {
      created_at?: 'desc' | 'asc'
      updated_at?: 'desc' | 'asc'
      viewCount?: 'desc' | 'asc'
      videoTitle?: 'desc' | 'asc'
    }

    switch (orderBy) {
      case 'created_at': {
        orderByData.created_at = direction
        break
      }
      case 'updated_at': {
        orderByData.updated_at = direction
        break
      }
      case 'viewCount': {
        orderByData.viewCount = direction
        break
      }
      default:
        orderByData.created_at = 'desc'
        break
    }

    const whereData = {
      userId
    } as {
      userId: string
      type?: 'DEFAULT' | 'MINING' | 'COMPLETE'
    }

    if (analysisType) {
      switch (analysisType) {
        case 'DEFAULT': {
          whereData.type = 'DEFAULT'
          break
        }
        case 'MINING': {
          whereData.type = 'MINING'
          break
        }
        case 'COMPLETE': {
          whereData.type = 'COMPLETE'
          break
        }
        default:
          break
      }
    }

    switch (searchBy) {
      case 'all': {
        const analysisCount = await prisma.analysis.count({
          where: whereData
        })

        const analysis = await prisma.analysis.findMany({
          orderBy: orderByData,
          where: whereData,
          skip: (pageNumber - 1) * 10,
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }) as unknown as (IDefaultAnalysis | IMiningAnalysis | ICompleteAnalysis)[]

        return {
          analysisCount,
          analysis
        }
      }
      default: {
        throw new AppError('Analysis not found')
      }
    }
  }
}

export { GetAnalysisHistoryService }
