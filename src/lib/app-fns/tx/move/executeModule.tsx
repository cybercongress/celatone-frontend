import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { findAttribute } from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { catchTxError } from "../common";
import { postTx } from "../common/post";
import { sendingTx } from "../common/sending";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";
import type { BechAddr20, TxResultRendering } from "lib/types";
import { feeFromStr } from "lib/utils";

interface ExecuteModuleTxParams {
  address: BechAddr20;
  messages: EncodeObject[];
  fee: StdFee;
  client: SigningCosmWasmClient;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const executeModuleTx = ({
  address,
  messages,
  fee,
  client,
  onTxSucceed,
  onTxFailed,
}: ExecuteModuleTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => client.signAndBroadcast(address, messages, fee),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.();
      const txFee = findAttribute(txInfo.events, "tx", "fee")?.value;
      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Tx Hash",
            value: txInfo.transactionHash,
            html: (
              <ExplorerLink
                type="tx_hash"
                value={txInfo.transactionHash}
                openNewTab
              />
            ),
          },
          {
            title: "Tx Fee",
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
          },
        ],
        receiptInfo: {
          header: "Transaction Complete!",
          headerIcon: (
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize={5}
            />
          ),
        },
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
