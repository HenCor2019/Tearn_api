const LETTERS = { a: '(a|á)', e: '(e|é)', i: '(i|í)', o: '(o|ó)', u: '(u|ú)' }
const regexReplace = /a|á|e|é|i|í|o|ó|u|ú/gi

module.exports = { LETTERS, regexReplace }
