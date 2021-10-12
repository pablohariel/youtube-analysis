import { CommentAnalyzed, CommentsGroupedByPolarity } from '../../../interfaces/comment'

interface Request {
  comments: CommentsGroupedByPolarity
}

interface Response {
  worstComments: CommentAnalyzed[]
}

const getWorstComments = ({ comments }: Request): Response => {
  const worstComments = comments.negative.comments.sort((commentL, commentR) => {
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

  return { worstComments }
}

export { getWorstComments }
