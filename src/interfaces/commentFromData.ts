import { Comment, Reply } from './comment'

interface CommentFromData {
  word?: string,
  phrase?: string,
  commentsCount: number,
  comments: (Comment | Reply)[]
}

export { CommentFromData }
