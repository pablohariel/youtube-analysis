import { CommentAnalyzed, CommentsGroupedByPolarity } from '../../../interfaces/comment'

interface Request {
  comments: CommentsGroupedByPolarity
}

interface Response {
  topComments: CommentAnalyzed[]
}

const getTopComments = ({ comments }: Request): Response => {
  const topComments = comments.positive.comments.sort((commentL, commentR) => {
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

  return { topComments }
}

export { getTopComments }
