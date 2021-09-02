interface VideoData {
  channelTitle: string | null | undefined,
  videoTitle: string | null | undefined,
  publishedAt: string | null | undefined,
  viewCount: string | null | undefined,
  likeCount: string | null | undefined,
  dislikeCount: string | null | undefined,
  commentCount: string | null | undefined
}

interface Word {
  word: string,
  brothers: string[]
}

interface Words {
  words: Word[]
}

interface Brother {
  word: string,
  timesUsed: number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined'
}

interface WordDetails {
  word: string,
  timesUsed: number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined',
  brothers: Brother[]
}

export { VideoData, Word, Words, WordDetails, Brother }
