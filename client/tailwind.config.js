module.exports = {
   purge: [],
   theme: {
      extend: {
         fontSize: {
            "12": ".75rem",
            "13": ".81rem",
            "14": ".88rem",
            "15": ".94rem",
            "18": "1.13rem",
            "21": "1.31rem",
            "24": "1.5rem",
            "52": "3.25rem"
         },
         borderOpacity: {
            "10": "0.1"
         }
      },
   },
   variants: {
      textColor: ["responsive", "hover", "focus", "group-hover", "group-focus"],
      visibility: ["responsive", "hover", "focus", "group-hover", "group-focus"],
      display: ["responsive", "hover", "focus", "group-hover", "group-focus"],
   },
   plugins: [
      require("@tailwindcss/line-clamp")
   ],
}