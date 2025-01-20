import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/index.ts'),
			// the proper extensions will be added
			fileName: 'index',
			name: 'utils',
		},
		rollupOptions: {
			external: ['@constellar/core'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
		sourcemap: true,
	},
	test: {
		coverage: {
			exclude: ['src/index.ts', 'src/**/*.test.{js,ts,jsx,tsx}'],
			include: ['src/**/*.{js,ts,jsx,tsx}'],
			provider: 'v8',
			reporter: ['text', 'json', 'clover', 'lcov'],
		},
		environment: 'jsdom',
		globals: true,
		include: ['lib/**/*.test.{js,ts,jsx,tsx}'],
	},
})
