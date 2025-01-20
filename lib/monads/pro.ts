export const pro = {
	chain<A, B>(cb: (a: A) => Promise<B>) {
		return function (a: Promise<A>) {
			return a.then(cb)
		}
	},
	map<A, B>(cb: (a: A) => B) {
		return function (ap: Promise<A>) {
			return ap.then(cb)
		}
	},
	plus<A>(a: Promise<A>, b: A) {
		return a.then(() => b)
	},
	unit<A>(a: A) {
		return Promise.resolve(a)
	},
	zero: () => Promise.resolve(),
}
