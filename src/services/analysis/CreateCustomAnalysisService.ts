import { Prisma } from '@prisma/client'

import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/video/getVideoData'
import { getWordsDetails } from './utils/word/getWordsDetails'
import { getWordsFromComments } from './utils/word/getWordsFromComments'
import { getUsersMood } from './utils/getUsersMood'
import { getGeneratedMessages } from './utils/getGeneratedMessages'
import { prisma } from '../../database/connection'
import { WordDetails } from './types'
import { VideoData } from '../../interfaces/videoData'

interface Request {
  videoId: string;
  requestedWords: string[];
  getMood: true | false;
  getMostCommentedWords: true | false;
  getMessages: true | false;
  save: true | false;
  userId: string;
}

interface Response {
  type: 'DEFAULT' | 'MINING' | 'CUSTOM';
  videoData: VideoData;
  usersMood: string | null;
  messages: string[];
  mostCommentedWords: WordDetails[];
  requestedWords: WordDetails[];
}

class CreateCustomAnalysisService {
  public async execute ({ videoId, requestedWords, getMood, getMostCommentedWords, getMessages, save, userId } : Request): Promise<Response> {
    const videoData = await getVideoData(videoId)

    const getVideoComments = new GetVideoCommentsService()

    const videoComments = await getVideoComments.execute({ videoId })
    const { words } = getWordsFromComments(videoComments)

    const { mood } = getUsersMood(words)
    const wordsDetails = getWordsDetails(words, 'pt-br')
    const mostCommentedWords = wordsDetails.slice(0, 10)

    const messages = getGeneratedMessages({ words: wordsDetails, mood })

    const requestedWordsSum = wordsDetails.filter(item => {
      if (requestedWords.includes(item.word)) {
        return true
      } else {
        return false
      }
    })

    if (save) {
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          history: {
            create: {
              type: 'CUSTOM',
              videoId,
              videoData: { ...videoData },
              usersMood: getMood ? mood : null,
              messages: getMessages ? messages : [],
              mostCommentedWords: getMostCommentedWords ? mostCommentedWords as unknown as Prisma.JsonArray : [],
              requestedWords: requestedWordsSum as unknown as Prisma.JsonArray
            }
          }
        }
      })
    }

    return {
      type: 'CUSTOM',
      videoData,
      usersMood: getMood ? mood : null,
      messages: getMessages ? messages : [],
      mostCommentedWords: getMostCommentedWords ? mostCommentedWords : [],
      requestedWords: requestedWordsSum
    }
  }
}

export { CreateCustomAnalysisService }
