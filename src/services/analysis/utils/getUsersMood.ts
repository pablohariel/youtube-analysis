import { moodFilter } from './wordList'

interface getUsersmoodResponse {
  mood: 'good' | 'very good' | 'moderate' | 'bad' | 'very bad' | 'no mood'
}

const getUsersMood = (words: string[]): getUsersmoodResponse => {
  let goodComments = 0
  let badComments = 0

  for (const word of words) {
    if (moodFilter.good.includes(word)) {
      goodComments++
    }
    if (moodFilter.bad.includes(word)) {
      badComments++
    }
  }

  console.log(goodComments, badComments)

  const total = goodComments + badComments

  const percentGood = (goodComments / total) * 100

  if (percentGood >= 80) return { mood: 'very good' }
  if (percentGood >= 60 && percentGood < 80) return { mood: 'good' }
  if (percentGood >= 40 && percentGood < 60) return { mood: 'moderate' }
  if (percentGood >= 20 && percentGood < 40) return { mood: 'bad' }
  if (percentGood > 0 && percentGood < 20) return { mood: 'very bad' }

  return { mood: 'no mood' }
}

export { getUsersMood }
