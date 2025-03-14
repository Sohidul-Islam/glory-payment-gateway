/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f6ff',
                    100: '#e0eeff',
                    500: '#2563eb',
                    600: '#1d4ed8',
                    700: '#1e40af',
                },
                secondary: {
                    500: '#64748b',
                    600: '#475569',
                },
            }
        },
    },
    plugins: [],
} 