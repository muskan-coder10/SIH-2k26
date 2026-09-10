/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        kisan: {
          deep: "#1A2E23",     // dark green — sidebar header, headings
          green: "#4C6B2F",    // primary green — sidebar body, buttons
          light: "#8BC34A",    // light green accent
          leaf: "#EAF4E7",     // pale leaf background tint
          mint: "#E8F3EE",     // soft mint background (light surfaces)
          wheat: "#B28A35",    // gold/mustard accent — active nav, highlights
          wheatLight: "#F3E3BE",
          orange: "#DA7F36",   // AnnDisha orange accent
          bg: "#F7FAF7",       // subtle in-card surface background
          cream: "#F1DCB2",    // AnnDisha cream page background
          ink: "#1C2A1E",
          mute: "#5B6B5D",
          wood: "#8B4A2B",     // warm brown — crop registration signboard theme
          woodDark: "#5C3220"
        }
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      boxShadow: {
        soft: "0 4px 20px rgba(31, 77, 44, 0.08)",
        card: "0 2px 12px rgba(31, 77, 44, 0.06)"
      }
    },
  },
  plugins: [],
}
