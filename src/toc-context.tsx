import { createContext, createSignal, type Accessor, type JSX } from "solid-js";
import type { TocItemProps } from "./components/toc/toc-item";

export interface TocContextValue {
  toc: Accessor<TocItemProps | null>;
  setToc: (toc: TocItemProps | null) => void;
}

export const TocContext = createContext<TocContextValue>();

export function TocProvider(props: { children: JSX.Element }) {
  const [toc, setToc] = createSignal<TocItemProps | null>(null);

  return (
    <TocContext.Provider value={{ toc, setToc }}>
      {props.children}
    </TocContext.Provider>
  );
}

