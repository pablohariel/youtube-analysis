import { Comment } from '../../../../interfaces/comment'
import { CommentUser } from '../../../../interfaces/commentUser'

interface Request {
  comments: Comment[]
  filters: {
    includeCommentReplies: boolean
  }
}

interface Response {
  commentsUsers: CommentUser[]
}

const getCommentsUsers = ({ comments, filters }: Request): Response => {
  const { includeCommentReplies } = filters

  const commentsUsers = [] as CommentUser[]

  for (const comment of comments) {
    const { author } = comment
    let userFound = false
    for (const user of commentsUsers) {
      if (user.id === author.id) {
        userFound = true
        user.commentCount++
        user.comments.push(comment)
      }
    }
    if (!userFound) {
      commentsUsers.push({
        id: author.id,
        name: author.name,
        profileImage: author.profileImage,
        commentCount: 1,
        comments: [comment]
      })
    }

    if (includeCommentReplies) {
      for (const reply of comment.replies) {
        let replyUserFound = false
        for (const user of commentsUsers) {
          if (user.id === reply.author.id) {
            replyUserFound = true
            user.commentCount++
            user.comments.push(reply)
          }
        }
        if (!replyUserFound) {
          commentsUsers.push({
            id: reply.author.id,
            name: reply.author.name,
            profileImage: reply.author.profileImage,
            commentCount: 1,
            comments: [reply]
          })
        }
      }
    }
  }

  return { commentsUsers }
}

export { getCommentsUsers }
