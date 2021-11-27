import { CommentAnalyzed, CommentsGroupedByPolarity } from '../../../../interfaces/comment'

interface Request {
  comments: CommentsGroupedByPolarity,
  filters: {
    includeCommentReplies: boolean
  }
}

interface Response {
  topNegativeComments: CommentAnalyzed[]
}

const getTopNegativeComments = ({ comments, filters }: Request): Response => {
  const { negative } = comments
  const { includeCommentReplies } = filters

  if (includeCommentReplies) {
    const allComments = [...negative.comments, ...negative.replies]

    const topNegativeComments = allComments.sort((commentL, commentR) => {
      if (commentL.scores && commentR.scores) {
        if (commentL.scores.negScore > commentR.scores.negScore) {
          return -1
        }
        if (commentL.scores.negScore < commentR.scores.negScore) {
          return 1
        }
        return 0
      }
      return 0
    })

    return { topNegativeComments }
  } else {
    const topNegativeComments = negative.comments.sort((commentL, commentR) => {
      if (commentL.scores && commentR.scores) {
        if (commentL.scores.negScore > commentR.scores.negScore) {
          return -1
        }
        if (commentL.scores.negScore < commentR.scores.negScore) {
          return 1
        }
        return 0
      }
      return 0
    })

    return { topNegativeComments }
  }
}

export { getTopNegativeComments }
