import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
  root: '.',
  build: {
    outDir: 'dist',
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'pages/search-up-top.html'),
        'new-green': resolve(__dirname, 'pages/new-green.html'),
        'side-rail': resolve(__dirname, 'pages/side-rail.html'),
        'top-of-article-old': resolve(__dirname, 'pages/top-of-article-old.html'),
        'middle-of-article': resolve(__dirname, 'pages/middle-of-article.html'),
        'bottom-of-article-embed': resolve(__dirname, 'pages/bottom-of-article-embed.html'),
        'dynamic-cta': resolve(__dirname, 'pages/dynamic-cta.html'),
        'update-askinbio': resolve(__dirname, 'pages/update-askinbio.html'),
        'search-results': resolve(__dirname, 'pages/search-results.html'),
        'ai-search-results': resolve(__dirname, 'pages/ai-search-results.html'),
        'header-html': resolve(__dirname, 'pages/header-html.html'),
        'top-rail-search': resolve(__dirname, 'pages/top-rail-search.html')
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
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'assets/**/*',
          dest: 'assets'
        },
        {
          src: 'pages/*.html',
          dest: 'pages'
        }
      ]
    })
  ]
  };
});