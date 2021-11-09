import { GetVideoCommentsService } from '../video/GetVideoCommentsService'
import { getVideoData } from './utils/getVideoData'
import { getComments } from './utils/mining/getComments'
import { getPhrases } from './utils/mining/getPhrases'
import { getUsersComments } from './utils/mining/getUsersComments'
import { getWords } from './utils/mining/getWords'

import { getCommentsWords } from './utils/words/getCommentsWords'
import { getJoinedWords } from './utils/words/getJoinedWords'

// import { Prisma } from '@prisma/client'
// import { prisma } from '../../database/connection'

import { VideoData } from '../../interfaces/videoData'
import { JoinedWord } from '../../interfaces/word'
import { CommentsFromPhrase, CommentsFromWord, CommentsFromUser } from '../../interfaces/commentFromData'
import { JoinedPhrase } from '../../interfaces/joinedPhrase'
import { MiningRequest } from '../../interfaces/requestData'
import { Comment, Reply } from '../../interfaces/comment'
import { MiningResponse } from '../../interfaces/responseData'

class CreateMiningAnalysisService {
  public async execute ({ videoId, options, userId, save, visibility = 'public' }: MiningRequest): Promise<MiningResponse> {
    const {
      wordsToFindWords,
      phrasesToFindPhrases,
      wordsToFindComments,
      phrasesToFindComments,
      usersToFindComments
    } = options

    const { videoData } = await getVideoData(videoId)

    const getVideoComments = new GetVideoCommentsService()
    const { comments } = await getVideoComments.execute({ videoId })

    const response = {
      type: 'mining',
      requestData: {
        options,
        userId,
        videoId,
        save,
        visibility
      },
      videoData,
      content: {}
    } as MiningResponse

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

    if (wordsToFindComments) {
      const { content, filters } = wordsToFindComments
      const { dataFound: commentsFromWords } = getComments({ type: 'fromWords', comments, wordsToFind: content, filters })
      response.content.commentsFromWords = commentsFromWords
    }

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

    const commentsToAnalyze = [] as (Comment | Reply)[]

    for (const comment of comments) {
      commentsToAnalyze.push(comment)
      // include replies
      // for (const reply of comment.replies) {
      //   commentsToAnalyze.push(reply)
      // }
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
    // }

    return response
  }
}

export { CreateMiningAnalysisService }
