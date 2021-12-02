import { GetVideoCommentsService } from '../video/GetVideoCommentsService'

import { Prisma } from '@prisma/client'

import { prisma } from '../../database/connection'
import { DefaultRequest } from '../../interfaces/requestData'
import { getVideoData } from './utils/getVideoData'
import { CommentsGroupedByPolarityNoComments } from '../../interfaces/comment'
import { getWordsRelatedToVideoTitle } from './utils/default/getWordsRelatedToVideoTitle'
import { analyzeCommentsAndReplies } from './utils/default/analyzeComments'
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
import { DefaultResponse } from '../../interfaces/responseData'
import { getPublicationDate } from './utils/default/getPublicationDate'

class CreateDefaultAnalysisService {
  public async execute ({ videoId, options, userId, save, privacy }: DefaultRequest): Promise<DefaultResponse> {
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
      commentsPublicationDate
    } = options

    const { videoData } = await getVideoData(videoId)
    const { title } = videoData

    const getVideoComments = new GetVideoCommentsService()

    const { comments } = await getVideoComments.execute({ videoId })

    const { commentsAnalyzed } = await analyzeCommentsAndReplies({ comments })

    const { commentsGroupedByPolarity } = groupCommentsByPolarity({ comments: commentsAnalyzed })

    const response = {
      requestData: {
        videoId,
        userId,
        type: 'default',
        options: {},
        privacy,
        save
      },
      videoData,
      content: {}
    } as DefaultResponse

    if (commentCount && commentCount.checked) {
      const { includeCommentReplies } = commentCount

      const { commentCount: commentCountResponse } = getCommentCount({
        comments,
        includeReplies: includeCommentReplies
      })

      response.content.commentCount = commentCountResponse
      response.requestData.options.commentCount = commentCount
    }

    if (commentsPolarity && commentsPolarity.checked) {
      const { positive, neutral, negative } = commentsGroupedByPolarity

      const commentsGroupedByPolarityNoComments = {
        positive: {
          totalCount: positive.totalCount,
          commentCount: positive.commentCount,
          replyCount: positive.replyCount
        },
        neutral: {
          totalCount: neutral.totalCount,
          commentCount: neutral.commentCount,
          replyCount: neutral.replyCount
        },
        negative: {
          totalCount: negative.totalCount,
          commentCount: negative.commentCount,
          replyCount: negative.replyCount
        }
      } as CommentsGroupedByPolarityNoComments

      response.content.commentsPolarity = commentsGroupedByPolarityNoComments
      response.requestData.options.commentsPolarity = commentsPolarity
    }

    if (topPositiveComments && topPositiveComments.checked) {
      const { includeCommentReplies } = topPositiveComments

      const { topPositiveComments: topPositiveCommentsResult } = getTopPositiveComments({
        comments: commentsGroupedByPolarity,
        filters: {
          includeCommentReplies
        }
      })

      response.content.topPositiveComments = topPositiveCommentsResult.slice(0, 5)
      response.requestData.options.topPositiveComments = topPositiveComments
    }

    if (topNegativeComments && topNegativeComments.checked) {
      const { includeCommentReplies } = topNegativeComments

      const { topNegativeComments: topPositiveCommentsResult } = getTopNegativeComments({
        comments: commentsGroupedByPolarity,
        filters: {
          includeCommentReplies
        }
      })

      response.content.topNegativeComments = topPositiveCommentsResult.slice(0, 5)
      response.requestData.options.topNegativeComments = topNegativeComments
    }

    if (mostLikedComment && mostLikedComment.checked) {
      const { includeCommentReplies } = mostLikedComment

      const { comment } = getComment({
        comments,
        filter: 'mostLikes',
        filters: {
          includeCommentReplies
        }
      })
      response.content.mostLikedComment = comment
      response.requestData.options.mostLikedComment = mostLikedComment
    }

    if (mostRepliesComment && mostRepliesComment.checked) {
      const { comment } = getComment({
        comments,
        filter: 'mostReplies',
        filters: {
          includeCommentReplies: false
        }
      })
      response.content.mostRepliesComment = comment
      response.requestData.options.mostRepliesComment = mostRepliesComment
    }

