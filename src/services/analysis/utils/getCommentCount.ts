import { Comment } from '../../../interfaces/comment'

interface Request {
  comments: Array<Comment>,
  includeReplies: Boolean
}

interface Response {
  commentCount: Number
}

const getCommentCount = ({ comments, includeReplies = false } : Request): Response => {
  if (includeReplies) {
    let count = 0
    for (const comment of comments) {
      ++count
      count = count + (comment.replyCount as number)
    }

    return { commentCount: count }
  }

  return { commentCount: comments.length }
}

export { getCommentCount }
