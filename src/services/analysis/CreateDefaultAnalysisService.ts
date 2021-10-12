import { GetVideoCommentsService } from '../video/GetVideoCommentsService'

// import { prisma } from '../../database/connection'
import { VideoData } from '../../interfaces/videoData'
import { DefaultRequestData } from '../../interfaces/requestData'
import { getVideoData } from './utils/analysis/getVideoData'
import { Comment, CommentAnalyzed, CommentsGroupedByPolarity } from '../../interfaces/comment'
import { JoinedWord } from '../../interfaces/word'
import { WordsTogether } from '../../interfaces/wordsTogether'
import { getWordsRelatedToVideoTitle, WordRelatedToVideoTitle } from './utils/analysis/default/getWordsRelatedToVideoTitle'
import { CommentUser } from '../../interfaces/commentUser'
import { LanguagesCount } from '../../interfaces/languages'
import { analyzeComments } from './utils/analyzeComments'
import { groupCommentsByPolarity } from './utils/groupCommentsByPolarity'
import { getTopComments } from './utils/getTopComments'
import { getWorstComments } from './utils/getWorstComments'
import { getWordsMostUsed } from './utils/analysis/default/getWordsMostUsed'
import { getCommentsWords } from './utils/words/getCommentsWords'
import { getJoinedWords } from './utils/words/getJoinedWords'
import { getComment } from './utils/analysis/default/getComment'
import { getWordCount } from './utils/analysis/default/getWordCount'
import { getWordsMostUsedTogether } from './utils/analysis/default/getWordsMostUsedTogether'
import { getUserWithMostComment } from './utils/analysis/default/getUserWithMostComment'
import { getCommentsUsers } from './utils/analysis/default/getCommentsUsers'
import { getLanguages } from './utils/getLanguages'

interface Response {
  userId: string,
  type: 'DEFAULT' | 'MINING' | 'CUSTOM',
  videoData: VideoData,
  content: {
    commentsPolarity?: CommentsGroupedByPolarity,
    positiveComments?: CommentAnalyzed[],
    negativeComments?: CommentAnalyzed[],
    topWords?: JoinedWord[],
    mostLikedComment?: Comment,
    wordsCount?: number,
    topWordsUsedTogether?: WordsTogether[],
    wordsRelatedToVideoTitle?: WordRelatedToVideoTitle[],
    mostRepliesComment?: Comment,
    topComentingUser?: CommentUser,
    commentsLanguage?: LanguagesCount
  }
}

class CreateDefaultAnalysisService {
  public async execute ({ videoId, options, userId, save }: DefaultRequestData): Promise<Response> {
    const {
      commentsPolarity,
      positiveComments,
      negativeComments,
      topWords,
      mostLikedComment,
      wordsCount,
      topWordsUsedTogether,
      wordsRelatedToVideoTitle,
      mostRepliesComment,
      topComentingUser,
      commentsLanguage
    } = options

    const { videoData } = await getVideoData(videoId)

    const getVideoComments = new GetVideoCommentsService()
    const { comments } = await getVideoComments.execute({ videoId })
    const { commentsAnalyzed } = await analyzeComments({ comments })
    const { commentsGrouped } = groupCommentsByPolarity({ comments: commentsAnalyzed })

    const { words } = getCommentsWords({ comments, videoId, includeReplies: false })
    const { joinedWords } = getJoinedWords({ words, videoId })

    const { commentsUsers } = getCommentsUsers({ comments })

    const response = {
      userId,
      type: 'DEFAULT',
      requestData: {
        options,
        userId,
        videoId,
        save
      },
      videoData,
      content: {}
    } as Response

    if (commentsPolarity) {
      response.content.commentsPolarity = commentsGrouped
    }

    if (positiveComments) {
      const { topComments } = getTopComments({ comments: commentsGrouped })
      response.content.positiveComments = topComments
    }

    if (negativeComments) {
      const { worstComments } = getWorstComments({ comments: commentsGrouped })
      response.content.negativeComments = worstComments
    }

    if (topWords) {
      const { wordsMostUsed } = getWordsMostUsed({ words: joinedWords })
      response.content.topWords = wordsMostUsed
    }

    if (mostLikedComment) {
      const { comment } = getComment({ comments, filter: 'mostLikes' })
      response.content.mostLikedComment = comment
    }

    if (wordsCount) {
      const { wordCount } = getWordCount({ words })
      response.content.wordsCount = wordCount
    }

    if (topWordsUsedTogether) {
      const { wordsMostUsedTogether } = getWordsMostUsedTogether({ words: joinedWords })
      response.content.topWordsUsedTogether = wordsMostUsedTogether
    }

    if (wordsRelatedToVideoTitle) {
      const { wordsRelatedToVideoTitle } = getWordsRelatedToVideoTitle({ videoTitle: videoData.title, words: joinedWords })
      response.content.wordsRelatedToVideoTitle = wordsRelatedToVideoTitle
    }

    if (mostRepliesComment) {
      const { comment } = getComment({ comments, filter: 'mostReplies' })
      response.content.mostRepliesComment = comment
    }

    if (topComentingUser) {
      const { userWithMostComment } = getUserWithMostComment({ users: commentsUsers })
      response.content.topComentingUser = userWithMostComment
    }

    if (commentsLanguage) {
      const { languages } = getLanguages({ comments: commentsAnalyzed })
      response.content.commentsLanguage = languages
    }

    return response
  }
}

export { CreateDefaultAnalysisService }
