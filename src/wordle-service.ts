import pipe from 'lodash/fp/pipe'
import reverse from 'lodash/fp/reverse'
import sortBy from 'lodash/fp/sortBy'
import curry from 'lodash/fp/curry'
import head from 'lodash/fp/head'

import { createLetterFrequencyMap } from './letter-service'
import { ALL_ANSWERS, ALL_NON_ANSWERS } from './constants'

export const calculateWordScore = curry((frequencyMap: Record<string, number>, word: string): number => {
  const letterToIndexMap = new Map<string, number>()

  return word.split('').reduce((score, letter, index) => {
    if (!letterToIndexMap.has(letter)) {
      score += frequencyMap[letter] ?? 0
      letterToIndexMap.set(letter, index)
    }

    return score 
  }, 0)
})

export const findBestFirstGuess = (allAnswers: string[], allAcceptedNonAnswers: string[]) => pipe(
  sortBy(calculateWordScore(createLetterFrequencyMap(allAnswers))),
  reverse,
  head,
)([...allAnswers, ...allAcceptedNonAnswers]) as string
