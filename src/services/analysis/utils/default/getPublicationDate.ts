import { Comment } from '../../../../interfaces/comment'

interface Request {
  comments: Comment[]
  filters: {
    includeCommentReplies: boolean
  }
}

interface Response {
  commentsPublicationDate: string[]
}

const getPublicationDate = ({ comments, filters }: Request): Response => {
  const { includeCommentReplies } = filters
  const commentsPublicationDate = [] as string[]

  for (const comment of comments) {
    commentsPublicationDate.push(comment.published_at)
    if (includeCommentReplies) {
      for (const reply of comment.replies) {
        commentsPublicationDate.push(reply.published_at)
      }
    }
  }

  return { commentsPublicationDate }
}

export { getPublicationDate }
