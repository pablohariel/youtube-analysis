import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/getVideoData'
import { getWordsDetails } from './utils/getWordsDetails'
import { getWordsFromComments } from './utils/getWordsFromComments'
import { Prisma } from '@prisma/client'

import { prisma } from '../../database/connection'
import { VideoData, WordDetails } from './types'

interface Request {
  videoId: string,
  requestedWords: string[],
  getMostCommentedWords: true | false,
  save: true | false,
  userId: string
}

interface Response {
  type: 'DEFAULT' | 'MINING' | 'CUSTOM';
  videoData: VideoData;
  mostCommentedWords?: WordDetails[];
  requestedWords?: WordDetails[];
}

class CreateMiningAnalysisService {
  public async execute ({ videoId, requestedWords, getMostCommentedWords, userId, save }: Request): Promise<Response> {
    const videoData = await getVideoData(videoId)

    const getVideoComments = new GetVideoCommentsService()

    const videoComments = await getVideoComments.execute({ videoId })
    const { words } = getWordsFromComments(videoComments)

    const wordsDetails = getWordsDetails(words, 'pt-br')

    const requestedWordsSum = wordsDetails.filter(item => {
      if (requestedWords.includes(item.word)) {
        return true
      } else {
        return false
      }
    })

    if (getMostCommentedWords) {
      const mostCommentedWords = wordsDetails.slice(0, 10)

      if (save) {
        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            history: {
              create: {
                type: 'MINING',
                videoId,
                videoData: { ...videoData },
                mostCommentedWords: [...mostCommentedWords] as unknown as Prisma.JsonArray,
                requestedWords: [...requestedWordsSum] as unknown as Prisma.JsonArray
              }
            }
          }
        })
      }

      return { type: 'MINING', videoData, mostCommentedWords, requestedWords: requestedWordsSum }
    }

    if (save) {
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          history: {
            create: {
              type: 'MINING',
              videoId,
              videoData: { ...videoData },
              requestedWords: [...requestedWordsSum] as unknown as Prisma.JsonArray
            }
          }
        }
      })
    }

    return { type: 'MINING', videoData, requestedWords: requestedWordsSum }
  }
}

export { CreateMiningAnalysisService }
