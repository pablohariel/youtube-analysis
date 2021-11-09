import { User } from '@prisma/client'
import { VideoData } from './videoData'
import {} from './responseData'
import { DefaultRequest, MiningRequest } from './requestData'
import { Comment, CommentAnalyzed, CommentsGroupedByPolarityNoComments } from './comment'
import { JoinedWord } from './word'
import { WordsTogether } from './wordsTogether'
import { WordRelatedToVideoTitle } from '../services/analysis/utils/default/getWordsRelatedToVideoTitle'
import { LanguagesCount } from './languages'
import { JoinedPhrase } from './joinedPhrase'
import { CommentsFromPhrase, CommentsFromUser, CommentsFromWord } from './commentFromData'

interface IAnalysis {
  id: string
  userId: string
  user: User
  requestData: DefaultRequest | MiningRequest
  videoData: VideoData
  content: {
    commentCount?: number
    commentsPolarity?: CommentsGroupedByPolarityNoComments,
    topPositiveComments?: CommentAnalyzed[]
    topNegativeComments?: CommentAnalyzed[]
    mostLikedComment?: Comment
    mostRepliesComment?: Comment
    wordCount?: number
    topWords?: JoinedWord[]
    topWordsUsedTogether?: WordsTogether[]
    wordsRelatedToVideoTitle?: WordRelatedToVideoTitle[]
    topComentingUser?: User
    commentsLanguage?: LanguagesCount
    commentsPublicationData?: string[]
    words?: JoinedWord[]
    phrases?: JoinedPhrase[]
    commentsFromWords?: CommentsFromWord[]
    commentsFromPhrases?: CommentsFromPhrase[]
    commentsFromUsers?: CommentsFromUser[]
  }
  viewCount: number
  privacy: 'private' | 'public'
  created_at: string
  updated_at: string
}

export { IAnalysis }
