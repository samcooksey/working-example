/** @jsx createElement */


import { PiletApi } from "piral-shell";
import { History } from "history";
import * as _React from "react";
import * as _ReactDOM from "react-dom";
import { App } from "./App";
import * as _PiletApi from "./framework/apex/shell/PiletApi";
import { ShellApi } from "./framework/apex/shell/PiletApi";

type Options = Readonly<
  Partial<{
    history: History<unknown>;
    piral: PiletApi;
    shellReact: typeof _React;
    shellReactDom: typeof _ReactDOM;
    addCommentsButton: () => _React.ReactPortal;
  }>
>;

/** Kicks off the app itself. */
export function init(container: Element, { history, piral, shellReact, shellReactDom, addCommentsButton }: Options = {}) {
  
  const { createElement, StrictMode }: typeof _React = require("react");
  const { render, unmountComponentAtNode }: typeof _ReactDOM = require("react-dom");
  const { PiletApiContextBridge }: typeof _PiletApi = require("./framework/apex/shell/PiletApi");

  const context: ShellApi = {
    piral,
    shellReact,
    shellReactDom,
  };



  render(
    <StrictMode>
      <PiletApiContextBridge.Provider container={container.ownerDocument.body} value={context}>
          <App/>
      </PiletApiContextBridge.Provider>
    </StrictMode>,
    container,
  );

  return (): void => {
    unmountComponentAtNode(container);
  };
}
