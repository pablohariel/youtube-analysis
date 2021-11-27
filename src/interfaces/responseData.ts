import { WordRelatedToVideoTitle } from '../services/analysis/utils/default/getWordsRelatedToVideoTitle'
import { Comment, CommentAnalyzed, CommentsGroupedByPolarityNoComments, Reply } from './comment'
import { CommentsFromWord, CommentsFromPhrase, CommentsFromUser } from './commentFromData'
import { CommentUser } from './commentUser'
import { JoinedPhrase } from './joinedPhrase'
import { LanguagesCount } from './languages'
import { DefaultRequest, MiningRequest, CompleteRequest } from './requestData'
import { VideoData } from './videoData'
import { JoinedWord } from './word'
import { WordsTogether } from './wordsTogether'

interface MiningResponse {
  requestData: MiningRequest
  videoData: VideoData
  content: {
    words?: JoinedWord[]
    phrases?: JoinedPhrase[]
    commentsFromWords?: CommentsFromWord[]
    commentsFromPhrases?: CommentsFromPhrase[]
    commentsFromUsers?: CommentsFromUser[]
  }
}

interface DefaultResponse {
  requestData: DefaultRequest
  videoData: VideoData
  content: {
    commentCount?: number
    commentsPolarity?: CommentsGroupedByPolarityNoComments
    topPositiveComments?: CommentAnalyzed[]
    topNegativeComments?: CommentAnalyzed[]
    mostLikedComment?: Comment | Reply
    mostRepliesComment?: Comment | Reply
    wordCount?: number
    topWords?: JoinedWord[]
    topWordsUsedTogether?: WordsTogether[]
    wordsRelatedToVideoTitle?: WordRelatedToVideoTitle[]
    topComentingUser?: CommentUser
    commentsLanguage?: LanguagesCount
    commentsPublicationDate?: string[]
  }
}

interface CompleteResponse {
  requestData: CompleteRequest
  videoData: VideoData
  content: {
    commentCount?: number
    commentsPolarity?: CommentsGroupedByPolarityNoComments
    topPositiveComments?: CommentAnalyzed[]
    topNegativeComments?: CommentAnalyzed[]
    mostLikedComment?: Comment | Reply
    mostRepliesComment?: Comment | Reply
    wordCount?: number
    topWords?: JoinedWord[]
    topWordsUsedTogether?: WordsTogether[]
    wordsRelatedToVideoTitle?: WordRelatedToVideoTitle[]
    topComentingUser?: CommentUser
    commentsLanguage?: LanguagesCount
    commentsPublicationDate?: string[]
    words?: JoinedWord[]
    phrases?: JoinedPhrase[]
    commentsFromWords?: CommentsFromWord[]
    commentsFromPhrases?: CommentsFromPhrase[]
    commentsFromUsers?: CommentsFromUser[]
  }
}

export { DefaultResponse, MiningResponse, CompleteResponse }
