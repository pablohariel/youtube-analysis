import { polarity } from './word/wordList'

interface getUsersmoodResponse {
  mood: 'good' | 'very good' | 'neutral' | 'bad' | 'very bad' | 'no mood'
}

interface Word {
  word: string,
  brothers: string[]
}

const getUsersMood = (words: Word[]): getUsersmoodResponse => {
  let goodComments = 0
  let badComments = 0

  for (const item of words) {
    if (polarity.ptBr.positive.includes(item.word)) {
      goodComments++
    }
    if (polarity.ptBr.negative.includes(item.word)) {
      badComments++
    }
  }

  console.log(goodComments, badComments)

  const total = goodComments + badComments

  const percentGood = (goodComments / total) * 100

  if (percentGood >= 80) return { mood: 'very good' }
  if (percentGood >= 60 && percentGood < 80) return { mood: 'good' }
  if (percentGood >= 40 && percentGood < 60) return { mood: 'neutral' }
  if (percentGood >= 20 && percentGood < 40) return { mood: 'bad' }
  if (percentGood > 0 && percentGood < 20) return { mood: 'very bad' }

  return { mood: 'no mood' }
}

export { getUsersMood }
