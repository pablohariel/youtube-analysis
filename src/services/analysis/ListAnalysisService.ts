import { prisma } from '../../database/connection'
import { IAnalysis } from '../../interfaces/analysis'

interface Request {
  videoTitle?: string;
  videoId?: string;
  channelTitle?: string;
}

class ListAnalysisService {
  public async execute ({ videoId, videoTitle, channelTitle } : Request): Promise<IAnalysis[]> {
    const analysis = await prisma.analysis.findMany() as unknown as IAnalysis[]

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
