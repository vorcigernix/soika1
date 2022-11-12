import ModalStore from "../utils/ModalStore";
import { useSnapshot } from "valtio";
import { useState } from "react";

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
    return <div>Missing proposal data</div>;
  }

  // Get required proposal data
  const { id, params } = proposal;
  const [{ chainId, peerMeta }] = params;
  const { icons, name, url } = peerMeta;

  return (
    <>
      <div className="text-lg">
        {chainId}
      </div>
      <div>
        {name}
      </div>
      <div>
        {url}
      </div>
    </>
  );
}
