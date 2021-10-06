import { GetVideoCommentsService } from '../video/GetVideoCommentsService'

import { prisma } from '../../database/connection'
import { VideoData } from '../../interfaces/videoData'

interface Request {
  videoId: string,
  getMood: true | false,
  getMessages: true | false,
  save: true | false,
  userId: string
}

interface Response {
  type: 'DEFAULT' | 'MINING' | 'CUSTOM';
  videoData: VideoData;
  usersMood: string | null;
  messages: string[];
}

class CreateDefaultAnalysisService {
  public async execute ({ videoId, getMood, getMessages, save, userId }: Request): Promise<Response> {
    const videoData = await getVideoData(videoId)

    const getVideoComments = new GetVideoCommentsService()

    const videoComments = await getVideoComments.execute({ videoId })
    const { words } = getWordsFromComments(videoComments)

    const { mood } = getUsersMood(words)

    const wordsDetails = getWordsDetails(words, 'pt-br')

    const messages = getGeneratedMessages({ words: wordsDetails, mood })

    if (save) {
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          history: {
            create: {
              type: 'DEFAULT',
              videoId,
              videoData: { ...videoData },
              usersMood: getMood ? mood : null,
              messages: getMessages ? messages : []
            }
          }
        }
      })
    }

    return {
      type: 'DEFAULT',
      videoData,
      usersMood: getMood ? mood : null,
      messages: getMessages ? messages : []
    }
  }
}

export { CreateDefaultAnalysisService }
