/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      // Inclure toutes les couleurs par défaut de Tailwind
      ...require('tailwindcss/colors'),
      // Puis ajouter vos couleurs personnalisées
      'red-fc': '#e50020',
      'gray-fc': '#303338',
    },
  },
  plugins: [],
}

