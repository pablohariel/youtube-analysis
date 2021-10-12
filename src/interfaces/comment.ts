import { Language } from './languages'

interface Reply {
  content: string,
  author: {
    id: string,
    name: string,
    profileImage: string
  },
  likeCount: number,
  published_at: string
}

interface CommentNoReplies {
  content: string,
  author: {
    id: string,
    name: string,
    profileImage: string
  },
  likeCount: number,
  published_at: string
}

interface Comment {
  content: string,
  author: {
    id: string,
    name: string,
    profileImage: string
  },
  likeCount: number,
  replyCount: number,
  replies: {
    content: string,
    author: {
      id: string,
      name: string,
      profileImage: string
    },
    likeCount: number,
    published_at: string
  }[],
  published_at: string
}

interface CommentAnalyzed extends CommentNoReplies {
  scores?: {
    posScore: number,
    negScore: number,
    rating: number
  },
  polarity?: 'positive' | 'negative' | 'neutral',
  language: Language
}

interface CommentsGroupedByPolarity {
  positive: {
    count: number,
    comments: CommentAnalyzed[]
  },
  neutral: {
    count: number,
    comments: CommentAnalyzed[]
  },
  negative: {
    count: number,
    comments: CommentAnalyzed[]
  }
}

export { Comment, Reply, CommentNoReplies, CommentAnalyzed, CommentsGroupedByPolarity }
