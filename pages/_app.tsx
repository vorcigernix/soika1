import "../styles/globals.css";
import type { AppProps } from "next/app";
import Modal from "../components/Modal";
import useInitialization from "../hooks/useInitialization";
import useWalletConnectEventsManager from "../hooks/useWalletConnectEventsManager";
import { createLegacySignClient } from "../utils/LegacyWalletConnectUtil";

export default function App({ Component, pageProps }: AppProps) {
    // Step 1 - Initialize wallets and wallet connect client
    const initialized = useInitialization()

    // Step 2 - Once initialized, set up wallet connect event manager
    useWalletConnectEventsManager(initialized)
  
    // Backwards compatibility only - create a legacy v1 SignClient instance.
    createLegacySignClient()
  return (
    <>
      <Component {...pageProps} />
      <Modal />
    </>
  );
}
