import { GetVideoCommentsService } from '../video/GetVideoCommentsService'

import { Prisma } from '@prisma/client'

import { prisma } from '../../database/connection'
import { CompleteRequest } from '../../interfaces/requestData'
import { CompleteResponse } from '../../interfaces/responseData'

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

    console.time('getVideoData')
    const { videoData } = await getVideoData(videoId)
    console.timeEnd('getVideoData')

    const { title } = videoData

    const getVideoComments = new GetVideoCommentsService()

    console.time('getVideoComments')
    const { comments } = await getVideoComments.execute({ videoId })
    console.timeEnd('getVideoComments')

    console.time('analyzeComments')
    const { commentsAnalyzed } = await analyzeCommentsAndReplies({ comments })
    console.timeEnd('analyzeComments')

    console.time('groupCommentsByPolarity')
    const { commentsGroupedByPolarity } = groupCommentsByPolarity({ comments: commentsAnalyzed })
    console.timeEnd('groupCommentsByPolarity')

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

    if (wordsToFindWords && wordsToFindWords.checked) {
      const { content, filters } = wordsToFindWords

      const { words: commentsWords } = getCommentsWords({
        comments,
        videoId,
        filters
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

      const { commentsFromUsers } = getUsersComments({ comments, usersName: content, filters })
      
      response.content.commentsFromUsers = [...commentsFromUsers] as unknown as CommentsFromUser[]
      response.requestData.options.usersToFindComments = usersToFindComments
    }

    if (save) {
      await prisma.analysis.create({
        data: {
          userId,
          type: 'COMPLETE',
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

export { CreateCompleteAnalysisService }
