interface WordSum {
  word: string,
  timesUsed: number
}

const getWordsSum = (words: string[]): WordSum[] => {
  let wordsSum: WordSum[] = []

  for (const word of words) {
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

export { getWordsSum }
