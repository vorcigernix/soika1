// import ProjectInfoCard from '../components/ProjectInfoCard'
// import RequestDataCard from '../components/RequestDataCard'
// import RequesDetailsCard from '../components/RequestDetalilsCard'
// import RequestMethodCard from '../components/RequestMethodCard'
// import RequestModalContainer from '../components/RequestModalContainer'
import ModalStore from '../utils/ModalStore'
import { approveEIP155Request, rejectEIP155Request } from '../utils/EIP155RequestHandlerUtil'
import { legacySignClient } from '../utils/LegacyWalletConnectUtil'
// import { Button, Divider, Loading, Modal, Text } from '@nextui-org/react'
import { Fragment, useState } from 'react'

export default function LegacySessionSendTransactionModal() {
  const [loading, setLoading] = useState(false)

  // Get request and wallet data from store
  const requestEvent = ModalStore.state.data?.legacyCallRequestEvent
  const requestSession = ModalStore.state.data?.legacyRequestSession

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <div>Missing request data</div>
  }

  // Get required proposal data
  const { id, method, params } = requestEvent
  const transaction = params[0]

  // // Remove unneeded key coming from v1 sample dapp that throws Ethers.
  if (transaction['gas']) delete transaction['gas']

  // Handle approve action
  async function onApprove() {
    if (requestEvent) {
      const { result } = await approveEIP155Request({
        id,
        topic: '',
        params: { request: { method, params }, chainId: '1' }
      })

      legacySignClient.approveRequest({
        id,
        result
      })
      ModalStore.close()
    }
  }

  // Handle reject action
  async function onReject() {
    if (requestEvent) {
      const { error } = rejectEIP155Request({
        id,
        topic: '',
        params: { request: { method, params }, chainId: '1' }
      })
      legacySignClient.rejectRequest({
        id,
        error
      })
      ModalStore.close()
    }
  }

  const { icons, name, url } = requestSession.peerMeta || {}
  const {from, to} = transaction

  return (
    <Fragment>
      <h1 className="text-5xl font-medium text-center">send transaction</h1>
      <div>{name}</div>
      <div>{url}</div>
      <div className="break-all">From: {from}</div>
      <div className="break-all">To: {to}</div>

      {/* <Modal.Footer>
        <Button auto flat color="error" onClick={onReject} disabled={loading}>
          Reject
        </Button>
        <Button auto flat color="success" onClick={onApprove} disabled={loading}>
          {loading ? <Loading size="sm" color="success" /> : 'Approve'}
        </Button>
      </Modal.Footer> */}
    </Fragment>
  )
}
