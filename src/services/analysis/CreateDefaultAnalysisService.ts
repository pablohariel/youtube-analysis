import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/getVideoData'
import { getWordsFromComments } from './utils/getWordsFromComments'
import { getUsersMood } from './utils/getUsersMood'
import { PrismaClient } from '@prisma/client'

import { VideoData } from './types'

interface Request {
  videoId: string,
  getMood: true | false,
  save: true | false,
  userId: string
}

interface Response {
  type: 'DEFAULT' | 'MINING' | 'CUSTOM';
  videoData: VideoData;
  usersMood?: string;
}

class CreateDefaultAnalysisService {
  public async execute ({ videoId, getMood, save, userId }: Request): Promise<Response> {
    const videoData = await getVideoData(videoId)

    const getVideoComments = new GetVideoCommentsService()

    const videoComments = await getVideoComments.execute({ videoId })
    const { words } = getWordsFromComments(videoComments)

    if (getMood) {
      const { mood } = getUsersMood(words)

      if (save) {
        const prisma = new PrismaClient()

        await prisma.analysis.create({
          data: {
            type: 'DEFAULT',
            videoData: { ...videoData },
            usersMood: mood,
            userId
          }
        })
      }

      return { type: 'DEFAULT', videoData, usersMood: mood }
    }

    if (save) {
      const prisma = new PrismaClient()
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          history: {
            create: {
              type: 'DEFAULT',
              videoData: { ...videoData }
            }
          }
        }
      })
    }

    return { type: 'DEFAULT', videoData }
  }
}

export { CreateDefaultAnalysisService }
