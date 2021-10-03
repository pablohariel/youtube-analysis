import { Comment } from './comment'

interface CommentUser {
  id: string,
  name: string,
  profileImage: string,
  commentCount: number,
  comments: Comment[]
}

export { CommentUser }
