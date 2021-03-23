import * as React from "react";
import { PiletApi } from "piral-shell";

export function App({ piral }: { piral: PiletApi }) {
  return (
    <div>
      <piral.Extension name="some-react-app" />
    </div>
  );
}
