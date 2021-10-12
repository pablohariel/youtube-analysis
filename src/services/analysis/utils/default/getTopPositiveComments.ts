import { CommentAnalyzed, CommentsGroupedByPolarity } from '../../../../interfaces/comment'

interface Request {
  comments: CommentsGroupedByPolarity
}

interface Response {
  topPositiveComments: CommentAnalyzed[]
}

const getTopPositiveComments = ({ comments }: Request): Response => {
  const topPositiveComments = comments.positive.comments.sort((commentL, commentR) => {
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

export { getTopPositiveComments }
