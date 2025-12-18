import type { JSX, LayoutProps } from "@tabirun/pages/preact";
import { Header } from "../components/header.tsx";

/** Root layout providing site header and full-height container. */
export default function RootLayout(props: LayoutProps): JSX.Element {
  return (
    <div className="min-h-screen">
      <Header />
      {props.children}
    </div>
  );
}
