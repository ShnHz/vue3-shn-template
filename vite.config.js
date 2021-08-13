import {
  defineConfig
} from 'vite'
import path from "path";

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 文件夹别名
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@static": path.resolve(__dirname, "public/static"),
      "@img": path.resolve(__dirname, "src/assets/img"),
      "@css": path.resolve(__dirname, "src/assets/css"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@css/varuables.scss";`
      }
    }
  }
})