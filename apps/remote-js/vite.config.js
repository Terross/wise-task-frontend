import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        federation({
            name: 'remote-js',
            filename: 'remoteEntry.js',
            exposes: {
                './renderApp': './src/main.js', // Только здесь указываем exposes
            },
            shared: [], // Убираем vue, так как это vanilla JS
        }),
    ],
    server: {
        port: 3001,
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    },
    preview: {
        port: 3001,
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    },
    build: {
        target: 'esnext',
        modulePreload: false,
        cssCodeSplit: false,
        outDir: 'dist',
        assetsDir: 'assets',
    },
    // Удаляем дублирующий exposes и лишний resolve
});