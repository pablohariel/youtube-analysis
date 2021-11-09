import util from 'util'
import { getSentiListWord } from './getSentiListWord'
import { SentiWord } from './getSentiWordList'
import { exec } from 'child_process'

import { prisma } from '../../../../../database/connection'
import { Word } from '@prisma/client'

export interface ClassifiedWord {
  content: string,
  simplified: string,
  class: string,
  posScore: number,
  negScore: number,
}

interface Request {
  words: string[],
  language: 'pt',
  dbWords: Word[],
  sentiWordList: SentiWord[]
}

interface Response {
  classifiedWords: ClassifiedWord[],
  newDbWords: Word[]
}

const classifyWords = async ({ words, language, dbWords, sentiWordList }: Request): Promise<Response> => {
  switch (language) {
    case 'pt': {
      const execAsync = util.promisify(exec) // 0.04ms
      const treeTaggerPath = '/home/pablohariel/TreeTagger/cmd/tree-tagger-portuguese'

      const newDbWords = [] as Word[]
      const wordsFound = [] as ClassifiedWord[]
      for (const word of words) {
        const wordFound = dbWords.filter(dbWord => dbWord.content.toLowerCase() === word.toLowerCase()) // 0.2ms

        if (wordFound.length < 1) {
          console.log('--------')
          console.log(`word ${word} not found in database`)

          const command = `echo ${word} | ${treeTaggerPath}`
          const { stdout } = await execAsync(command)

          const stdoutSplited = stdout.split('\n')
          const classifiedWord = stdoutSplited.map(word => word.split('\t'))[0]

          const tag = classifiedWord[1] ? classifiedWord[1] : 'not found'
          const wordSimplified = classifiedWord[2] ? classifiedWord[2] : classifiedWord[0].toLocaleLowerCase()
          const { sentiWordFound } = getSentiListWord({ word: wordSimplified, sentiList: sentiWordList })

          let posScore = 0
          let negScore = 0

          if (sentiWordFound) {
            posScore = sentiWordFound.posScore
            negScore = sentiWordFound.negScore
          }

          const wordCreated = await prisma.word.create({
            data: {
              content: word.toLowerCase(),
              class: tag,
              simplified: wordSimplified,
              posScore,
              negScore,
              dictionary: {
                connect: {
                  id: '61645ff7006515b60021049c'
                }
              }

            }
          })

          console.log('Created: ', wordCreated, '\n')
          console.log('--------\n')
          newDbWords.push(wordCreated)
          wordsFound.push(wordCreated)
        } else {
          wordsFound.push(wordFound[0])
        }
      }

      return { classifiedWords: wordsFound, newDbWords }
    }
    default:
      return { classifiedWords: [], newDbWords: [] }
  }
}

export { classifyWords }
