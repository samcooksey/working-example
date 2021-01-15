import * as React from "react";
import * as ReactDOM from "react-dom";
import { PiletApi } from "piral-shell";
import * as someReactApp from "some-react-app";

export function App({ piral }: { piral: PiletApi }) {
  const appRef = React.useRef<HTMLDivElement>();
  React.useLayoutEffect(() => {
    return someReactApp.init(appRef.current, {
      history,
      piral,
      shellReact: React,
      shellReactDom: ReactDOM,
    });
  });
  return <div ref={appRef}>some react app loads here</div>;
}
