# Wordle Solver

Rough attempt at scripting wordle solver.

Relies on two user-supplied files:
  1. `constants.ts`: the list of all possible guesses
  2. `results.ts`: the list of current guesses and their result

## Instructions

0. Open wordle site in browser
1. Extract list of possible guesses from wordle javascript
2. Export all possible guesses from constants `export const ALL_ANSWERS = [...]`
3. Install dependencies `npm i`
4. Add empty array to `results.json`
5. Run the application `npm start`
6. Use one of the suggested words to make a guess on wordle site
7. Add attempt and results to `results.json` (ex. `{ "word": "arose", "results": ["incorrect", "incorrect", "correct", "correct", "incorrect"] }`)
8. Repeat steps #5-7 until complete

## TODOs

- [ ] Automate possible guesses extraction
- [ ] Use stdin instead of JSON file
- [ ] Automate results entry (?)
- [ ] Support alternative wordle formats (ex. quordle)