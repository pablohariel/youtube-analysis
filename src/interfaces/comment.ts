import { Language } from './languages'

interface Reply {
  content: string
  author: {
    id: string
    name: string
    profileImage: string
  }
  likeCount: number
  published_at: string
}

interface CommentNoReplies {
  content: string
  author: {
    id: string
    name: string
    profileImage: string
  }
  likeCount: number
  published_at: string
}

interface Comment {
  content: string
  author: {
    id: string
    name: string
    profileImage: string
  }
  likeCount: number
  replyCount: number
  replies: {
    content: string
    author: {
      id: string
      name: string
      profileImage: string
    }
    likeCount: number
    published_at: string
  }[]
  published_at: string
}

interface CommentAnalyzed extends CommentNoReplies {
  type: 'comment' | 'reply'
  scores?: {
    posScore: number
    negScore: number
    rating: number
  }
  polarity?: 'positive' | 'negative' | 'neutral'
  language: Language
}

interface CommentsGroupedByPolarityNoComments {
  positive: {
    totalCount: number
    commentCount: number
    replyCount: number
  }
  neutral: {
    totalCount: number
    commentCount: number
    replyCount: number
  }
  negative: {
    totalCount: number
    commentCount: number
    replyCount: number
  }
}

interface CommentsGroupedByPolarity {
  positive: {
    totalCount: number
    commentCount: number
    replyCount: number
    comments: CommentAnalyzed[]
    replies: CommentAnalyzed[]
  }
  neutral: {
    totalCount: number
    commentCount: number
    replyCount: number
    comments: CommentAnalyzed[]
    replies: CommentAnalyzed[]
  }
  negative: {
    totalCount: number
    commentCount: number
    replyCount: number
    comments: CommentAnalyzed[]
    replies: CommentAnalyzed[]
  }
}

export { Comment, Reply, CommentNoReplies, CommentAnalyzed, CommentsGroupedByPolarity, CommentsGroupedByPolarityNoComments }
