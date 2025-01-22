// could be a transducer
export function scanForm<T, Acc>({
	foldFn,
	init,
}: {
	foldFn: (t: T, acc: Acc) => Acc
	init: () => Acc
}) {
	let acc0 = init()
	return {
		foldFn: (t: T, acc: Acc[]) => {
			acc0 = foldFn(t, acc0)
			acc.push(acc0)
			return acc
		},
		init: () => [],
	}
}
