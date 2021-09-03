import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/getVideoData'
import { getWordsDetails } from './utils/getWordsDetails'
import { getWordsFromComments } from './utils/getWordsFromComments'
import { getUsersMood } from './utils/getUsersMood'
import { Prisma } from '@prisma/client'

import { prisma } from '../../database/connection'
import { VideoData, WordDetails } from './types'

interface Request {
  videoId: string,
  requestedWords: string[],
  getMood: true | false,
  getMostCommentedWords: true | false,
  save: true | false,
  userId: string
}

interface Response {
  type: 'DEFAULT' | 'MINING' | 'CUSTOM';
  videoData: VideoData;
  mostCommentedWords?: WordDetails[];
  requestedWords?: WordDetails[];
  usersMood?: string
}

class CreateCustomAnalysisService {
  public async execute ({ videoId, requestedWords, getMood, getMostCommentedWords, save, userId } : Request): Promise<Response> {
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

      if (getMood) {
        const { mood } = getUsersMood(words)

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
                  mostCommentedWords: [...mostCommentedWords] as unknown as Prisma.JsonArray,
                  requestedWords: [...requestedWordsSum] as unknown as Prisma.JsonArray,
                  usersMood: mood
                }
              }
            }
          })
        }

        return { type: 'CUSTOM', videoData, mostCommentedWords, requestedWords: requestedWordsSum, usersMood: mood }
      }

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
                mostCommentedWords: [...mostCommentedWords] as unknown as Prisma.JsonArray,
                requestedWords: [...requestedWordsSum] as unknown as Prisma.JsonArray
              }
            }
          }
        })
      }

      return { type: 'CUSTOM', videoData, mostCommentedWords, requestedWords: requestedWordsSum }
    }

    if (getMood) {
      const { mood } = getUsersMood(words)

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
                requestedWords: [...requestedWordsSum] as unknown as Prisma.JsonArray,
                usersMood: mood
              }
            }
          }
        })
      }

      return { type: 'CUSTOM', videoData, requestedWords: requestedWordsSum, usersMood: mood }
    }

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
              requestedWords: [...requestedWordsSum] as unknown as Prisma.JsonArray
            }
          }
        }
      })
    }

    return { type: 'CUSTOM', videoData, requestedWords: requestedWordsSum }
  }
}

export { CreateCustomAnalysisService }
