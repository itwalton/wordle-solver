import pipe from 'lodash/fp/pipe'
import reverse from 'lodash/fp/reverse'
import sortBy from 'lodash/fp/sortBy'
import curry from 'lodash/fp/curry'
import head from 'lodash/fp/head'

import { type Attempt } from '../wordle-board'
import { createLetterFrequencyMap } from '../letter-service'

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

export const calculateNextGuess = ({
  possibleAnswers,
  acceptedNonAnswers,
  attemptNum,
}: {
  possibleAnswers: string[],
  acceptedNonAnswers: string[],
  attemptNum: number
}) => {
  const possibleAnswerFrequencyMap = createLetterFrequencyMap(possibleAnswers)
  
  const possibleGuesses = [...possibleAnswers]
  if (attemptNum < 2) {
    possibleGuesses.push(...acceptedNonAnswers)
  }

  return pipe(
    sortBy(calculateWordScore(possibleAnswerFrequencyMap)),
    reverse,
    head,
  )(possibleGuesses) as string
}

export const isWordAPossibleAnswer = curry(({
  invalidLetters,
  misplacedLetters,
  correctLetters
}: {
  invalidLetters: Array<string>,
  misplacedLetters: Record<string, number[]>,
  correctLetters: Record<string, number>
}, word: string) => {
  const wordContainsInvalidLetter = invalidLetters.some((letter) => word.includes(letter))
  const wordIsMissingCorrectLetter = Object.keys(correctLetters).some((letter) => word.indexOf(letter) !== correctLetters[letter])
  const wordIsMissingMisplacedLetter = Object.keys(misplacedLetters).some((letter) => {
    const positionInWord = word.indexOf(letter)
    return positionInWord < 0 || misplacedLetters[letter].includes(positionInWord)
  })

  return !wordContainsInvalidLetter && !wordIsMissingCorrectLetter && !wordIsMissingMisplacedLetter
})
