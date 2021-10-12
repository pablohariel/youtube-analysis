interface WordFilters {
  avoidAccentuation: boolean,
  caseSensitive: boolean,
  includeCommentReplies: boolean,
  polarity: 'good' | 'bad' | 'neutral' | 'all',
  class: 'noun' | 'verb' | 'adverb' | 'all'
}

interface PhraseFilters {
  avoidAccentuation: boolean,
  caseSensitive: boolean,
  includeCommentReplies: boolean,
}

interface UserCommentsFilters {
  caseSensitive: boolean,
  includeCommentReplies: boolean
}

interface MiningRequestData {
  videoId: string,
  userId: string,
  options: {
    wordsToFindWords?: {
      content: string[],
      filters: WordFilters
    },
    wordsToFindComments?: {
      content: string[],
      filters: WordFilters
    },
    phrasesToFindPhrases?: {
      content: string[],
      filters: PhraseFilters
    },
    phrasesToFindComments?: {
      content: string[],
      filters: PhraseFilters
    },
    usersToFindComments?: {
      content: string[],
      filters: UserCommentsFilters
    },
  },
  save: true | false,
}

interface DefaultRequestData {
  videoId: string,
  userId: string,
  options: {
    commentsPolarity?: boolean,
    positiveComments?: boolean,
    negativeComments?: boolean,
    topWords?: boolean,
    mostLikedComment?: boolean,
    wordsCount?: boolean,
    topWordsUsedTogether?: boolean,
    wordsRelatedToVideoTitle?: boolean,
    mostRepliesComment?: boolean,
    topComentingUser?: boolean,
    commentsLanguage?: boolean,
  },
  save: true | false,
}

export { MiningRequestData, WordFilters, PhraseFilters, UserCommentsFilters, DefaultRequestData }
