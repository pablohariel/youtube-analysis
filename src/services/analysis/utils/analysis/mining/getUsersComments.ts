import { Comment } from '../../../../../interfaces/comment'
import { UserCommentsFilters } from '../../../../../interfaces/requestData'
import { UserFromData } from '../../../../../interfaces/userFromData'

interface Request {
  usersName: string[],
  comments: Comment[],
  filters: UserCommentsFilters
}

interface Response {
  dataFound: UserFromData[]
}

const getUsersComments = ({ usersName, comments, filters }: Request): Response => {
  const { includeCommentReplies } = filters

  const dataFound = [] as UserFromData[]

  for (const comment of comments) {
    for (const userName of usersName) {
      if (comment.author.name.toLowerCase() === userName.toLowerCase()) {
        let authorAlreadyFound = false

        for (const item of dataFound) {
          if (item.user.name.toLowerCase() === userName.toLowerCase()) {
            authorAlreadyFound = true
            item.commentsCount++
            item.comments.push(comment)
          }
        }
        if (!authorAlreadyFound) {
          dataFound.push({
            user: comment.author,
            commentsCount: 1,
            comments: [comment]
          })
        }
      }
      if (includeCommentReplies) {
        for (const reply of comment.replies) {
          if (reply.author.name.toLowerCase() === userName.toLowerCase()) {
            let authorAlreadyFound = false

            for (const item of dataFound) {
              if (item.user.name.toLowerCase() === userName.toLowerCase()) {
                authorAlreadyFound = true
                item.commentsCount++
                item.comments.push(reply)
              }
            }
            if (!authorAlreadyFound) {
              dataFound.push({
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

  return { dataFound }
}

export { getUsersComments }
