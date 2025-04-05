/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#6a5acd', // Slateblue color used in original CSS
                secondary: '#483d8b', // Darker purple used in hover states
                dark: '#010101', // Dark background color
                darkAlt: '#222' // Alternative dark background
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif']
            }
        }
    },
    plugins: []
};
