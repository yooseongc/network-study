import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/network-study/',
    resolve: {
        alias: {
            '@study-ui/components': path.resolve(__dirname, 'lib/study-ui-lib/packages/ui/src/index.ts'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('codeSnippets') || id.includes('chartData')) {
                        return 'code-snippets'
                    }
                },
            },
        },
    },
})
