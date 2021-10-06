import { Comment, Reply } from '../comment'

interface SimpleJoinedWord {
  content: string,
  timesUsed: number,
  languages: string[],
  polarity: string,
  class: string,
}

interface JoinedWord {
  content: string,
  timesUsed: number,
  languages: string[],
  polarity: string,
  class: string,
  brothers: SimpleJoinedWord[],
  comments: (Comment | Reply) []
}

interface SimpleWord {
  content: string,
  languages: string[],
  polarity: string,
  class: string,
}

interface Word {
  content: string,
  languages: string[],
  polarity: string,
  class: string,
  comment: Comment | Reply
}

interface WordDetails {
  word: String,
  timesUsed: Number,
  polarity: 'positive' | 'negative' | 'neutral',
  class: 'adjective' | 'noun' | 'verb' | 'undefined',
}

export { SimpleJoinedWord, JoinedWord, Word, SimpleWord, WordDetails }
