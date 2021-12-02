import { Comment, Reply } from '../../../../interfaces/comment'
import { CommentsFromUser } from '../../../../interfaces/commentFromData'

interface Request {
  usersName: string[],
  comments: Comment[],
  filters: {
    includeCommentReplies: boolean
    avoidAccentuation: boolean
    caseSensitive: boolean
  }
}

interface Response {
  commentsFromUsers: CommentsFromUser[]

}

const getUsersComments = ({ usersName, comments, filters }: Request): Response => {
  const { includeCommentReplies, avoidAccentuation, caseSensitive } = filters

  const commentsFromUsers = [] as CommentsFromUser[]

  for (let comment of comments) {
    comment.author.name = avoidAccentuation ? comment.author.name.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '') : comment.author.name
    comment.author.name = caseSensitive ? comment.author.name : comment.author.name.toLocaleLowerCase()

    for (let userName of usersName) {
      userName = avoidAccentuation ? userName.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '') : userName
      userName = caseSensitive ? userName : userName.toLocaleLowerCase()

      if (comment.author.name === userName) {
        let authorAlreadyFound = false

        for (const item of commentsFromUsers) {
          if (item.user.name === userName) {
            authorAlreadyFound = true
            item.commentsCount++
            item.comments.push(comment)
          }
        }
        if (!authorAlreadyFound) {
          commentsFromUsers.push({
            user: comment.author,
            commentsCount: 1,
            comments: [comment]
          })
        }
      }
      if (includeCommentReplies) {
        for (let reply of comment.replies) {
          reply.author.name = avoidAccentuation ? reply.author.name.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '') : reply.author.name
          reply.author.name = caseSensitive ? reply.author.name : reply.author.name.toLocaleLowerCase()

          if (reply.author.name === userName) {
            let authorAlreadyFound = false

            for (const item of commentsFromUsers) {
              if (item.user.name === userName) {
                authorAlreadyFound = true
                item.commentsCount++
                item.comments.push(reply)
              }
            }
            if (!authorAlreadyFound) {
              commentsFromUsers.push({
                user: reply.author,
                commentsCount: 1,
                comments: [reply]
              })
            }
          }
        }
      }
    }
  }

  return { commentsFromUsers }
}

export { getUsersComments }
