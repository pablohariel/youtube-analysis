interface MiningRequestWordFilters {
  avoidAccentuation: boolean,
  caseSensitive: boolean,
  includeCommentReplies: boolean,
  polarity: 'positive' | 'negative' | 'neutral' | 'all',
  class: 'noun' | 'verb' | 'adjective' | 'all'
}

interface MiningRequestPhraseFilters {
  avoidAccentuation: boolean,
  caseSensitive: boolean,
  includeCommentReplies: boolean,
}

interface MiningRequestUserFilters {
  avoidAccentuation: boolean,
  caseSensitive: boolean,
  includeCommentReplies: boolean
}

interface MiningRequest {
  videoId: string,
  userId: string,
  type: 'default' | 'mining' | 'complete'
  options: {
    wordsToFindWords?: {
      checked: boolean
      content: string[]
      filters: MiningRequestWordFilters
    },
    wordsToFindComments?: {
      checked: boolean
      content: string[]
      filters: MiningRequestWordFilters
    },
    phrasesToFindPhrases?: {
      checked: boolean
      content: string[]
      filters: MiningRequestPhraseFilters
    },
    phrasesToFindComments?: {
      checked: boolean
      content: string[]
      filters: MiningRequestPhraseFilters
    },
    usersToFindComments?: {
      checked: boolean
      content: string[]
      filters: MiningRequestUserFilters
    },
  },
  save: boolean,
}

interface DefaultRequestCommentFilters {
  checked: boolean
  includeCommentReplies: boolean
}

interface DefaultRequestWordFilters {
  checked: boolean
  includeCommentReplies: boolean,
  avoidAccentuation: boolean,
  caseSensitive: boolean
}

interface DefaultRequest {
  videoId: string,
  userId: string,
  type: 'default' | 'mining' | 'complete'
  options: {
    commentCount?: DefaultRequestCommentFilters,
    commentsPolarity?: DefaultRequestCommentFilters,
    topPositiveComments?: DefaultRequestCommentFilters,
    topNegativeComments?: DefaultRequestCommentFilters,
    mostLikedComment?: DefaultRequestCommentFilters,
    mostRepliesComment?: {
      checked: boolean
    },
    wordCount?: DefaultRequestWordFilters,
    topWords?: DefaultRequestWordFilters,
    topWordsUsedTogether?: DefaultRequestWordFilters,
    wordsRelatedToVideoTitle?: DefaultRequestWordFilters,
    topComentingUser?: DefaultRequestCommentFilters,
    commentsLanguage?: DefaultRequestCommentFilters,
    commentsPublicationDate?: DefaultRequestCommentFilters
  },
  save: boolean
}

export { DefaultRequest, MiningRequest }
