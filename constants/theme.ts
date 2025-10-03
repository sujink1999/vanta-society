export const Colors = {
  primary: "#FF5C2A",
  black: "#000000",
  white: "#FFFFFF",
  textPrimary: "#FFFFFF",
  textSecondary: "#979797",
  background: "#000000",
};

export const Fonts = {
  TussiLago: {
    ExtraLight: "TussilagoExtraLight",
    Light: "TussilagoLight",
    Regular: "TussilagoRegular",
    Bold: "TussilagoBold",
    Heavy: "TussilagoHeavy",
  },
  Montserrat: {
    Light: "Montserrat_300Light",
    Regular: "Montserrat_400Regular",
    Medium: "Montserrat_500Medium",
    SemiBold: "Montserrat_600SemiBold",
    Bold: "Montserrat_700Bold",
    ExtraBold: "Montserrat_800ExtraBold",
  },
};

export const Typography = {
  Title: {
    fontFamily: Fonts.TussiLago.Bold,
    fontSize: 32,
    color: Colors.textPrimary,
  },
  Heading: {
    fontFamily: Fonts.TussiLago.Bold,
    fontSize: 24,
    color: Colors.textPrimary,
  },
  Subheading: {
    fontFamily: Fonts.Montserrat.Regular,
    fontSize: 16,
    color: Colors.textPrimary,
  },
};
