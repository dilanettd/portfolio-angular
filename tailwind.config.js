/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        yellow: "#F5C32C",
        orange: "#FCA61F",
        black: "#22252c",
        gray: "#788097",
        "orange-500": "#FCA61F",
        blueCard: "#DDF8FE",
        blue: "#5664a0",
        purple: "rgb(238 210 255)",
        orangeCard: "rgba(252, 166, 31, 0.45)",
      },
      boxShadow: {
        custom: "0px 19px 60px rgb(0 0 0 / 8%)",
        smCustom: "-79px 51px 60px rgba(0, 0, 0, 0.08)",
        buttonShadow: "0px 5px 12px 3px rgba(251, 161, 40, 0.42)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        orbit: "orbit 15s linear infinite",
        fadeIn: "fadeIn 1s ease-in-out",
        slideUp: "slideUp 0.5s ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(50px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(50px) rotate(-360deg)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        // Styles de boutons personnalisés
        ".btn": {
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          fontWeight: "500",
          transition: "all 0.3s ease",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".btn-primary": {
          background: "linear-gradient(180deg, #fdc50f 26.71%, #fb982f 99.36%)",
          color: "#ffffff",
          boxShadow: "0px 5px 12px 3px rgba(251, 161, 40, 0.42)",
          "&:hover": {
            backgroundColor: "#ffffff",
            color: "#FCA61F",
            borderColor: "#FCA61F",
            borderWidth: "1px",
            background: "#ffffff",
          },
        },
        ".btn-outline": {
          backgroundColor: "transparent",
          borderWidth: "1px",
          borderColor: "#FCA61F",
          color: "#FCA61F",
          "&:hover": {
            background:
              "linear-gradient(180deg, #fdc50f 26.71%, #fb982f 99.36%)",
            color: "#ffffff",
            boxShadow: "0px 5px 12px 3px rgba(251, 161, 40, 0.42)",
          },
        },
        ".btn-sm": {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
        },
        ".btn-lg": {
          padding: "1rem 2rem",
          fontSize: "1.125rem",
        },
        ".btn-icon": {
          padding: "0.5rem",
          "& > svg, & > i": {
            width: "1.25rem",
            height: "1.25rem",
          },
        },

        // Styles d'input personnalisés
        ".form-input": {
          display: "block",
          width: "100%",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          borderWidth: "1px",
          borderColor: "#FCA61F",
          backgroundColor: "#ffffff",
          color: "#22252c",
          transition:
            "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          "&:focus": {
            outline: "none",
            boxShadow: "0 0 0 3px rgba(252, 166, 31, 0.25)",
            borderColor: "#FCA61F",
          },
          "&::placeholder": {
            color: "#788097",
            opacity: "0.7",
          },
        },
        ".form-input-dark": {
          backgroundColor: "#2a2a2a",
          color: "#f7f7f7",
          borderColor: "#FCA61F",
          "&::placeholder": {
            color: "#d0d0d0",
            opacity: "0.7",
          },
        },
        ".form-textarea": {
          minHeight: "120px",
          resize: "vertical",
        },
        ".form-label": {
          display: "block",
          marginBottom: "0.5rem",
          fontWeight: "500",
          color: "#788097",
        },
        ".form-group": {
          marginBottom: "1.5rem",
        },
        ".input-error": {
          borderColor: "#ef4444",
          "&:focus": {
            boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.25)",
          },
        },
        ".error-message": {
          color: "#ef4444",
          fontSize: "0.875rem",
          marginTop: "0.25rem",
        },
      });
    },
  ],
};
