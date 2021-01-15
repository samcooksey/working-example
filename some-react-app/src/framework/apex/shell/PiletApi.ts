import { PiletApi } from "piral-shell";
import { createContext, useContext, useMemo } from "react";
import { createContextBridge } from "src/framework/react/ContextBridge";
import * as React from "react";
import * as ReactDom from "react-dom";

export type ShellApi = Readonly<
  Partial<{
    piral: PiletApi;
    shellReact: typeof React;
    shellReactDom: typeof ReactDom;
  }>
>;

export const _piletApiContext = createContext<ShellApi>(undefined);

const piletApiContextBridge = createContextBridge(_piletApiContext);

export { piletApiContextBridge as PiletApiContextBridge };

export function useIsPilet() {
  const piral = usePiletApi();

  return useMemo(() => !!piral, [piral]);
}

export function usePiletApi() {
  return useContext(_piletApiContext).piral;
}

export function useShellReact() {
  return useContext(_piletApiContext).shellReact;
}

export function useShellReactDom() {
  return useContext(_piletApiContext).shellReactDom;
}
