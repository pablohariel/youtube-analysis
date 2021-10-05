import { JoinedWord, Word } from '../../../../interfaces/word'
import { getCommentWords } from './utils/getCommentWords'

interface Request {
  words: Word[],
  videoId: string
}

interface Response {
  joinedWords: JoinedWord[]
}

const getJoinedWords = ({ words, videoId }: Request): Response => {
  const joinedWords = [] as JoinedWord[]

  for (const word of words) {
    const { words: commentWords } = getCommentWords({ comment: word.comment.content, videoId })
    const uniqueCommentWords = [...new Set(commentWords)]
    let wordFound = false

    for (const joinedWord of joinedWords) {
      if (joinedWord.content === word.content) {
        wordFound = true
        joinedWord.timesUsed++

        let joinedWordCommentFound = false
        for (const joinedWordComment of joinedWord.comments) {
          if (joinedWordComment.content === word.comment.content) {
            joinedWordCommentFound = true
          }
        }

        if (!joinedWordCommentFound) {
          joinedWord.comments.push(word.comment)

          for (const commentWord of uniqueCommentWords) {
            let brotherFound = false
            if (commentWord !== joinedWord.content) {
              for (const brother of joinedWord.brothers) {
                if (brother.content === commentWord) {
                  brotherFound = true
                  brother.timesUsed++
                }
              }
              if (!brotherFound) {
                joinedWord.brothers.push({
                  content: commentWord,
                  timesUsed: 1,
                  class: '',
                  languages: [],
                  polarity: ''
                })
              }
            }
          }
        }
      }
    }
    if (!wordFound) {
      const newJoinedWord = {} as JoinedWord
      newJoinedWord.content = word.content
      newJoinedWord.class = word.class
      newJoinedWord.polarity = word.polarity
      newJoinedWord.languages = word.languages
      newJoinedWord.timesUsed = 1
      newJoinedWord.comments = [word.comment]
      newJoinedWord.brothers = []

      for (const commentWord of uniqueCommentWords) {
        let brotherFound = false
        if (commentWord !== newJoinedWord.content) {
          for (const brother of newJoinedWord.brothers) {
            if (brother.content === commentWord) {
              brotherFound = true
            }
          }
          if (!brotherFound) {
            newJoinedWord.brothers.push({
              content: commentWord,
              timesUsed: 1,
              class: '',
              languages: [],
              polarity: ''
            })
          }
        }
      }

      joinedWords.push(newJoinedWord)
    }
  }

  return { joinedWords }
}

export { getJoinedWords }
