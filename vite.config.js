import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base를 GitHub 레포 이름으로 변경하세요 (예: '/dt-lab-website/')
// 로컬 개발 시에는 '/' 그대로 두어도 됩니다
export default defineConfig({
  plugins: [react()],
  base: '/dt-lab-website/',
})
