export enum WordleLetterState {
  CORRECT = 'CORRECT',
  OUT_OF_POSITION = 'OUT_OF_POSITION',
  NOT_IN_WORD = 'NOT_IN_WORD'  
}

export type Attempt = { word: string, result: ReadonlyArray<WordleLetterState> }

export class WordleBoard {    
  private readonly _answer: string
  private readonly _maxAttempts: number
  
  private _attempts: Array<Attempt> = []

  constructor ({
    answer,
    maxAttempts = 5
  }: { answer: string, maxAttempts?: number }) {
    if (answer.length < 1) {
      throw new Error('MUST_PROVIDE_ANSWER')
    }

    if (maxAttempts < 1) {
      throw new Error('MUST_PROVIDE_MAX_ATTEMPTS')
    }

    this._answer = answer
    this._maxAttempts = maxAttempts
  }

  get numRemainingAttempts (): number {
    return this._maxAttempts - this._attempts.length
  }

  get hasRemainingAttempts (): boolean {
    return this.numRemainingAttempts > 0
  }

  get attempts(): ReadonlyArray<Attempt> {
    return this._attempts
  }

  attemptAnswer (word: string): Attempt {
    if (this.numRemainingAttempts <= 0) {
      throw new Error('OUT_OF_ATTEMPTS')
    } else if (word.length < this._answer.length) {
      throw new Error('TOO_SHORT')
    } else if (word.length > this._answer.length) {
      throw new Error('TOO_LONG')
    }

    const attempt = {
      word,
      result: word.split('').map((letter, index) => {
        if (this._answer[index] === letter) {
          return WordleLetterState.CORRECT
        }
  
        if (this._answer.indexOf(letter) > -1) {
          return WordleLetterState.OUT_OF_POSITION
        }
  
        return WordleLetterState.NOT_IN_WORD
      })
    }

    this._attempts.push(attempt)

    return attempt
  }
}
