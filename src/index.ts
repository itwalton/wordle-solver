import { ALL_ANSWERS, ALL_NON_ANSWERS } from './constants'

import { WordleBoard, WordleLetterState } from './wordle-board'
import * as wordleService from './wordle-service'

(() => {
  const wordleBoard = new WordleBoard({
    answer: ALL_ANSWERS[Math.floor(Math.random() * (ALL_ANSWERS.length - 1))],
    // answer: 'coast',
    maxAttempts: 5,
  })

  let possibleAnswers = [...ALL_ANSWERS]
  let invalidLetters: Array<string> = []
  let correctLetters: Record<string, number> = {}
  let misplacedLetters: Record<string, Array<number>> = {}

  for (let attemptNum = 0; attemptNum < 5; attemptNum++) {
    const word = wordleService.calculateNextGuess({ possibleAnswers, acceptedNonAnswers: ALL_NON_ANSWERS, attemptNum })
    const attempt = wordleBoard.attemptAnswer(word)

    attempt.result.forEach((letterState, index) => {
      const letter = word[index]

      if (letterState === WordleLetterState.CORRECT) {
        correctLetters[letter] = index
      } else if (letterState === WordleLetterState.MISPLACED) {
        if (misplacedLetters[letter]) {
          misplacedLetters[letter].push(index)
        } else {
          misplacedLetters[letter] = [index]
        }
      } else {
        invalidLetters.push(letter)
      }
    })

    possibleAnswers = possibleAnswers.filter(wordleService.isWordAPossibleAnswer({ invalidLetters, correctLetters, misplacedLetters }))

    if (attempt.result.every((letterState) => letterState === WordleLetterState.CORRECT)) {
      console.log('answer', word)
      return word
    }
  }
})()