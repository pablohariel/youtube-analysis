import { Comment, Reply } from './comment'

interface WordsTogether {
  timesUsed: number
  words: string[]
  comments: (Comment | Reply)[]
}

export { WordsTogether }
