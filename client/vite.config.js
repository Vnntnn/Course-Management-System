import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
<<<<<<< HEAD
=======
import vueDevTools from 'vite-plugin-vue-devtools'
>>>>>>> frontend
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
<<<<<<< HEAD
    tailwindcss(),
=======
    vueDevTools(),
    tailwindcss()
>>>>>>> frontend
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
<<<<<<< HEAD
    }
  }
=======
    },
  },
>>>>>>> frontend
})
