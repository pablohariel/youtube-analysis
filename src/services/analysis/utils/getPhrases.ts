import { Comment, Reply } from '../../../interfaces/comment'

interface JoinedPhrase {
  content: string,
  timesUsed: number,
  comments: (Comment | Reply)[]
}

interface Request {
  phrasesToFind: string[],
  comments: Comment[],
  includeReplies: boolean
}

interface Response {
  phrases: JoinedPhrase[]
}

const getPhrases = ({ phrasesToFind, comments, includeReplies = false }: Request): Response => {
  const phrasesFound = [] as JoinedPhrase[]

  for (const comment of comments) {
    for (const phrase of phrasesToFind) {
      if (comment.content.toLowerCase().includes(phrase.toLowerCase())) {
        let phraseAlreadyFound = false
        for (const joinedPhrase of phrasesFound) {
          if (joinedPhrase.content === phrase) {
            phraseAlreadyFound = true
            joinedPhrase.timesUsed++
            joinedPhrase.comments.push(comment)
          }
        }
        if (!phraseAlreadyFound) {
          phrasesFound.push({
            content: phrase,
            timesUsed: 1,
            comments: [comment]
          })
        }
      }
      if (includeReplies) {
        for (const reply of comment.replies) {
          if (reply.content.toLowerCase().includes(phrase.toLowerCase())) {
            let phraseAlreadyFound = false
            for (const joinedPhrase of phrasesFound) {
              if (joinedPhrase.content === phrase) {
                phraseAlreadyFound = true
                joinedPhrase.timesUsed++
                joinedPhrase.comments.push(reply)
              }
            }
            if (!phraseAlreadyFound) {
              phrasesFound.push({
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

  return { phrases: phrasesFound }
}

export { getPhrases }
