import { CommentAnalyzed, CommentsGroupedByPolarity } from '../../../../interfaces/comment'

interface Request {
  comments: CommentsGroupedByPolarity,
  filters: {
    includeCommentReplies: boolean
  }
}

interface Response {
  topPositiveComments: CommentAnalyzed[]
}

const getTopPositiveComments = ({ comments, filters }: Request): Response => {
  const { positive } = comments
  const { includeCommentReplies } = filters

  if (includeCommentReplies) {
    const allComments = [...positive.comments, ...positive.replies]

    const topPositiveComments = allComments.sort((commentL, commentR) => {
      if (commentL.scores && commentR.scores) {
        if (commentL.scores.posScore > commentR.scores.posScore) {
          return -1
        }
        if (commentL.scores.posScore < commentR.scores.posScore) {
          return 1
        }
        return 0
      }
      return 0
    })

    return { topPositiveComments }
  } else {
    const topPositiveComments = positive.comments.sort((commentL, commentR) => {
      if (commentL.scores && commentR.scores) {
        if (commentL.scores.posScore > commentR.scores.posScore) {
          return -1
        }
        if (commentL.scores.posScore < commentR.scores.posScore) {
          return 1
        }
        return 0
      }
      return 0
    })

    return { topPositiveComments }
  }
}

export { getTopPositiveComments }
