import { prisma } from '../../database/connection'
import { IDefaultAnalysis, IMiningAnalysis, ICompleteAnalysis } from '../../interfaces/analysis'

interface Request {
  videoTitle?: string;
  videoId?: string;
  channelTitle?: string;
}

class ListAnalysisService {
  public async execute ({ videoId, videoTitle, channelTitle } : Request): Promise<(IDefaultAnalysis | IMiningAnalysis | ICompleteAnalysis)[]> {
    const analysis = await prisma.analysis.findMany({
      select: {
        id: true,
        userId: true,
        type: true,
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
    }) as unknown as (IDefaultAnalysis | IMiningAnalysis | ICompleteAnalysis)[]

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

    if (videoId) {
      const result = analysis.filter(item => {
        if (item.videoData.id === videoId) {
          return true
        } else {
          return false
        }
      })

      return result
    } else if (videoTitle) {
      const result = analysis.filter(item => {
        const { videoData } = item
        if (videoData.title === videoTitle) {
          return true
        } else {
          return false
        }
      })

      return result
    } else if (channelTitle) {
      const result = analysis.filter(item => {
        const { videoData } = item
        if (videoData.title === channelTitle) {
          return true
        } else {
          return false
        }
      })

      return result
    }

    return analysis
  }
}

export { ListAnalysisService }
