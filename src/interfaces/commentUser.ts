import { Comment, Reply } from './comment'

interface CommentUser {
  id: string
  name: string
  profileImage: string
  commentCount: number
  comments: (Comment | Reply)[]
}

export { CommentUser }
