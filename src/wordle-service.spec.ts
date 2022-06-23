import { calculateWordScore, findBestFirstGuess } from './wordle-service'

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

  describe('.findBestFirstGuess', () => {
    it('finds the best first guess', () => {
      const allAnswers = ['cigar', 'coast', 'orate', 'toast']
      const allAcceptedNonAnswers = ['crazz', 'latey']
  
      const bestFirstGuess = findBestFirstGuess(allAnswers, allAcceptedNonAnswers)
  
      expect(bestFirstGuess).toBe('coast')
    })
  })
})