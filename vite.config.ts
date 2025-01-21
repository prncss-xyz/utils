import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	build: {
		copyPublicDir: false,
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, 'lib/index.ts'),
			// the proper extensions will be added
			fileName: 'index',
			name: 'utils',
		},
		plugins: [dts()],
		rollupOptions: {
			external: ['@constellar/core'],
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
