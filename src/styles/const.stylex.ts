import * as stylex from "@stylexjs/stylex";

export const borderRadius = stylex.defineConsts({
  4: "4px",
});

export const breakpoint = stylex.defineConsts({
  desktop: "@media (min-width: 900px)",
});

export const color = stylex.defineConsts({
  tileBg: "#1a1c29",
  tileHoverBg: "#232638",
  pageBg: "#0d0e16",
  textPrimary: "#eeefff",
  textSecondary: "#eeefffbf",
});

export const fontFamily = stylex.defineConsts({
  body: "sans-serif",
  heading: "serif",
});

export const fontSize = stylex.defineConsts({
  16: "16px",
  20: "20px",
  24: "24px",
  32: "32px",
});

export const fontWeight = stylex.defineConsts({
  400: "400",
});

export const space = stylex.defineConsts({
  4: "4px",
  8: "8px",
  12: "12px",
  16: "16px",
  24: "24px",
  36: "36px",
});

export const size = stylex.defineConsts({
  iconSize: "16px",
  linkSize: "24px",
  pageWidth: "1000px",
  scrollOffset: "80px", // Manually measured navbar
  searchWidth: "400px",
  thumbnailSize: "48px",
  tileWidth: "180px",
  tocWidth: "200px",
});

export const zIndex = stylex.defineConsts({
  navbar: 10,
});
