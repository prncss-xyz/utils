interface FoldForm<T, Acc> {
	foldFn: (t: T, acc: Acc) => Acc
	init: () => Acc
}

export function asyncCollect<T, Acc>(form: FoldForm<T, Acc>) {
	return async function (source: AsyncIterable<T> | Promise<AsyncIterable<T>>) {
		let acc = form.init()
		for await (const item of await source) {
			acc = form.foldFn(item, acc)
		}
		return acc
	}
}

export function collect<T, Acc>(form: FoldForm<T, Acc>) {
	return function (source: Iterable<T>) {
		let acc = form.init()
		for (const item of source) {
			acc = form.foldFn(item, acc)
		}
		return acc
	}
}
