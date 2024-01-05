/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    mode: "jit",
    theme: {
        extend: {
            fontFamily: {
                inter: ["Inter", "sans-serif"],
            },
            colors: {
                "black-100": "#2B2C35",
                "primary-color": {
                    DEFAULT: "#ffb340",
                    100: "#F0D3A4",
                },
                "secondary-color": {
                    DEFAULT: "#DD73FC",
                    100: "#F5F8FF",
                },
                "secondary-orange": "#f79761",
                "light-theme": {
                    DEFAULT: "#ffffff",
                },
                "dark-theme": {
                    DEFAULT: "#2b2b2b",
                },
                grey: "#747A88",
            },
            backgroundImage: {
                pattern: "url('/pattern.png')",
                "hero-bg": "url('/blob.svg')",
            },
        },
    },
    plugins: [],
};
