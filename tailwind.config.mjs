/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#2D4F8B',  // Biru utama
        secondary: '#6CBF84', // Hijau lembut
        background: '#ECF7FB', // Biru muda
        cmuda: '#333333',  // Coklat muda
      },
    },
  },
  plugins: [],
};


