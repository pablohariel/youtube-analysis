import { Comment } from '../../../../../interfaces/comment'

interface Request {
  comments: Comment[],
  includeReplies: boolean
}

interface Response {
  commentCount: number
}

const getCommentCount = ({ comments, includeReplies = false } : Request): Response => {
  if (includeReplies) {
    let count = 0
    for (const comment of comments) {
      ++count
      count = count + comment.replyCount
    }

    return { commentCount: count }
  }

  return { commentCount: comments.length }
}

export { getCommentCount }
