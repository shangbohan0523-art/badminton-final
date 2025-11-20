import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. 将警告阈值调高到 1000kb (1MB)，消除烦人的警告
    chunkSizeWarningLimit: 1000, 
    // 2. 开启代码分割，把第三方库拆分出来
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 把所有 node_modules 里的依赖打包成一个 vendor 文件
            return 'vendor';
          }
        }
      }
    }
  }
})