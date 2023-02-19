import pipe from 'lodash/fp/pipe'
import keys from 'lodash/fp/keys'
import any from 'lodash/fp/any'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'
import intersection from 'lodash/fp/intersection'
import size from 'lodash/fp/size'
import reject from 'lodash/fp/reject'
import sortBy from 'lodash/fp/sortBy'
import reverse from 'lodash/fp/reverse'
import slice from 'lodash/fp/slice'
import flatMap from 'lodash/fp/flatMap'

import { createLetterFrequencyMap } from '../letter-service'

export type AttemptResult = { letter: string, index: number, isCorrect: boolean, isMisplaced: boolean }

export type Attempt = {
  word: string,
  results: ReadonlyArray<AttemptResult>
}

export class WordleBoard {
  private readonly answerLength = 5
  private readonly maxNumAttempts = 6
  
  private _attempts: Array<Attempt> = []
  private _invalidLetters: Array<string> = []
  private _misplacedLetters: Record<string, Array<number>> = {}
  private _correctLetters: Record<string, number> = {}

  constructor(
    private readonly _allAnswers: string[]
  ) {}

  get numRemainingAttempts (): number {
    return this.maxNumAttempts - this._attempts.length
  }

  get hasRemainingAttempts (): boolean {
    return this.numRemainingAttempts > 0
  }

  get attempts(): ReadonlyArray<Attempt> {
    return this._attempts
  }

  get isSolved(): boolean {
    return pipe(keys, size)(this._correctLetters) === this.answerLength
  }

  private wordContainsInvalidLetter(word: string): boolean {
    return pipe(intersection(word.split('')), size)(this._invalidLetters) > 0
  }

  private wordContainsMisplacedLetter(word: string): boolean {
    return pipe(keys, any((letter) => {
      const positionInWord = word.indexOf(letter)
      return positionInWord > -1 && this._misplacedLetters[letter].includes(positionInWord)
    }))(this._misplacedLetters)
  }

  private wordIsMissingCorrectLetter(word: string): boolean {
    return pipe(keys, any((letter) => word.indexOf(letter) !== this._correctLetters[letter]))(this._correctLetters)
  }

  private calculateWordScore (frequencyMap: Record<string, number>, word: string): number {
    const letterToIndexMap = new Map<string, number>()
  
    return word.split('').reduce((score, letter, index) => {
      if (!letterToIndexMap.has(letter) && this._attempts.length < 2) {
        score += frequencyMap[letter] ?? 0
        letterToIndexMap.set(letter, index)
      }
  
      return score 
    }, 0)
  }

  addAttempt(word: string, resultStrs: Array<'correct' | 'misplaced' | 'incorrect'>): void {
    this._attempts.push({
      word,
      results: word.split('').map((letter, index) => ({
        letter,
        index,
        isCorrect: resultStrs[index] === 'correct',
        isMisplaced: resultStrs[index] === 'misplaced',
      })),
    })

    this._invalidLetters = pipe(
      flatMap('results'),
      filter({ isCorrect: false, isMisplaced: false }),
      map('letter')
    )(this._attempts)

    this._misplacedLetters = pipe(
      flatMap('results'),
      filter('isMisplaced'),
      reduce((agg, result: AttemptResult) => Object.assign(agg, {
        [result.letter]: agg[result.letter] ? agg[result.letter].concat(result.index) : [result.index]
      }), {} as Record<string, number[]>)
    )(this._attempts)

    this._correctLetters = pipe(
      flatMap('results'),
      filter('isCorrect'),
      reduce((agg, result: AttemptResult) => Object.assign(agg, {
        [result.letter]: result.index
      }), {} as Record<string, number>)
    )(this._attempts)
  }

  calculateBestGuesses(): string[] {
    const possibleAnswers = reject((word) => this.wordContainsInvalidLetter(word) || this.wordContainsMisplacedLetter(word) || this.wordIsMissingCorrectLetter(word), this._allAnswers)
    const possibleAnswerFrequencyMap = createLetterFrequencyMap(possibleAnswers)

    return pipe(
      sortBy((word: string) => this.calculateWordScore(possibleAnswerFrequencyMap, word)),
      reverse,
      slice(0, 10),
    )(possibleAnswers)
  }
}
