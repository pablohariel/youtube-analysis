import { Comment } from '../../../interfaces/comment'

interface Request {
  comments: Comment[],
  filter: 'mostLikes' | 'mostDislikes' | 'mostReplies' | 'oldest' | 'newest'
}

interface Response {
  comment?: Comment
}

const getComment = ({ comments, filter = 'mostLikes' } : Request): Response => {
  switch (filter) {
    case 'mostLikes': {
      const comment = comments.sort((commentL, commentR) => {
        if (commentL.likeCount > commentR.likeCount) {
          return -1
        }
        if (commentL.likeCount < commentR.likeCount) {
          return 1
        }
        return 0
      })[0]

      return { comment }
    }

    case 'oldest': {
      const comment = comments.sort((commentL, commentR) => {
        const dateL = new Date(commentL.published_at as string)
        const dateR = new Date(commentR.published_at as string)

        if (dateL > dateR) {
          return 1
        }
        if (dateL < dateR) {
          return -1
        }
        return 0
      })[0]

      return { comment }
    }

    case 'newest': {
      const comment = comments.sort((commentL, commentR) => {
        const dateL = new Date(commentL.published_at as string)
        const dateR = new Date(commentR.published_at as string)

        if (dateL > dateR) {
          return -1
        }
        if (dateL < dateR) {
          return 1
        }
        return 0
      })[0]

      return { comment }
    }

    case 'mostReplies': {
      const comment = comments.sort((commentL, commentR) => {
        if (commentL.replyCount > commentR.replyCount) {
          return -1
        }
        if (commentL.replyCount < commentR.replyCount) {
          return 1
        }
        return 0
      })[0]

      return { comment }
    }

    default:
      return { comment: undefined }
  }
}

export { getComment }
