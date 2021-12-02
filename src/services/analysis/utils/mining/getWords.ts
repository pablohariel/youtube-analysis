import { JoinedWord } from '../../../../interfaces/word'

interface Request {
  wordsToFind: string[],
  words: JoinedWord[],
  filters: {
    avoidAccentuation: boolean
    caseSensitive: boolean
  }
}

interface Response {
  dataFound: JoinedWord[]
}

const getWords = ({ wordsToFind, words, filters }: Request): Response => {
  const { avoidAccentuation, caseSensitive } = filters

  const dataFound = [] as JoinedWord[]

  for (let wordToFind of wordsToFind) {
    wordToFind = avoidAccentuation ? wordToFind.normalize('NFD').replace(/[^A-Za-z0-9- ]/g, '') : wordToFind
    wordToFind = caseSensitive ? wordToFind : wordToFind.toLocaleLowerCase()

    const wordFound = words.filter(word => word.content === wordToFind)[0]
    if (wordFound) {
      dataFound.push(wordFound)
    }
  }

  return { dataFound }
}

export { getWords }
