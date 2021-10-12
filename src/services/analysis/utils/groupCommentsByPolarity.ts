import { CommentsGroupedByPolarity, CommentAnalyzed } from '../../../interfaces/comment'

interface Request {
  comments: CommentAnalyzed[]
}

interface Response {
  commentsGrouped: CommentsGroupedByPolarity
}

const groupCommentsByPolarity = ({ comments }: Request): Response => {
  const commentsGrouped = {
    positive: {
      count: 0,
      comments: []
    },
    neutral: {
      count: 0,
      comments: []
    },
    negative: {
      count: 0,
      comments: []
    }
  } as CommentsGroupedByPolarity

  for (const comment of comments) {
    const { polarity } = comment
    if (polarity) {
      switch (polarity) {
        case 'positive': {
          commentsGrouped.positive.count++
          commentsGrouped.positive.comments.push(comment)
          break
        }
        case 'neutral': {
          commentsGrouped.neutral.count++
          commentsGrouped.neutral.comments.push(comment)
          break
        }
        case 'negative': {
          commentsGrouped.negative.count++
          commentsGrouped.negative.comments.push(comment)
          break
        }
        default:
          break
      }
    }
  }

  return { commentsGrouped }
}

export { groupCommentsByPolarity }
