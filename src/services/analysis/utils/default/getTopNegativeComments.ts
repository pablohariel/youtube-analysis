import { CommentAnalyzed, CommentsGroupedByPolarity } from '../../../../interfaces/comment'

interface Request {
  comments: CommentsGroupedByPolarity
}

interface Response {
  topNegativeComments: CommentAnalyzed[]
}

const getTopNegativeComments = ({ comments }: Request): Response => {
  const topNegativeComments = comments.negative.comments.sort((commentL, commentR) => {
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

export { getTopNegativeComments }
