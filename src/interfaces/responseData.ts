import { WordRelatedToVideoTitle } from '../services/analysis/utils/default/getWordsRelatedToVideoTitle'
import { Comment, CommentAnalyzed, CommentsGroupedByPolarityNoComments } from './comment'
import { CommentsFromWord, CommentsFromPhrase, CommentsFromUser } from './commentFromData'
import { CommentUser } from './commentUser'
import { JoinedPhrase } from './joinedPhrase'
import { LanguagesCount } from './languages'
import { DefaultRequest, MiningRequest } from './requestData'
import { VideoData } from './videoData'
import { JoinedWord } from './word'
import { WordsTogether } from './wordsTogether'

interface MiningResponse {
  type: 'default' | 'mining' | 'complete',
  requestData: MiningRequest,
  videoData: VideoData,
  content: {
    words?: JoinedWord[],
    phrases?: JoinedPhrase[],
    commentsFromWords?: CommentsFromWord[],
    commentsFromPhrases?: CommentsFromPhrase[],
    commentsFromUsers?: CommentsFromUser[],
  }
}

interface DefaultResponse {
  type: 'default' | 'mining' | 'complete',
  requestData: DefaultRequest,
  videoData: VideoData,
  content: {
    commentCount?: number,
    commentsPolarity?: CommentsGroupedByPolarityNoComments,
    topPositiveComments?: CommentAnalyzed[],
    topNegativeComments?: CommentAnalyzed[],
    mostLikedComment?: Comment,
    mostRepliesComment?: Comment,
    wordCount?: number,
    topWords?: JoinedWord[],
    topWordsUsedTogether?: WordsTogether[],
    wordsRelatedToVideoTitle?: WordRelatedToVideoTitle[],
    topComentingUser?: CommentUser,
    commentsLanguage?: LanguagesCount,
  }
}

export { DefaultResponse, MiningResponse }
