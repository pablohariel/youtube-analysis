interface VideoData {
  id: String,
  title: String,
  description?: String,
  thumbnail: String,
  details: {
    duration: String,
    definition: String,
    caption: String
  },
  statistics: {
    viewCount: String,
    likeCount: String,
    dislikeCount: String,
    commentCount: String,
    favoriteCount: String
  },
  channelDetails: {
    id: String,
    title: String,
    thumbnail: String
  },
  defaultLanguage: String,
  published_at: String
}

interface Comment {
  content: String,
  author: {
    id: string,
    name: String,
    profileImage: String
  },
  likeCount: Number,
  replyCount: Number,
  replies: Array<{
    content: String,
    author: {
      id: String,
      name: String,
      profileImage: String
    },
    likeCount: Number,
    published_at: String
  }>,
  published_at: String
}

interface Word {
  word: String,
  brothers: String[]
}

interface Words {
  words: Word[]
}

interface Brother {
  word: String,
  timesUsed: Number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined'
}

interface WordDetails {
  word: String,
  timesUsed: Number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined',
  brothers: Brother[]
}

export { VideoData, Word, Words, WordDetails, Brother, Comment }
