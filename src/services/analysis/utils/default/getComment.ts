import { Comment, Reply } from '../../../../interfaces/comment'

interface Request {
  comments: Comment[]
  filter: 'mostLikes' | 'mostDislikes' | 'mostReplies' | 'oldest' | 'newest'
  filters: {
    includeCommentReplies: boolean
  }
}

interface Response {
  comment?: Comment | Reply
}

const getComment = ({ comments, filter = 'mostLikes', filters } : Request): Response => {
  const { includeCommentReplies } = filters

  let commentsToFilter = [...comments] as (Comment | Reply)[]

  if (includeCommentReplies) {
    for (const comment of comments) {
      if ('replies' in comment) {
        commentsToFilter = [...commentsToFilter, ...comment.replies]
      }
    }
  }

  switch (filter) {
    case 'mostLikes': {
      const comment = commentsToFilter.sort((commentL, commentR) => {
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
      const comment = commentsToFilter.sort((commentL, commentR) => {
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
      const comment = commentsToFilter.sort((commentL, commentR) => {
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
