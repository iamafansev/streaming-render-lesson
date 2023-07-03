import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'custom',
  build: {
    outDir: './dist',
    assetsDir: './assets',
    manifest: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
      },
    },
  },
});
