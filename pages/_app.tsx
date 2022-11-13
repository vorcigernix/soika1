import "../styles/globals.css";
import type { AppProps } from "next/app";
import Modal from "../components/Modal";
import useInitialization from "../hooks/useInitialization";
import useWalletConnectEventsManager from "../hooks/useWalletConnectEventsManager";
import { createLegacySignClient } from "../utils/LegacyWalletConnectUtil";

export default function App({ Component, pageProps }: AppProps) {
  // Step 1 - Initialize wallets and wallet connect client

  const initialized = useInitialization();

  // Step 2 - Once initialized, set up wallet connect event manager

  useWalletConnectEventsManager(initialized);

  // Backwards compatibility only - create a legacy v1 SignClient instance.

  createLegacySignClient();
  return (
    <>
      <header className="p-4 text-gray-100">
        <div className="container flex justify-between h-16 mx-auto md:justify-center md:space-x-8">
          <a
            rel="noopener noreferrer"
            href="#"
            aria-label="Back to homepage"
            className="flex items-center p-2"
          >
            <img src="soika.png" className="w-10 h-10 rounded-full" />
          </a>
        </div>
      </header>
      <Component {...pageProps} />
      <Modal />
    </>
  );
}
