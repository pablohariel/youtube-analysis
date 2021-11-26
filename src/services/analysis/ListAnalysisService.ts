import { prisma } from '../../database/connection'
import { AppError } from '../../errors/AppError'
import { IDefaultAnalysis, IMiningAnalysis, ICompleteAnalysis } from '../../interfaces/analysis'

interface Request {
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

class ListAnalysisService {
  public async execute ({
    videoTitle = '',
    searchBy = 'all',
    pageNumber = 1,
    orderBy = 'created_at',
    analysisType, direction = 'desc'
  } : Request): Promise<Response> {
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
      privacy: 'public'
    } as {
      privacy: 'public'
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
        }
        ) as unknown as (IDefaultAnalysis | IMiningAnalysis | ICompleteAnalysis)[]

        return { analysisCount, analysis }
      }
      case 'videoTitle': {
        const analysisCount = await prisma.analysis.count({
          where: {
            videoTitle: {
              contains: videoTitle,
              mode: 'insensitive'
            }
          }
        })

        const analysis = await prisma.analysis.findMany({
          orderBy: orderByData,
          where: {
            videoTitle: {
              contains: videoTitle,
              mode: 'insensitive'
            }
          },
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
        }
        ) as unknown as (IDefaultAnalysis | IMiningAnalysis | ICompleteAnalysis)[]

        return { analysisCount, analysis }
      }
      default: {
        throw new AppError('Analysis not found')
      }
    }

    // {
    //   select: {
    //     id: true,
    //     userId: true,
    //     user: true,
    //     requestData: true,
    //     content: true,
    //     videoData: true,
    //     viewCount: true,
    //     privacy: true,
    //     created_at: true,
    //     updated_at: true
    //   }
    // }
  }
}

export { ListAnalysisService }
