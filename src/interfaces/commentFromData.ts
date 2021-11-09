import { Comment, Reply } from './comment'

interface CommentsFromWord {
  word: string,
  commentsCount: number,
  comments: (Comment | Reply)[]
}

interface CommentsFromPhrase {
  phrase: string,
  commentsCount: number,
  comments: (Comment | Reply)[]
}

interface CommentsFromUser {
  user: {
    id: string,
    name: string,
    profileImage: string
  },
  commentsCount: number,
  comments: (Comment | Reply)[]
}

export { CommentsFromWord, CommentsFromPhrase, CommentsFromUser }
