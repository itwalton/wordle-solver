import { calculateWordScore, calculateNextGuess, isWordAPossibleAnswer } from './wordle-service'

describe('Wordle Service', () => {
  describe('.calculateWordScore', () => {
    it('calculates the score for a given word', () => {
      const word = 'coast'

      const score = calculateWordScore({ c: 1, o: 10, a: 100, s: 1000, t: 10000 }, word)

      expect(score).toBe(11111)
    })

    it('only scores each letter once', () => {
      const word = 'toast'

      const score = calculateWordScore({ t: 1, o: 10, a: 100, s: 1000 }, word)

      expect(score).toBe(1111)
    })

    it('handles missing letters in frequency map', () => {
      const word = 'olive'

      const score = calculateWordScore({ o: 2, l: 20, i: 200, v: 2000 }, word)

      expect(score).toBe(2222)
    })
  })

  describe('.calculateNextGuess', () => {
    it('calculates the next guess from letters with most occurrences', () => {
      const possibleAnswers = ['cigar', 'coast', 'orate', 'toast']
      const acceptedNonAnswers = ['crazz', 'latey']
  
      const bestFirstGuess = calculateNextGuess({ possibleAnswers, acceptedNonAnswers, attemptNum: 0 })
  
      expect(bestFirstGuess).toBe('coast')
    })

    it('omits acceptedNonAnswers after 2nd guess', () => {
      const possibleAnswers = ['cigar', 'orate', 'toast']
      const acceptedNonAnswers = ['crazz', 'coast', 'latey']
  
      const bestFirstGuess = calculateNextGuess({ possibleAnswers, acceptedNonAnswers, attemptNum: 2 })
  
      expect(bestFirstGuess).toBe('orate')
    })
  })

  describe('.isWordAPossibleAnswer', () => {
    it('is false if the word contains an invalid letter', () => {
      const word = 'truck'
      const invalidLetters: string[] = ['t']
      const misplacedLetters: Record<string, Array<number>> = {}
      const correctLetters: Record<string, number> = { t: 0 }

      const result = isWordAPossibleAnswer({ correctLetters, invalidLetters, misplacedLetters }, word)

      expect(result).toBe(false)
    })

    it('is true if the word contains all correct letters in correct locations', () => {
      const word = 'spark'
      const invalidLetters: string[] = ['w', 'x']
      const misplacedLetters: Record<string, Array<number>> = { p: [0, 2], a: [0, 3] }
      const correctLetters: Record<string, number> = { s: 0, p: 1, a: 2, r: 3, k: 4 }

      const result = isWordAPossibleAnswer({ correctLetters, invalidLetters, misplacedLetters }, word)

      expect(result).toBe(true)
    })

    it('is false if the word is missing a correct letter', () => {
      const word = 'spark'
      const invalidLetters: string[] = []
      const misplacedLetters: Record<string, Array<number>> = {}
      const correctLetters: Record<string, number> = { a: 0 }

      const result = isWordAPossibleAnswer({ correctLetters, invalidLetters, misplacedLetters }, word)

      expect(result).toBe(false)
    })

    it('is false if the word has a misplaced letter in a known invalid position', () => {
      const word = 'truck'
      const invalidLetters: string[] = []
      const misplacedLetters: Record<string, Array<number>> = { r: [1] }
      const correctLetters: Record<string, number> = { t: 0 }

      const result = isWordAPossibleAnswer({ correctLetters, invalidLetters, misplacedLetters }, word)

      expect(result).toBe(false)
    })

    it('is false if the word has a correct letter in the wrong place', () => {
      const word = 'tacos'
      const invalidLetters: string[] = [ 'r', 'e' ]
      const misplacedLetters: Record<string, Array<number>> = { t: [ 3, 0 ], a: [ 1 ], c: [ 2 ], o: [ 3 ], s: [ 4 ] }
      const correctLetters: Record<string, number> = { o: 1, a: 2 }

      const result = isWordAPossibleAnswer({ correctLetters, invalidLetters, misplacedLetters }, word)

      expect(result).toBe(false)
    })
  })
})