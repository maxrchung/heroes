import type { StyleXStyles } from "@stylexjs/stylex";

// Idk, sx prop seems to work with StyleX so adding this

declare module "solid-js" {
  namespace JSX {
    // Keep T to match Solid's generic DOMAttributes interface.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface DOMAttributes<T> {
      sx?: StyleXStyles;
    }
  }
}
