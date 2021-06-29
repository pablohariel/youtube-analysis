import { stopWords } from './stopWords'

interface WordSum {
  word: string,
  timesUsed: number
}

const getWords = (comments: (string | null | undefined)[]): string[] => {
  const words: string[] = []

  for (const comment of comments) {
    comment?.split(' ').forEach(word => {
      if (word.length > 2) {
        words.push(word.toLowerCase())
      }
    })
  }

  return words
}

const getWordsSum = (commentedWords: string[]): WordSum[] => {
  let wordsSum: WordSum[] = []

  commentedWords = getNoneStopWords(commentedWords)

  for (const word of commentedWords) {
    let wordFound = false
    for (const wordSum of wordsSum) {
      if (word === wordSum.word) {
        wordFound = true
        wordSum.timesUsed++
      }
    }
    if (!wordFound) {
      if (word.length > 2) {
        wordsSum.push({
          word: word,
          timesUsed: 1
        })
      }
    }
  }

  wordsSum = wordsSum.sort((a, b) => {
    if (a.timesUsed > b.timesUsed) {
      return -1
    }
    if (b.timesUsed > a.timesUsed) {
      return 1
    }

    return 0
  })

  return wordsSum
}

const getNoneStopWords = (words: string[]): string[] => {
  const common = stopWords

  const sentence = words.join(' ')
  const wordArr: any = sentence.match(/[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]+/g)
  const commonObj: any = {}
  const uncommonArr = []
  let word
  let i

  for (i = 0; i < common.length; i++) {
    commonObj[common[i].trim()] = true
  }

  for (i = 0; i < wordArr.length; i++) {
    word = wordArr[i].trim().toLowerCase()
    if (!commonObj[word]) {
      uncommonArr.push(word)
    }
  }

  return uncommonArr
}

export { getWords, getWordsSum, getNoneStopWords }
