import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(() => {
  return {
    plugins: [vue(), vueDevTools()],
    define: {
      '__APP_VERSION__': JSON.stringify(process.env.VITE_APP_VERSION || '1.0.0'),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: process.env.NODE_ENV !== 'production',
    },            
    base: '/', // ← ALTERADO PARA PRODUÇÃO
    css: {
      postcss: {
        plugins: [
          autoprefixer({}),
        ],
      },
    },
    resolve: {
      alias: [
        {
          find: /^~(.*)$/,
          replacement: '$1',
        },
        {
          find: '@/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, '/src'),
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        // vazio por enquanto
      },
    },
  }
})
