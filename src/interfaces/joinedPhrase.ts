import { Comment, Reply } from './comment'

interface JoinedPhrase {
  content: string,
  timesUsed: number,
  comments: (Comment | Reply)[]
}

export { JoinedPhrase }
