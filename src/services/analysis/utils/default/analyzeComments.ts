import winkNLP from 'wink-nlp'
import model from 'wink-eng-lite-model'
import its from 'wink-nlp/src/its.js'
import { prisma } from '../../../../database/connection'

import { Comment, CommentAnalyzed, Reply } from '../../../../interfaces/comment'

import { classifyWords, ClassifiedWord } from './utils/classifyWords'
import { guessLanguage } from './utils/guessLanguage'
import { getSentiWordList } from './utils/getSentiWordList'

interface Request {
  comments: (Comment | Reply)[]
}

interface Response {
  commentsAnalyzed: CommentAnalyzed[]
}

const analyzeComments = async ({ comments }: Request): Promise<Response> => {
  const nlp = winkNLP(model)

  const commentsClassified = [] as CommentAnalyzed[]

  const { sentiWordList } = await getSentiWordList()

  const dictionaryPtBr = await prisma.dictionary.findFirst({
    where: {
      language: 'pt-br'
    },
    include: {
      words: true
    }
  })

  if (!dictionaryPtBr) {
    console.log('dictionary not found')
    return { commentsAnalyzed: [] }
  }

  const dbWords = dictionaryPtBr.words

  const test = dbWords.filter(word => word.content === 'legal')
  console.log(test)

  for (const comment of comments) {
    const { language } = guessLanguage({ text: comment.content })

    // verifica se idioma é suportado
    if (language !== 'pt') {
      commentsClassified.push({
        ...comment,
        language: language
      })
      continue
    }

    const commentDoc = nlp.readDoc(comment.content)
    const sentences = commentDoc.sentences().out()
    const stopWordsPtBr = ['href', 'lo', 'br', 'R', 'r']

    const commentSentencesClassified = [] as { content: string, words: ClassifiedWord[], scores: {
      posScore: number,
      negScore: number
     }}[]
    const commentWords = [] as ClassifiedWord[]

    for (const sentence of sentences) {
      const sentenceDoc = nlp.readDoc(sentence)
      const sentencesWords = sentenceDoc.tokens().filter((t) => t.out(its.type) === 'word' && !t.out(its.stopWordFlag) && !stopWordsPtBr.includes(t.out())).out()

      const { classifiedWords } = await classifyWords({ words: sentencesWords, language, dbWords, sentiWordList })

      commentWords.push(...classifiedWords)

      let posScore = 0
      let negScore = 0
      for (let i = 0; i < classifiedWords.length; i++) {
        if (classifiedWords.length === 1) {
          posScore += classifiedWords[0].posScore
          negScore += classifiedWords[0].negScore
        }
        if (classifiedWords[i].class[0] === 'N') {
          for (let iL = i - 3; iL < i; iL++) {
            if (iL >= 0) {
              if (classifiedWords[iL].class === 'AQ0') {
                let negativeAdverbFound = false
                for (let iLeftVerb = iL - 2; iLeftVerb < iL; iLeftVerb++) {
                  if (iLeftVerb >= 0 && iLeftVerb - 1 >= 0) {
                    if (classifiedWords[iLeftVerb].class[0] === 'V') {
                      if (classifiedWords[iLeftVerb - 1].class === 'RN') {
                        negativeAdverbFound = true
                      }
                    }
                  }
                }

                if (negativeAdverbFound) {
                  posScore += classifiedWords[iL].negScore
                  negScore += classifiedWords[iL].posScore
                } else {
                  posScore += classifiedWords[iL].posScore
                  negScore += classifiedWords[iL].negScore
                }
              }
            }
          }
          for (let iR = i + 3; iR > i; iR--) {
            if (iR >= 0 && iR < classifiedWords.length) {
              if (classifiedWords[iR].class === 'AQ0') {
                if (classifiedWords[iR]) {
                  let negativeAdverbFound = false
                  for (let iRightVerb = iR - 2; iRightVerb < iR; iRightVerb++) {
                    if (iRightVerb >= 0 && iRightVerb - 1 >= 0) {
                      if (classifiedWords[iRightVerb].class[0] === 'V') {
                        if (classifiedWords[iRightVerb - 1].class === 'RN') {
                          negativeAdverbFound = true
                        }
                      }
                    }
                  }
                  if (negativeAdverbFound) {
                    posScore += classifiedWords[iR].negScore
                    negScore += classifiedWords[iR].posScore
                  } else {
                    posScore += classifiedWords[iR].posScore
                    negScore += classifiedWords[iR].negScore
                  }
                }
              }
            }
          }
        }
      }

      commentSentencesClassified.push({ scores: { posScore, negScore }, content: sentence, words: classifiedWords })
    }

    let posScore = 0
    let negScore = 0
    let rating = 3

    for (const sentence of commentSentencesClassified) {
      const { scores } = sentence
      posScore += scores.posScore
      negScore += scores.negScore
    }

    if (posScore > negScore && posScore - negScore >= 0.25) {
      rating = 5
    } else if (posScore > negScore && posScore - negScore < 0.25) {
      rating = 4
    } else if (posScore === negScore) {
      rating = 3
    } else if (posScore < negScore && negScore - posScore < 0.25) {
      rating = 2
    } else if (posScore < negScore && negScore - posScore >= 0.25) {
      rating = 1
    }

    const { author, content, likeCount, published_at } = comment

    let polarity = 'neutral' as 'positive' | 'neutral' | 'negative'
    if (posScore > negScore) {
      polarity = 'positive'
    }
    if (negScore > posScore) {
      polarity = 'negative'
    }
    if (posScore === negScore) {
      polarity = 'neutral'
    }

    commentsClassified.push({
      author,
      content,
      likeCount,
      scores: {
        posScore,
        negScore,
        rating
      },
      language: language,
      polarity,
      published_at
    })
  }

  return { commentsAnalyzed: commentsClassified }
}

export { analyzeComments }
