"use client"; // プロジェクト全体のSSRを無効化する (一部、上手くSSR無効化が働いてなさそうな挙動がある)

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

// プロジェクト全体のSSRを無効化する
const NoSSRWrapper = dynamic(
  () =>
    import("@/components/no-ssr/NoSSRWrapper").then((mod) => mod.NoSSRWrapper),
  {
    ssr: false,
  }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSSRWrapper>
      <Component {...pageProps} />
    </NoSSRWrapper>
  );
}
