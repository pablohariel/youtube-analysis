import { filterWords } from './filters'

interface Word {
  word: string,
  brothers: string[]
}

interface Response {
  words: Word[]
}

const getWordsFromComments = (comments: (string | null | undefined)[]): Response => {
  let words: Word[] = []

  for (const comment of comments) {
    if (comment) {
      for (const word of comment?.split(' ')) {
        if (word.length > 2) {
          const result: Word = {
            word: word.toLowerCase(),
            brothers: []
          }

          for (const secondaryWord of comment?.split(' ')) {
            if (secondaryWord.length > 2 && secondaryWord !== word) {
              result.brothers.push(secondaryWord.toLowerCase())
            }
          }
          words.push(result)
        }
      }
    }
  }

  words = filterWords(words)

  return { words }
}

export { getWordsFromComments }
