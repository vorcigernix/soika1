import ModalStore from "../utils/ModalStore";
import { useSnapshot } from "valtio";
import { useState } from "react";
import { legacySignClient } from "../utils/LegacyWalletConnectUtil";
import { getSdkError } from "@walletconnect/utils";
import { eip155Addresses } from "../utils/EIP155WalletUtil";

export default function Modal() {
  const { open, view } = useSnapshot(ModalStore.state);
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, string[]>
  >({});
  const hasSelected = Object.keys(selectedAccounts).length;
  // Get proposal data and wallet address from store
  const proposal = ModalStore.state.data?.legacyProposal;

  // Ensure proposal is defined
  if (!proposal) {
    return <div className="text-teal-50"></div>;
  }

  // Get required proposal data
  const { id, params } = proposal;
  const [{ chainId, peerMeta }] = params;
  const { icons, name, url } = peerMeta;

  async function onApprove() {
    if (proposal) {
      console.log(selectedAccounts);
      legacySignClient.approveSession({
        accounts: selectedAccounts["eip155"],
        chainId: chainId ?? 1,
      });
    }
    ModalStore.close();
  }

  // Handle reject action
  function onReject() {
    if (proposal) {
      legacySignClient.rejectSession(getSdkError("USER_REJECTED_METHODS"));
    }
    ModalStore.close();
  }

  return (
    <div className="text-lg text-white mt-12">
      <section className="py-6 text-gray-50">
        <div className="container mx-auto flex flex-col items-center justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48">
          <h1 className="text-5xl font-bold leading-none text-center">
            {name}
          </h1>
          <p className="text-xl font-medium text-center">
            Address {url} requests connection on the network {chainId}.
          </p>
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
            <button
              className="px-8 py-3 text-lg font-semibold rounded bg-yellow-400 text-gray-900"
              onClick={onApprove}
            >
              Okay
            </button>
            <button
              className="px-8 py-3 text-lg font-normal border rounded bg-gray-100 text-gray-900 border-gray-300"
              onClick={onReject}
            >
              No way dude
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
