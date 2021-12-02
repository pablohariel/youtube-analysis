import { Comment } from '../../../../interfaces/comment'
import { JoinedPhrase } from '../../../../interfaces/joinedPhrase'

interface Request {
  phrasesToFind: string[],
  comments: Comment[],
  filters: {
    includeCommentReplies: boolean
    avoidAccentuation: boolean
    caseSensitive: boolean
  }
}

interface Response {
  dataFound: JoinedPhrase[]
}

const getPhrases = ({ phrasesToFind, comments, filters }: Request): Response => {
  const { includeCommentReplies, avoidAccentuation, caseSensitive } = filters

  const dataFound = [] as JoinedPhrase[]
  
  for (const comment of comments) {
    for (const phrase of phrasesToFind) {
      if(caseSensitive) {
        if(avoidAccentuation) {
          if (comment.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').includes(phrase.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, ''))) {
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
              if (reply.content.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').includes(phrase.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, ''))) {
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
        } else {
          if (comment.content.includes(phrase)) {
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
              if (reply.content.includes(phrase)) {
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
      } else {
        if(avoidAccentuation) {
          if (comment.content.toLowerCase().normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').includes(phrase.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').toLowerCase())) {
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
              if (reply.content.toLowerCase().normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').includes(phrase.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '').toLowerCase())) {
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
        } else {
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
      
      
    }
  }

  return { dataFound }
}

export { getPhrases }
