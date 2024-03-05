import { amp } from "../Amplitude";
import type { ActionAmpEvent, AmpEvent, SpecialAmpEvent } from "../types";

export const track = (
  event: Exclude<AmpEvent, ActionAmpEvent | SpecialAmpEvent>,
  properties?: Record<string, unknown>
) => amp.track(event, properties);

export * from "./trackAction";
export * from "./trackComponent";
export * from "./trackContractStates";
export * from "./trackExternal";
export * from "./trackInteraction";
export * from "./trackToPage";
export * from "./trackTx";
