import { promises as fs } from 'fs'
import { ALL_ANSWERS, ALL_NON_ANSWERS } from './constants'

import { WordleBoard } from './wordle-board'

(async () => {
  const wordleBoard = new WordleBoard(ALL_ANSWERS, ALL_NON_ANSWERS)
  
  const results = JSON.parse(await fs.readFile('./results.json', 'utf-8')) as ReadonlyArray<{ word: string, results: Array<'correct' | 'misplaced' | 'incorrect'> }>
  results.forEach(({ word, results }) => wordleBoard.addAttempt(word, results))

  console.log('next guess', wordleBoard.calculateBestGuess())
})()