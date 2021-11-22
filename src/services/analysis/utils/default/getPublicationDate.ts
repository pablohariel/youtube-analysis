import { Comment } from '../../../../interfaces/comment'

interface Request {
  comments: Comment[]
  includeReplies: boolean
}

interface Response {
  commentsPublicationDate: string[]
}

const getPublicationDate = ({ comments, includeReplies }: Request): Response => {
  const commentsPublicationDate = [] as string[]

  for (const comment of comments) {
    commentsPublicationDate.push(comment.published_at)
    if (includeReplies) {
      for (const reply of comment.replies) {
        commentsPublicationDate.push(reply.published_at)
      }
    }
  }

  return { commentsPublicationDate }
}

export { getPublicationDate }
