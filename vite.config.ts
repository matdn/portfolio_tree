
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl';
import generateTextId from './vite.generateTextId.js';
import liveReload from 'vite-plugin-live-reload';
// import generateSchema from './vite.generateSchema.js';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    generateTextId(),
    // generateSchema(),
    basicSsl(),
    liveReload('public/**/*'),
    react({
      include: "**/*.jsx",
    }),
    glsl(),
  ],
})
