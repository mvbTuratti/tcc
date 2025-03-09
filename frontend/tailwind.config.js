/** @type {import('tailwindcss').Config} */
export default {
content: [
    "./index.html",
    "public/**/*.{jsx,ts,js,tsx}",
    "public/*/*.{jsx,ts,js,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
],
theme: {
    extend: {},
},
plugins: [],
}