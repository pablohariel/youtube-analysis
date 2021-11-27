import { CommentsGroupedByPolarity, CommentAnalyzed } from '../../../../interfaces/comment'

interface Request {
  comments: CommentAnalyzed[]
}

interface Response {
  commentsGroupedByPolarity: CommentsGroupedByPolarity
}

const groupCommentsByPolarity = ({ comments }: Request): Response => {
  const commentsGrouped = {
    positive: {
      totalCount: 0,
      commentCount: 0,
      replyCount: 0,
      comments: [],
      replies: []
    },
    neutral: {
      totalCount: 0,
      commentCount: 0,
      replyCount: 0,
      comments: [],
      replies: []
    },
    negative: {
      totalCount: 0,
      commentCount: 0,
      replyCount: 0,
      comments: [],
      replies: []
    }
  } as CommentsGroupedByPolarity

  for (const comment of comments) {
    const { polarity } = comment
    if (polarity) {
      switch (polarity) {
        case 'positive': {
          commentsGrouped.positive.totalCount++
          switch (comment.type) {
            case 'comment':
              commentsGrouped.positive.commentCount++
              commentsGrouped.positive.comments.push(comment)
              break
            case 'reply':
              commentsGrouped.positive.replyCount++
              commentsGrouped.positive.replies.push(comment)
              break
          }
          break
        }
        case 'neutral': {
          commentsGrouped.neutral.totalCount++
          switch (comment.type) {
            case 'comment':
              commentsGrouped.neutral.commentCount++
              commentsGrouped.neutral.comments.push(comment)
              break
            case 'reply':
              commentsGrouped.neutral.replyCount++
              commentsGrouped.neutral.replies.push(comment)
              break
          }
          break
        }
        case 'negative': {
          commentsGrouped.negative.totalCount++
          switch (comment.type) {
            case 'comment':
              commentsGrouped.negative.commentCount++
              commentsGrouped.negative.comments.push(comment)
              break
            case 'reply':
              commentsGrouped.negative.replyCount++
              commentsGrouped.negative.replies.push(comment)
              break
          }
          break
        }
      }
    }
  }

  return { commentsGroupedByPolarity: commentsGrouped }
}

export { groupCommentsByPolarity }
