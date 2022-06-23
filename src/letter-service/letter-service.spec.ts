import { createLetterFrequencyMap } from './letter-service'

describe('Letter Service', () => {
  describe('.createLetterFrequencyMap()', () => {
    let letterMap = {}

    beforeEach(() => {
      letterMap = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0,
        g: 0,
        h: 0,
        i: 0,
        j: 0,
        k: 0,
        l: 0,
        m: 0,
        n: 0,
        o: 0,
        p: 0,
        q: 0,
        r: 0,
        s: 0,
        t: 0,
        u: 0,
        v: 0,
        w: 0,
        x: 0,
        y: 0,
        z: 0,
      }
    })

    it('creates a map of all letters and the # of occurrences', () => {
      const words = ['eater']

      const letterFrequencyMap = createLetterFrequencyMap(words)

      expect(letterFrequencyMap).toStrictEqual({
        ...letterMap,
        a: 1,
        e: 2,
        r: 1,
        t: 1,
      })
    })

    it('ignores uppercase characters', () => {
      const words = ['EAter', 'eager']

      const letterFrequencyMap = createLetterFrequencyMap(words)

      expect(letterFrequencyMap).toStrictEqual({
        ...letterMap,
        a: 2,
        e: 4,
        r: 2,
        t: 1,
        g: 1,
      })
    })
  })
})