import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { unplugin as stylex } from "@stylexjs/unplugin";

export default defineConfig({
  plugins: [stylex.vite(), solid()],
});
