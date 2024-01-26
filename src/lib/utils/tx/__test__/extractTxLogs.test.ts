import { extractTxLogs } from "../extractTxLogs";

import {
  fromLogs,
  fromLogsTxFailed,
  fromEvents,
  fromEventsTxFailed,
} from "./extractTxLogs.example";

describe("extractTxLogs", () => {
  test("from logs", () => {
    expect(extractTxLogs(fromLogs.txData)).toEqual(fromLogs.result);
  });
  test("from logs Tx Failed", () => {
    expect(extractTxLogs(fromLogsTxFailed.txData)).toEqual(
      fromLogsTxFailed.result
    );
  });
  test("from events", () => {
    expect(extractTxLogs(fromEvents.txData)).toEqual(fromEvents.result);
  });
  test("from events Tx Failed", () => {
    expect(extractTxLogs(fromEventsTxFailed.txData)).toEqual(
      fromEventsTxFailed.result
    );
  });
});
