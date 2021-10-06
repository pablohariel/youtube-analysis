import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/analysis/getVideoData'
import { getComments } from './utils/analysis/mining/getComments'
import { getPhrases } from './utils/analysis/mining/getPhrases'
import { getUsersComments } from './utils/analysis/mining/getUsersComments'
import { getWords } from './utils/analysis/mining/getWords'

import { getCommentsWords } from './utils/words/getCommentsWords'
import { getJoinedWords } from './utils/words/getJoinedWords'

import { Prisma } from '@prisma/client'

import { prisma } from '../../database/connection'
import { VideoData } from '../../interfaces/videoData'
import { JoinedWord } from '../../interfaces/word'
import { CommentFromData } from '../../interfaces/commentFromData'
import { UserFromData } from '../../interfaces/userFromData'
import { JoinedPhrase } from '../../interfaces/joinedPhrase'
import { MiningRequestData } from '../../interfaces/requestData'

interface Response {
  userId: string,
  type: 'DEFAULT' | 'MINING' | 'CUSTOM',
  requestData: MiningRequestData
  videoData: VideoData,
  content: {
    words?: JoinedWord[],
    phrases?: JoinedPhrase[],
    commentsFromWords?: CommentFromData[],
    commentsFromPhrases?: CommentFromData[],
    commentsFromUser?: UserFromData[]
  }
}

class CreateMiningAnalysisService {
  public async execute ({ videoId, options, userId, save }: MiningRequestData): Promise<Response> {
    const {
      phrasesToFindComments,
      usersToFindComments,
      wordsToFindComments,
      wordsToFindWords,
      phrasesToFindPhrases
    } = options

    // getting video data
    const { videoData } = await getVideoData(videoId)

    // getting video comments
    const getVideoComments = new GetVideoCommentsService()
    const { comments } = await getVideoComments.execute({ videoId })

    const response = {
      userId,
      type: 'MINING',
      requestData: {
        options,
        userId,
        videoId,
        save
      },
      videoData
    } as Response

    if (phrasesToFindComments) {
      const { content, filters } = phrasesToFindComments
      const { dataFound: commentsFromPhrases } = getComments({ type: 'fromPhrases', comments, phrasesToFind: content, filters })
      response.content.commentsFromPhrases = commentsFromPhrases
    }

    if (usersToFindComments) {
      const { content, filters } = usersToFindComments
      const { dataFound: commentsFromUser } = getUsersComments({ comments, usersName: content, filters })
      response.content.commentsFromUser = commentsFromUser
    }

    if (wordsToFindComments) {
      const { content, filters } = wordsToFindComments
      const { dataFound: commentsFromWords } = getComments({ type: 'fromWords', comments, wordsToFind: content, filters })
      response.content.commentsFromWords = commentsFromWords
    }

    if (wordsToFindWords) {
      const { content, filters } = wordsToFindWords
      const { words: commentsWords } = getCommentsWords({ comments, videoId, includeReplies: filters.includeCommentReplies })
      const { joinedWords } = getJoinedWords({ videoId, words: commentsWords })
      const { dataFound: words } = getWords({ words: joinedWords, wordsToFind: content, filters })
      response.content.words = words
    }

    if (phrasesToFindPhrases) {
      const { content, filters } = phrasesToFindPhrases
      const { dataFound: phrases } = getPhrases({ comments, phrasesToFind: content, filters })
      response.content.phrases = phrases
    }

    // if (save) {
    //   await prisma.user.update({
    //     where: {
    //       id: userId
    //     },
    //     data: {
    //       history: {
    //         create: {
    //           type: 'MINING',
    //           videoId,
    //           videoData: { ...videoData },
    //           mostCommentedWords: getMostCommentedWords ? mostCommentedWords as unknown as Prisma.JsonArray : [],
    //           requestedWords: requestedWordsSum as unknown as Prisma.JsonArray
    //         }
    //       }
    //     }
    //   })
    // }q

    return response
  }
}

export { CreateMiningAnalysisService }
