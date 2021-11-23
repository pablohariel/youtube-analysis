import { GetVideoCommentsService } from '../video/GetVideoCommentsService'

import { Prisma } from '@prisma/client'

import { prisma } from '../../database/connection'
import { CompleteRequest } from '../../interfaces/requestData'
import { CompleteResponse } from '../../interfaces/responseData'

import { getVideoData } from './utils/getVideoData'
import { CommentsGroupedByPolarityNoComments } from '../../interfaces/comment'
import { getWordsRelatedToVideoTitle } from './utils/default/getWordsRelatedToVideoTitle'
import { analyzeComments } from './utils/default/analyzeComments'
import { groupCommentsByPolarity } from './utils/default/groupCommentsByPolarity'
import { getTopPositiveComments } from './utils/default/getTopPositiveComments'
import { getTopNegativeComments } from './utils/default/getTopNegativeComments'
import { getWordsMostUsed } from './utils/default/getWordsMostUsed'
import { getCommentsWords } from './utils/words/getCommentsWords'
import { getJoinedWords } from './utils/words/getJoinedWords'
import { getComment } from './utils/default/getComment'
import { getWordCount } from './utils/default/getWordCount'
import { getWordsMostUsedTogether } from './utils/default/getWordsMostUsedTogether'
import { getUserWithMostComment } from './utils/default/getUserWithMostComment'
import { getCommentsUsers } from './utils/default/getCommentsUsers'
import { getLanguages } from './utils/default/getLanguages'
import { getCommentCount } from './utils/default/getCommentCount'
import { getPublicationDate } from './utils/default/getPublicationDate'
import { CommentsFromPhrase, CommentsFromWord, CommentsFromUser } from '../../interfaces/commentFromData'
import { getComments } from './utils/mining/getComments'
import { getPhrases } from './utils/mining/getPhrases'
import { getUsersComments } from './utils/mining/getUsersComments'
import { getWords } from './utils/mining/getWords'

