import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['Modules/Web/resources/assets/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
