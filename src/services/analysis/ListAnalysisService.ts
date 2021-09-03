import { Analysis } from '@prisma/client'
import { prisma } from '../../database/connection'

import { VideoData } from './types'

interface Request {
  videoTitle?: string;
  videoId?: string;
  channelTitle?: string;
}

class ListAnalysisService {
  public async execute ({ videoId, videoTitle, channelTitle } : Request): Promise<Analysis[]> {
    const analysis = await prisma.analysis.findMany()

    if (videoId) {
      const result = analysis.filter(item => {
        if (item.videoId === videoId) {
          return true
        } else {
          return false
        }
      })

      return result
    } else if (videoTitle) {
      const result = analysis.filter(item => {
        if (typeof (item.videoData) === 'object') {
          const videoData = { ...item.videoData } as VideoData
          if (videoData.videoTitle === videoTitle) {
            return true
          } else {
            return false
          }
        }
        return false
      })

      return result
    } else if (channelTitle) {
      const result = analysis.filter(item => {
        if (typeof (item.videoData) === 'object') {
          const videoData = { ...item.videoData } as VideoData
          if (videoData.channelTitle === channelTitle) {
            return true
          } else {
            return false
          }
        }
        return false
      })

      return result
    }

    return analysis
  }
}

export { ListAnalysisService }
