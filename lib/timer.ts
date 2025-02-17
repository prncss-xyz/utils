export function getTimer() {
	const start = Date.now()
	return () => {
		const end = Date.now()
		return end - start
	}
}
