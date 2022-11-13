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
  const proposal = ModalStore.state.data?.legacyProposal ||
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
        (a) => a !== account,
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
      <p className="font-medium text-center">
        Select address for {url} requests on the Ethereum network.
      </p>
      <div className="py-4">
      {eip155Addresses.map((address: string, index: number) => (
        <div key={index} className="py-2">
          <input
            type="checkbox"
            id={`${index}`}
            onClick={() => onSelectAccount("eip155", address)}
          />
          <label htmlFor={`${index}`} className="break-all text-sm">
            {" "}
            {address}
          </label>
        </div>
      ))}
      </div>

      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
        <button
          className={`px-8 py-3 text-lg font-semibold rounded-lg ${
            hasSelected ? "bg-[#2f5f5f] text-white" : "bg-white opacity-20"
          } text-gray-900`}
          onClick={onApprove}
          disabled={!hasSelected}
        >
          Okay
        </button>
        <button
          className="px-8 py-3 text-lg font-normal border rounded-lg bg-gray-100 text-gray-900 border-gray-300"
          onClick={onReject}
        >
          No way dude
        </button>
      </div>
    </>
  );

  const isConnectedToDapp = view === "LegacySessionProposalModal" &&
    !open &&
    selectAccountAndConnectToDapp();

  return (
    <>
      <main className={`md:w-2/3  w-11/12 mx-auto`}>
        <div className="max-w-lg border-2 border-white/20 text-gray-100 mx-auto mt-6 bg-gradient-to-tr from-[#2f5f5f] to-black/5 rounded-3xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-center items-center w-full rounded-md h-72">
                {icons && <img src={icons[0]} className="w-4 h-4 rounded mr-2" />}
                {name}
              </div>
            </div>
            <div className="space-y-2 border-2 border-white bg-white flex flex-col p-5 rounded-3xl justify-center items-center text-center">
                <h3 className=" text-black">
                  {view === "LegacySessionProposalModal" &&
                    open &&
                    selectAccountAndConnectToDapp()}
                </h3>
              <div className="leading-snug text-gray-400">
                {isConnectedToDapp && (
                  <p className="text-xl font-medium text-center">Connected</p>
                )}

                {view === "LegacySessionSendTransactionModal" && open && (
                  <LegacySessionSendTransactionModal />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
