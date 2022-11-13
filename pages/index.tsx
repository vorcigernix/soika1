import { parseUri } from "@walletconnect/utils";
import Head from "next/head";
import { useState } from "react";
import { useSnapshot } from "valtio";
import QrReader from "../components/QrReader";
import { createLegacySignClient } from "../utils/LegacyWalletConnectUtil";
import ModalStore from "../utils/ModalStore";
import { signClient } from "../utils/WalletConnectUtil";

export default function Home() {
  const [uri, setUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const { isConnected } = useSnapshot(ModalStore.state);
  async function onConnect(uri: string) {
    try {
      setLoading(true);
      const { version } = parseUri(uri);

      // Route the provided URI to the v1 SignClient if URI version indicates it, else use v2.
      if (version === 1) {
        createLegacySignClient({ uri });
      } else {
        await signClient.pair({ uri });
        
      }
    } catch (err: unknown) {
      alert(err);
    } finally {
      ModalStore.connect()
      setUri("");
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Soika</title>
        <meta name="description" content="Your security bird" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`md:w-2/3  w-11/12 mx-auto ${isConnected && "hidden"}`}>
        <div className="max-w-lg border-2 border-white/20 text-gray-100 mx-auto mt-6 bg-gradient-to-tr from-[#2f5f5f] to-black/5 rounded-3xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-center object-cover object-center w-full rounded-md h-72">
                <QrReader onConnect={onConnect} />
              </div>
            </div>
            <div className="space-y-2 border-2 border-white bg-white flex flex-col p-5 rounded-3xl justify-center items-center text-center">
              <a rel="noopener noreferrer" href="#" className="block">
                <h3 className="text-xl font-semibold text-[#2f5f5f]">
                  Please scan the QR Code
                </h3>
              </a>
              <p className="leading-snug text-gray-400">
                That allows us to scan the transaction destination and try to
                warn you against mistakes or potential danger.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
