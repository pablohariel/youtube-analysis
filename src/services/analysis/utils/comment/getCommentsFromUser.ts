import { Comment, Reply } from '../../../../interfaces/comment'

interface Request {
  usersName: string[],
  comments: Comment[],
  includeReplies: boolean
}

interface Data {
  user: {
    id: string,
    name: string,
    profileImage: string
  },
  commentsCount: number,
  comments: (Comment | Reply)[]
}

interface Response {
  dataFound: Data[]
}

const getCommentsFromUser = ({ usersName, comments, includeReplies }: Request): Response => {
  const dataFound = [] as Data[]

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
      if (includeReplies) {
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

export { getCommentsFromUser }
