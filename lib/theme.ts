import { Appearance, StyleSheet } from "react-native";

// ─── Colors ────────────────────────────────────────────────────────────────

export const colors = {
  primary: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },
  stone: {
    50: "#FAFAF9",
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D6D3D1",
    400: "#A8A29E",
    500: "#78716C",
    600: "#57534E",
    700: "#44403C",
    800: "#292524",
    900: "#1C1917",
  },
  red: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    500: "#EF4444",
    600: "#DC2626",
    800: "#991B1B",
    900: "#7F1D1D",
    950: "#450A0A",
  },
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

export const darkColors = {
  bg: "#0C0A09",
  card: "#1C1917",
  border: "#292524",
  surface: "#292524",
  text: "#FAFAF9",
  textSecondary: "#A8A29E",
};

// ─── Helper ────────────────────────────────────────────────────────────────

export function isDark() {
  return Appearance.getColorScheme() === "dark";
}

// ─── Common styles ─────────────────────────────────────────────────────────

export const common = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: colors.stone[50],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  flex1: {
    flex: 1,
  },
});
