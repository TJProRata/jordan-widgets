import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
  root: '.',
  build: {
    outDir: 'dist',
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'pages/update-askinbio.html')
      }
    }
  },
  define: {
    'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY),
    'import.meta.env.VITE_NODE_ENV': JSON.stringify(env.NODE_ENV || 'development')
  },
  server: {
    port: 3000,
    open: '/pages/update-askinbio.html'
  },
  optimizeDeps: {
    include: [],
    exclude: []
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.')
    }
  }
  };
});