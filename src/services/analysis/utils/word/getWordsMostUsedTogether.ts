import { JoinedWord } from '../../../../interfaces/word'
import { WordsTogether } from '../../../../interfaces/wordsTogether'
import { getCommentWords } from './utils/getCommentWords'

interface Request {
  words: JoinedWord[]
}

interface Response {
  wordsMostUsedTogether: WordsTogether[]
}

const getWordsMostUsedTogether = ({ words }: Request): Response => {
  const sortedWords = words.sort((wordL, wordR) => {
    if (wordL.brothers.length < 1 && wordR.brothers.length < 1) {
      return 0
    }
    if (wordL.brothers.length >= 1 && wordR.brothers.length < 1) {
      return -1
    }
    if (wordL.brothers.length < 1 && wordR.brothers.length >= 1) {
      return 1
    }
    if (wordL.brothers[0].timesUsed > wordR.brothers[0].timesUsed) {
      return -1
    }
    if (wordL.brothers[0].timesUsed < wordR.brothers[0].timesUsed) {
      return 1
    }
    return 0
  })

  const wordsMostUsedTogether = [] as WordsTogether[]

  for (const word of sortedWords) {
    if (word.brothers[0]) {
      let wordsAlreadyUsed = false as Boolean

      for (const item of wordsMostUsedTogether) {
        if (item.words.includes(word.content && word.brothers[0].content)) {
          wordsAlreadyUsed = true
        }
      }

      if (!wordsAlreadyUsed) {
        wordsMostUsedTogether.push({
          timesUsed: word.brothers[0].timesUsed,
          words: [word.content, word.brothers[0].content],
          comments: word.comments.filter(comment => getCommentWords({ comment: comment.content, videoId: 'freawaawd' }).words.includes(word.content && word.brothers[0].content))
        })
      }
    }
  }

  return { wordsMostUsedTogether: wordsMostUsedTogether.slice(0, 10) }
}

export { getWordsMostUsedTogether }