class CreateCompleteAnalysisService {
  public async execute ({ videoId, options, userId, save, privacy }: CompleteRequest): Promise<CompleteResponse> {
    const {
      commentCount,
      commentsPolarity,
      topPositiveComments,
      topNegativeComments,
      mostLikedComment,
      mostRepliesComment,
      wordCount,
      topWords,
      topWordsUsedTogether,
      wordsRelatedToVideoTitle,
      topComentingUser,
      commentsLanguage,
      commentsPublicationDate,
      wordsToFindWords,
      phrasesToFindPhrases,
      wordsToFindComments,
      phrasesToFindComments,
      usersToFindComments
    } = options

    const { videoData } = await getVideoData(videoId)

    const getVideoComments = new GetVideoCommentsService()
    const { comments } = await getVideoComments.execute({ videoId })
    const { commentsAnalyzed } = await analyzeComments({ comments })
    const { commentsGroupedByPolarity } = groupCommentsByPolarity({ comments: commentsAnalyzed })

    const { words } = getCommentsWords({ comments, videoId, includeReplies: false })
    const { joinedWords } = getJoinedWords({ words, videoId })

    const { commentsUsers } = getCommentsUsers({ comments })

    const response = {
      requestData: {
        videoId,
        userId,
        type: 'complete',
        options: {},
        privacy,
        save
      },
      videoData,
      content: {}
    } as CompleteResponse

    if (commentCount && commentCount.checked) {
      const { commentCount: commentCountResponse } = getCommentCount({ comments, includeReplies: commentCount.includeCommentReplies })
      response.content.commentCount = commentCountResponse
      response.requestData.options.commentCount = commentCount
    }

    if (commentsPolarity && commentsPolarity.checked) {
      const commentsGroupedByPolarityNoComments = {
        positive: {
          count: commentsGroupedByPolarity.positive.count
        },
        neutral: {
          count: commentsGroupedByPolarity.neutral.count
        },
        negative: {
          count: commentsGroupedByPolarity.negative.count
        }
      } as CommentsGroupedByPolarityNoComments
      response.content.commentsPolarity = commentsGroupedByPolarityNoComments
      response.requestData.options.commentsPolarity = commentsPolarity
    }

    if (topPositiveComments && topPositiveComments.checked) {
      const { topPositiveComments: topPositiveCommentsResult } = getTopPositiveComments({ comments: commentsGroupedByPolarity })
      response.content.topPositiveComments = topPositiveCommentsResult.slice(0, 5)
      response.requestData.options.topPositiveComments = topPositiveComments
    }

    if (topNegativeComments && topNegativeComments.checked) {
      const { topNegativeComments: topPositiveCommentsResult } = getTopNegativeComments({ comments: commentsGroupedByPolarity })
      response.content.topNegativeComments = topPositiveCommentsResult.slice(0, 5)
      response.requestData.options.topNegativeComments = topNegativeComments
    }

    if (mostLikedComment && mostLikedComment.checked) {
      const { comment } = getComment({ comments, filter: 'mostLikes' })
      response.content.mostLikedComment = comment
      response.requestData.options.mostLikedComment = mostLikedComment
    }

    if (mostRepliesComment && mostRepliesComment.checked) {
      const { comment } = getComment({ comments, filter: 'mostReplies' })
      response.content.mostRepliesComment = comment
      response.requestData.options.mostRepliesComment = mostRepliesComment
    }

    if (wordCount && wordCount.checked) {
      const { wordCount: wordCountResult } = getWordCount({ words })
      response.content.wordCount = wordCountResult
      response.requestData.options.wordCount = wordCount
    }

    if (topWords && topWords.checked) {
      const { wordsMostUsed } = getWordsMostUsed({ words: joinedWords })
      response.content.topWords = wordsMostUsed.slice(0, 5)
      response.requestData.options.topWords = topWords
    }

    if (topWordsUsedTogether && topWordsUsedTogether.checked) {
      const { wordsMostUsedTogether } = getWordsMostUsedTogether({ words: joinedWords })
      response.content.topWordsUsedTogether = wordsMostUsedTogether.slice(0, 10)
      response.requestData.options.topWordsUsedTogether = topWordsUsedTogether
    }

    if (wordsRelatedToVideoTitle && wordsRelatedToVideoTitle.checked) {
      const { wordsRelatedToVideoTitle: wordsRelatedToVideoTitleResult } = getWordsRelatedToVideoTitle({ videoTitle: videoData.title, words: joinedWords })
      response.content.wordsRelatedToVideoTitle = wordsRelatedToVideoTitleResult
      response.requestData.options.wordsRelatedToVideoTitle = wordsRelatedToVideoTitle
    }

    if (topComentingUser && topComentingUser.checked) {
      const { userWithMostComment } = getUserWithMostComment({ users: commentsUsers })
      response.content.topComentingUser = userWithMostComment
      response.requestData.options.topComentingUser = topComentingUser
    }

    if (commentsLanguage && commentsLanguage.checked) {
      const { languages } = getLanguages({ comments: commentsAnalyzed })
      response.content.commentsLanguage = languages
      response.requestData.options.commentsLanguage = commentsLanguage
    }

    if (commentsPublicationDate && commentsPublicationDate.checked) {
      const { includeCommentReplies } = commentsPublicationDate
      const { commentsPublicationDate: content } = getPublicationDate({ comments, includeReplies: includeCommentReplies })
      response.content.commentsPublicationDate = content
      response.requestData.options.commentsPublicationDate = commentsPublicationDate
    }

    if (wordsToFindWords && wordsToFindWords.checked) {
      const { content, filters } = wordsToFindWords
      const { words: commentsWords } = getCommentsWords({ comments, videoId, includeReplies: filters.includeCommentReplies })
      const { joinedWords } = getJoinedWords({ videoId, words: commentsWords })
      const { dataFound: words } = getWords({ words: joinedWords, wordsToFind: content, filters })
      response.content.words = words
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
          type: 'COMPLETE',
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

export { CreateCompleteAnalysisService }
