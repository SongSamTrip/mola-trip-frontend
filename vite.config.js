import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',  // 외부에서 접근 가능하도록 설정
    port: 5173,        // 원하는 포트 번호로 설정
    // 필요하다면 여기에 더 많은 서버 설정을 추가할 수 있습니다.
  }
})
