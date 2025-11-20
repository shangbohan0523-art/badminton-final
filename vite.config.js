import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. 提高警告阈值，消除 Warning
    chunkSizeWarningLimit: 1000,
    // 2. 开启代码分割 (关键！让手机加载更快)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 把 react, framer-motion 等第三方库单独打包
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})