import { create } from "twrnc";
import { Colors, Fonts } from "./theme";

// Create configured twrnc instance with Vanta Society theme
const tw = create({
  theme: {
    extend: {
      colors: {
        // Vanta Society brand colors
        primary: Colors.primary,
        black: Colors.black,
        white: Colors.white,
        textPrimary: Colors.textPrimary,
        textSecondary: Colors.textSecondary,
      },
      fontFamily: {
        // TussiLago fonts
        "tussi-extra-light": [Fonts.TussiLago.ExtraLight],
        "tussi-light": [Fonts.TussiLago.Light],
        tussi: [Fonts.TussiLago.Regular],
        "tussi-bold": [Fonts.TussiLago.Bold],
        "tussi-heavy": [Fonts.TussiLago.Heavy],

        // Montserrat fonts
        "mont-light": [Fonts.Montserrat.Light],
        mont: [Fonts.Montserrat.Regular],
        "mont-medium": [Fonts.Montserrat.Medium],
        "mont-semibold": [Fonts.Montserrat.SemiBold],
        "mont-bold": [Fonts.Montserrat.Bold],
        "mont-extrabold": [Fonts.Montserrat.ExtraBold],
      },
    },
  },
});

export default tw;
