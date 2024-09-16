import { defineConfig } from 'tsup'

export default defineConfig({
    entryPoints: ['./src/index.ts', './src/effect.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    target: 'esnext',
    external: ['effect'],
})
