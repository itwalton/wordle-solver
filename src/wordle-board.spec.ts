import { WordleBoard } from './wordle-board'

describe('WordleBoard', () => {
  it('ensures an answer is provided', () => {
    expect(() => new WordleBoard({ answer: '', maxAttempts: 5 })).toThrow('MUST_PROVIDE_ANSWER')
  })

  it('ensures a num max attempts is positive', () => {
    expect(() => new WordleBoard({ answer: 'toast', maxAttempts: -1 })).toThrow('MUST_PROVIDE_MAX_ATTEMPTS')
  })

  it('sets a default num max attempts', () => {
    const wordleBoard = new WordleBoard({ answer: 'toast' })

    expect(wordleBoard.numRemainingAttempts).toBe(5)
  })

  describe('.numRemainingAttempts', () => {
    it('is set from the constructor arguments', () => {
      const wordleBoard = new WordleBoard({ answer: 'coast', maxAttempts: 5 })
  
      expect(wordleBoard.numRemainingAttempts).toBe(5)
    })

    it('is reduced when an attempt is made', () => {
      const wordleBoard = new WordleBoard({ answer: 'coast', maxAttempts: 2 })
      wordleBoard.attemptAnswer('toast')
  
      expect(wordleBoard.numRemainingAttempts).toBe(1)
    })
  })

  describe('.hasRemainingAttempts', () => {
    it('is true when numRemainingAttempts is above 0', () => {
      const wordleBoard = new WordleBoard({ answer: 'coast', maxAttempts: 5 })
  
      expect(wordleBoard.hasRemainingAttempts).toBe(true)
    })

    it('is false when all attempts are exhausted', () => {
      const wordleBoard = new WordleBoard({ answer: 'coast', maxAttempts: 1 })
      wordleBoard.attemptAnswer('toast')
  
      expect(wordleBoard.hasRemainingAttempts).toBe(false)
    })
  })

  describe('.attemptAnswer', () => {
    it('prevents attempts with fewer characters than the answer', () => {
      const wordleBoard = new WordleBoard({ answer: 'clear', maxAttempts: 1 })

      expect(() => wordleBoard.attemptAnswer('more')).toThrow('TOO_SHORT')
    })

    it('prevents attempts with more characters than the answer', () => {
      const wordleBoard = new WordleBoard({ answer: 'clear', maxAttempts: 1 })

      expect(() => wordleBoard.attemptAnswer('morose')).toThrow('TOO_LONG')
    })

    it('prevents attempts after numRemainingAttempts reaches 0', () => {
      const wordleBoard = new WordleBoard({ answer: 'clear', maxAttempts: 1 })
      wordleBoard.attemptAnswer('roast')

      expect(() => wordleBoard.attemptAnswer('morey')).toThrow('OUT_OF_ATTEMPTS')
    })

    it('returns attempt state', () => {
      const wordleBoard = new WordleBoard({ answer: 'clear', maxAttempts: 1 })
      
      const result = wordleBoard.attemptAnswer('relax')

      expect(result).toStrictEqual(['OUT_OF_POSITION', 'OUT_OF_POSITION', 'OUT_OF_POSITION', 'CORRECT', 'NOT_IN_WORD'])
    })
  })

  describe('.attempts', () => {
    it('saves wrong answers', () => {
      const wordleBoard = new WordleBoard({ answer: 'clear', maxAttempts: 1 })
      wordleBoard.attemptAnswer('clove')

      expect(wordleBoard.attempts).toStrictEqual([
        { answer: 'clove', state: ['CORRECT', 'CORRECT', 'NOT_IN_WORD', 'NOT_IN_WORD', 'OUT_OF_POSITION'] }
      ])
    })
  })
})