    if (wordCount && wordCount.checked) {
      const { includeCommentReplies, countRepeatedWords } = wordCount

      const { words } = getCommentsWords({
        comments,
        videoId,
        filters: {
          includeCommentReplies,
          caseSensitive: false,
          avoidAccentuation: true
        }
      })
      const { joinedWords } = getJoinedWords({ words, videoId })

      const { wordCount: wordCountResult } = getWordCount({
        words: joinedWords,
        filters: {
          countRepeatedWords
        }
      })

      response.content.wordCount = wordCountResult
      response.requestData.options.wordCount = wordCount
    }

    // UNFINISHED (MISSING WORD POLARITY AND CLASS)
    if (topWords && topWords.checked) {
      const { includeCommentReplies, avoidAccentuation, caseSensitive } = topWords

      const { words } = getCommentsWords({
        comments,
        videoId,
        filters: {
          includeCommentReplies,
          caseSensitive,
          avoidAccentuation
        }
      })
      const { joinedWords } = getJoinedWords({ words, videoId })

      const { wordsMostUsed } = getWordsMostUsed({ words: joinedWords })

      response.content.topWords = wordsMostUsed.slice(0, 5)
      response.requestData.options.topWords = topWords
    }

    if (topWordsUsedTogether && topWordsUsedTogether.checked) {
      const { includeCommentReplies, avoidAccentuation, caseSensitive } = topWordsUsedTogether

      const { words } = getCommentsWords({
        comments,
        videoId,
        filters: {
          includeCommentReplies,
          caseSensitive,
          avoidAccentuation
        }
      })

      const { wordsMostUsedTogether } = getWordsMostUsedTogether({
        words,
        videoId,
        filters: {
          avoidAccentuation,
          caseSensitive
        }
      })

      response.content.topWordsUsedTogether = wordsMostUsedTogether
      response.requestData.options.topWordsUsedTogether = topWordsUsedTogether
    }

    if (wordsRelatedToVideoTitle && wordsRelatedToVideoTitle.checked) {
      const { includeCommentReplies, avoidAccentuation, caseSensitive } = wordsRelatedToVideoTitle

      const { words } = getCommentsWords({
        comments,
        videoId,
        filters: {
          includeCommentReplies,
          caseSensitive,
          avoidAccentuation
        }
      })
      const { joinedWords } = getJoinedWords({ words, videoId })

      const { wordsRelatedToVideoTitle: wordsRelatedToVideoTitleResult } = getWordsRelatedToVideoTitle({
        videoTitle: videoData.title,
        words: joinedWords,
        filters: {
          avoidAccentuation,
          caseSensitive
        }
      })

      response.content.wordsRelatedToVideoTitle = wordsRelatedToVideoTitleResult
      response.requestData.options.wordsRelatedToVideoTitle = wordsRelatedToVideoTitle
    }

    if (topComentingUser && topComentingUser.checked) {
      const { includeCommentReplies } = topComentingUser

      const { commentsUsers } = getCommentsUsers({
        comments,
        filters: {
          includeCommentReplies
        }
      })

      const { userWithMostComment } = getUserWithMostComment({ users: commentsUsers })

      response.content.topComentingUser = userWithMostComment
      response.requestData.options.topComentingUser = topComentingUser
    }

    if (commentsLanguage && commentsLanguage.checked) {
      const { includeCommentReplies } = commentsLanguage

      const { languages } = getLanguages({
        comments: commentsAnalyzed,
        filters: {
          includeCommentReplies
        }
      })
      
      response.content.commentsLanguage = languages
      response.requestData.options.commentsLanguage = commentsLanguage
    }

    if (commentsPublicationDate && commentsPublicationDate.checked) {
      const { includeCommentReplies } = commentsPublicationDate

      const { commentsPublicationDate: content } = getPublicationDate({
        comments,
        filters: {
          includeCommentReplies
        }
      })

      response.content.commentsPublicationDate = content
      response.requestData.options.commentsPublicationDate = commentsPublicationDate
    }

    if (save) {
      await prisma.analysis.create({
        data: {
          userId,
          type: 'DEFAULT',
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

export { CreateDefaultAnalysisService }
