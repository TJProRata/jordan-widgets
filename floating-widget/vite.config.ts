import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/embed.tsx'),
      name: 'FloatingWidget',
      fileName: 'floating-widget',
      formats: ['umd', 'iife']
    },
    rollupOptions: {
      // Don't externalize any dependencies - bundle everything
      external: [],
      output: {
        // Ensure all code is in a single file
        inlineDynamicImports: true,
        globals: {},
        assetFileNames: 'floating-widget.[ext]',
        // Ensure proper IIFE format
        format: 'iife'
      }
    },
    // Ensure minification doesn't break the global assignment
    minify: 'esbuild',
    // Include source maps for debugging
    sourcemap: true
  }
})
