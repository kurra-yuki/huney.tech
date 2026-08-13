/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/app/**/*.{ts,tsx,js,jsx}',
        './src/components/**/*.{ts,tsx,js,jsx}',
        './content/**/*.{md,mdx}'
    ],
    theme: {
        extend: {
            colors: {
                honey: '#E6A84C',
                'honey-dark': '#C6862F',
                cream: '#FFF8EE',
                brown: '#5B3B2E'
            }
        }
    },
    plugins: []
};
