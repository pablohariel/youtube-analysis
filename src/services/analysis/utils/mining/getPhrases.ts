import { Comment } from '../../../../interfaces/comment'
import { JoinedPhrase } from '../../../../interfaces/joinedPhrase'
import { PhraseFilters } from '../../../../interfaces/requestData'

interface Request {
  phrasesToFind: string[],
  comments: Comment[],
  filters: PhraseFilters
}

interface Response {
  dataFound: JoinedPhrase[]
}

const getPhrases = ({ phrasesToFind, comments, filters }: Request): Response => {
  const { includeCommentReplies } = filters

  const dataFound = [] as JoinedPhrase[]

  for (const comment of comments) {
    for (const phrase of phrasesToFind) {
      if (comment.content.toLowerCase().includes(phrase.toLowerCase())) {
        let phraseAlreadyFound = false

        for (const joinedPhrase of dataFound) {
          if (joinedPhrase.content === phrase) {
            phraseAlreadyFound = true
            joinedPhrase.timesUsed++
            joinedPhrase.comments.push(comment)
          }
        }
        if (!phraseAlreadyFound) {
          dataFound.push({
            content: phrase,
            timesUsed: 1,
            comments: [comment]
          })
        }
      }
      if (includeCommentReplies) {
        for (const reply of comment.replies) {
          if (reply.content.toLowerCase().includes(phrase.toLowerCase())) {
            let phraseAlreadyFound = false

            for (const joinedPhrase of dataFound) {
              if (joinedPhrase.content === phrase) {
                phraseAlreadyFound = true
                joinedPhrase.timesUsed++
                joinedPhrase.comments.push(reply)
              }
            }
            if (!phraseAlreadyFound) {
              dataFound.push({
                content: phrase,
                timesUsed: 1,
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

export { getPhrases }
