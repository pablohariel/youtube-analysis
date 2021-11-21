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

interface IDefaultAnalysis {
  id: string
  userId: string
  user: User
  requestData: DefaultRequest
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
  }
  viewCount: number
  privacy: 'private' | 'public'
  created_at: string
  updated_at: string
}

interface IMiningAnalysis {
  id: string
  userId: string
  user: User
  requestData: MiningRequest
  videoData: VideoData
  content: {
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

export { IDefaultAnalysis, IMiningAnalysis }
