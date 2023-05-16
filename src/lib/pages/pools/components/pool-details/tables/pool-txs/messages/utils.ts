import type { Coin } from "@cosmjs/stargate";

import type { Message } from "lib/types";
import { extractTxDetails } from "lib/utils";

export const extractPoolMsgs = (msgs: Message[], poolId: number) => {
  const result: { msgs: Message[]; others: { [key: string]: number } } = {
    msgs: [],
    others: {},
  };

  // eslint-disable-next-line complexity
  msgs.forEach((msg) => {
    const { type, detail, log } = msg;
    switch (type) {
      case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
      case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn":
      case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
      case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
        const details = extractTxDetails(type, detail, log);
        if (
          (details.routes as { poolId: number }[]).some(
            (pool) => Number(pool.poolId) === poolId
          )
        ) {
          result.msgs = result.msgs.concat(msg);
        }
        break;
      }
      case "/osmosis.gamm.v1beta1.MsgJoinPool":
      case "/osmosis.gamm.v1beta1.MsgExitPool":
      case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn":
      case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut":
      case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn":
      case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
        const details = extractTxDetails(type, detail, log);
        if (Number(details.pool_id) === poolId) {
          result.msgs = result.msgs.concat(msg);
        }
        break;
      }
      case "/osmosis.lockup.MsgLockTokens":
      case "/osmosis.lockup.MsgBeginUnlockingAll":
      case "/osmosis.lockup.MsgBeginUnlocking":
      case "/osmosis.lockup.MsgForceUnlock":
      case "/osmosis.lockup.MsgExtendLockup":
      case "/osmosis.superfluid.MsgSuperfluidDelegate":
      case "/osmosis.superfluid.MsgSuperfluidUndelegate":
      case "/osmosis.superfluid.MsgSuperfluidUnbondLock":
      case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate":
      case "/osmosis.superfluid.MsgUnPoolWhitelistedPool":
      case "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLock":
      case "/cosmos.authz.v1beta1.MsgExec":
      case "/ibc.core.channel.v1.MsgRecvPacket":
      case "/cosmwasm.wasm.v1.MsgInstantiateContract1":
      case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      case "/cosmwasm.wasm.v1.MsgExecuteContract": {
        result.others[type] =
          (result.others[type] ? result.others[type] : 0) + 1;
        break;
      }
      default:
        break;
    }
  });
  return result;
};

export const getPoolDenom = (poolId: string) => `gamm/pool/${poolId}`;

export const coinFromStr = (str: string): Coin => {
  const amount = str.match(/[0-9]+/g)?.[0] ?? "";
  const denom = str.slice(amount.length);
  return { amount, denom };
};
