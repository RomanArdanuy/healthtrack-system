module.exports = {
    content: [
      "./App.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        //estos colores los podemos personalizar en el futuro.
        colors: {
          primary: '#4F46E5',     // Indigo
          secondary: '#10B981',   // Emerald
          error: '#EF4444',       // Red
          warning: '#F59E0B',     // Amber
          info: '#3B82F6',        // Blue
          background: '#F3F4F6',  // Gray-100
          card: '#FFFFFF',        // White
          text: {
            primary: '#1F2937',   // Gray-800
            secondary: '#4B5563', // Gray-600 
            tertiary: '#6B7280',  // Gray-500
          },
          border: '#E5E7EB',      // Gray-200
        },
        fontFamily: {
          sans: ['System', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }