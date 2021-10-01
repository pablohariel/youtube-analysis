interface VideoData {
  id: string,
  title: string,
  description?: string,
  thumbnail: string,
  details: {
    duration: string,
    definition: string,
    caption: string
  },
  statistics: {
    viewCount: string,
    likeCount: string,
    dislikeCount: string,
    commentCount: string,
    favoriteCount: string
  },
  channelDetails: {
    id: string,
    title: string,
    thumbnail: string
  },
  defaultLanguage: string,
  published_at: string
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
