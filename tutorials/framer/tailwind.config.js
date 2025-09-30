/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // If using app router (Next.js 13+)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom colors for the component
      colors: {
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(0, 0, 0, 0.1)",
        },
      },

      // Background images for gradients
      backgroundImage: {
        "gradient-135": "linear-gradient(135deg, var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
        "purple-pink": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "deep-space":
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      },

      // Backdrop blur utilities
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "20px",
      },

      // Border radius
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      // Box shadow
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-light": "0 4px 24px 0 rgba(255, 255, 255, 0.1)",
        neon: "0 0 20px rgba(168, 85, 247, 0.5)",
        "neon-pink": "0 0 30px rgba(236, 72, 153, 0.4)",
      },

      // Animation keyframes
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        tilt: "tilt 10s infinite linear",
        shimmer: "shimmer 2s linear infinite",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" },
          "100%": {
            boxShadow:
              "0 0 30px rgba(236, 72, 153, 0.8), 0 0 40px rgba(168, 85, 247, 0.6)",
          },
        },
        tilt: {
          "0%, 50%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(1deg)" },
          "75%": { transform: "rotate(-1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
      },

      // Transform style for 3D
      transformStyle: {
        "3d": "preserve-3d",
      },

      // Perspective for 3D transformations
      perspective: {
        1000: "1000px",
        2000: "2000px",
      },

      // Rotate for 3D effects
      rotate: {
        "3d-x": "rotateX(15deg)",
        "3d-y": "rotateY(15deg)",
      },

      // Custom spacing
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
    },
  },
  plugins: [
    // Custom plugin for 3D transforms
    function ({ addUtilities }) {
      const newUtilities = {
        ".preserve-3d": {
          "transform-style": "preserve-3d",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".transform-3d": {
          transform: "translateZ(50px)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
