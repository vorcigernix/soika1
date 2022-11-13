import ModalStore from "../utils/ModalStore";
import { useSnapshot } from "valtio";
import { useState } from "react";
import { legacySignClient } from "../utils/LegacyWalletConnectUtil";
import { getSdkError } from "@walletconnect/utils";
import { eip155Addresses } from "../utils/EIP155WalletUtil";
import LegacySessionSendTransactionModal from "../views/LegacySessionSendTransactionModal";

export default function Modal() {
  const { open, view, isConnected } = useSnapshot(ModalStore.state);
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, string[]>
  >({});
  const hasSelected = selectedAccounts["eip155"]?.length;
  // Get proposal data and wallet address from store
  const proposal =
    ModalStore.state.data?.legacyProposal ||
    ModalStore.state.data?.legacyCallRequestEvent;

  // Ensure proposal is defined
  if (!proposal) {
    return <div className="text-teal-50"></div>;
  }

  // Get required proposal data
  const { id, params } = proposal;
  const [{ chainId, peerMeta }] = params;
  const { icons, name, url } = peerMeta || {};

  // Add / remove address from EIP155 selection
  function onSelectAccount(chain: string, account: string) {
    if (selectedAccounts[chain]?.includes(account)) {
      const newSelectedAccounts = selectedAccounts[chain]?.filter(
        (a) => a !== account
      );
      setSelectedAccounts((prev) => ({
        ...prev,
        [chain]: newSelectedAccounts,
      }));
    } else {
      const prevChainAddresses = selectedAccounts[chain] ?? [];
      setSelectedAccounts((prev) => ({
        ...prev,
        [chain]: [...prevChainAddresses, account],
      }));
    }
  }

  async function onApprove() {
    if (proposal) {
      legacySignClient.approveSession({
        accounts: selectedAccounts["eip155"],
        chainId: chainId ?? 1,
      });
    }
    ModalStore.close();
  }

  // Handle reject action
  function onReject() {
    //@ts-ignore
    // isConnected = true
    ModalStore.disconnect()
    if (proposal) {
      legacySignClient.rejectSession(getSdkError("USER_REJECTED_METHODS"));
    }
    ModalStore.close();
  }

  const selectAccountAndConnectToDapp = () => (
    <>
      <p className="text-xl font-medium text-center">
        Address {url} requests connection on the Ethereum network.
      </p>
      {eip155Addresses.map((address: string, index: number) => (
        <div key={index}>
          <input
            type="checkbox"
            id={`${index}`}
            onClick={() => onSelectAccount("eip155", address)}
          />
          <label htmlFor={`${index}`} className="break-all">
            {" "}
            {address}
          </label>
        </div>
      ))}

      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
        <button
          className={`px-8 py-3 text-lg font-semibold rounded ${
            hasSelected ? "bg-yellow-400" : "bg-gray-400"
          } text-gray-900`}
          onClick={onApprove}
          disabled={!hasSelected}
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
    </>
  );

  return (
    <div className="text-lg text-white mt-12">
      <section className="py-6 text-gray-50">
        <div className="container mx-auto flex flex-col items-center justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48">
          {isConnected && <h1 className="text-5xl font-bold leading-none text-center">
            {name}
          </h1>}

          {view === "LegacySessionProposalModal" &&
            open &&
            selectAccountAndConnectToDapp()}

          {isConnected && (
            <p className="text-xl font-medium text-center">Connected</p>
          )}

          {view === "LegacySessionSendTransactionModal" && open && (
            <LegacySessionSendTransactionModal />
          )}
        </div>
      </section>
    </div>
  );
}
