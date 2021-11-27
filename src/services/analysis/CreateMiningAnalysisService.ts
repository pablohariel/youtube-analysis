import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/getVideoData'
import { getComments } from './utils/mining/getComments'
import { getPhrases } from './utils/mining/getPhrases'
import { getUsersComments } from './utils/mining/getUsersComments'
import { getWords } from './utils/mining/getWords'

import { getCommentsWords } from './utils/words/getCommentsWords'
import { getJoinedWords } from './utils/words/getJoinedWords'

import { Prisma } from '@prisma/client'
import { prisma } from '../../database/connection'

import { CommentsFromPhrase, CommentsFromWord, CommentsFromUser } from '../../interfaces/commentFromData'
import { MiningRequest } from '../../interfaces/requestData'
import { MiningResponse } from '../../interfaces/responseData'

class CreateMiningAnalysisService {
  public async execute ({ videoId, options, userId, save, privacy }: MiningRequest): Promise<MiningResponse> {
    const {
      wordsToFindWords,
      phrasesToFindPhrases,
      wordsToFindComments,
      phrasesToFindComments,
      usersToFindComments
    } = options

    const { videoData } = await getVideoData(videoId)
    const { title } = videoData

    const getVideoComments = new GetVideoCommentsService()
    const { comments } = await getVideoComments.execute({ videoId })

    const response = {
      requestData: {
        videoId,
        userId,
        type: 'mining',
        options: {},
        privacy,
        save
      },
      videoData,
      content: {}
    } as MiningResponse

    if (wordsToFindWords && wordsToFindWords.checked) {
      const { includeCommentReplies, caseSensitive, avoidAccentuation } = wordsToFindWords.filters

      const { content, filters } = wordsToFindWords
      const { words: commentsWords } = getCommentsWords({
        comments,
        videoId,
        filters: {
          includeCommentReplies,
          caseSensitive,
          avoidAccentuation
        }
      })

      const { joinedWords } = getJoinedWords({ videoId, words: commentsWords })
      const { dataFound: wordsAgain } = getWords({ words: joinedWords, wordsToFind: content, filters })
      response.content.words = wordsAgain
      response.requestData.options.wordsToFindWords = wordsToFindWords
    }

    if (phrasesToFindPhrases && phrasesToFindPhrases.checked) {
      const { content, filters } = phrasesToFindPhrases
      const { dataFound: phrases } = getPhrases({ comments, phrasesToFind: content, filters })
      response.content.phrases = phrases
      response.requestData.options.phrasesToFindPhrases = phrasesToFindPhrases
    }

    if (wordsToFindComments && wordsToFindComments.checked) {
      const { content, filters } = wordsToFindComments
      const { dataFound: commentsFromWords } = getComments({ type: 'fromWords', comments, wordsToFind: content, filters })
      response.content.commentsFromWords = [...commentsFromWords] as unknown as CommentsFromWord[]
      response.requestData.options.wordsToFindComments = wordsToFindComments
    }

    if (phrasesToFindComments && phrasesToFindComments.checked) {
      const { content, filters } = phrasesToFindComments
      const { dataFound: commentsFromPhrases } = getComments({ type: 'fromPhrases', comments, phrasesToFind: content, filters })
      response.content.commentsFromPhrases = [...commentsFromPhrases] as unknown as CommentsFromPhrase[]
      response.requestData.options.phrasesToFindComments = phrasesToFindComments
    }

    if (usersToFindComments && usersToFindComments.checked) {
      const { content, filters } = usersToFindComments
      const { dataFound: commentsFromUser } = getUsersComments({ comments, usersName: content, filters })
      response.content.commentsFromUsers = [...commentsFromUser] as unknown as CommentsFromUser[]
      response.requestData.options.usersToFindComments = usersToFindComments
    }

    if (save) {
      await prisma.analysis.create({
        data: {
          userId,
          type: 'MINING',
          videoTitle: title,
          requestData: response.requestData as unknown as Prisma.JsonArray,
          videoData: response.videoData as unknown as Prisma.JsonArray,
          content: response.content as unknown as Prisma.JsonArray,
          privacy
        }
      })
    }

    return response
  }
}

export { CreateMiningAnalysisService }
