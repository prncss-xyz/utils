// needed es6 support for this archived package
// https://github.com/byn9826/words-count

/* eslint-disable @cspell/spellchecker */
type Config = Partial<{
	disableDefaultPunctuation: boolean
	punctuation: string[]
	punctuationAsBreaker: boolean
}>

const DEFAULT_PUNCTUATION = [
	',',
	'，',
	'.',
	'。',
	':',
	'：',
	';',
	'；',
	'[',
	']',
	'【',
	']',
	'】',
	'{',
	'｛',
	'}',
	'｝',
	'(',
	'（',
	')',
	'）',
	'<',
	'《',
	'>',
	'》',
	'$',
	'￥',
	'!',
	'！',
	'?',
	'？',
	'~',
	'～',
	"'",
	'’',
	'"',
	'“',
	'”',
	'*',
	'/',
	'\\',
	'&',
	'%',
	'@',
	'#',
	'^',
	'、',
	'、',
	'、',
	'、',
]

const EMPTY_RESULT = {
	count: 0,
	words: [],
}

export function wordsDetect(text: string, config?: Config) {
	if (text.trim() === '') return EMPTY_RESULT
	const punctuationReplacer = config?.punctuationAsBreaker ? ' ' : ''
	const defaultPunctuations = config?.disableDefaultPunctuation
		? []
		: DEFAULT_PUNCTUATION
	const customizedPunctuations = config?.punctuation || []
	const combinedPunctuations = defaultPunctuations.concat(
		customizedPunctuations,
	)
	// Remove punctuations or change to empty space
	combinedPunctuations.forEach(function (punctuation) {
		const punctuationReg = new RegExp('\\' + punctuation, 'g')
		text = text.replace(punctuationReg, punctuationReplacer)
	})
	// Remove all kind of symbols
	text = text.replace(/[\uFF00-\uFFEF\u2000-\u206F]/g, '')
	// Format white space character
	text = text.replace(/\s+/, ' ')
	// Split words by white space (For European languages)
	let words = text.split(' ')
	words = words.filter((word) => word.trim())
	// Match latin, cyrillic, Malayalam letters and numbers
	const common =
		'(\\d+)|[a-zA-Z\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u1E00-\u1EFF\u0400-\u04FF\u0500-\u052F\u0D00-\u0D7F]+|'
	// Match Chinese Hànzì, the Japanese Kanji and the Korean Hanja
	const cjk =
		'\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u3FFF\u4000-\u4DBF\u4E00-\u4FFF\u5000-\u5FFF\u6000-\u6FFF\u7000-\u7FFF\u8000-\u8FFF\u9000-\u9FFF\uF900-\uFAFF'
	// Match Japanese Hiragana, Katakana, Rōmaji
	const jp = '\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u3190-\u319F'
	// Match Korean Hangul
	const kr =
		'\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uAFFF\uB000-\uBFFF\uC000-\uCFFF\uD000-\uD7AF\uD7B0-\uD7FF'

	// eslint-disable-next-line no-misleading-character-class
	const reg = new RegExp(common + '[' + cjk + jp + kr + ']', 'g')
	let detectedWords: string[] = []
	words.forEach(function (word) {
		const carry = []
		let matched
		do {
			matched = reg.exec(word)
			if (matched) carry.push(matched[0])
		} while (matched)
		if (carry.length === 0) {
			detectedWords.push(word)
		} else {
			detectedWords = detectedWords.concat(carry)
		}
	})
	return {
		count: detectedWords.length,
		words: detectedWords,
	}
}

export function wordsCount(text: string, config?: Config) {
	return wordsDetect(text, config).count
}

export function wordsSplit(text: string, config?: Config) {
	return wordsDetect(text, config).words
}
