import * as React from "react";
import { usePiletApi } from "./framework/apex/shell/PiletApi";
import { ErrorBoundary } from "./ErrorBoundary";

export function SampleExtension() {
  const piral = usePiletApi();
  return (
    <div>
      Direct
      <br />
      {/* This will not work because it is using `some-react-app` instance of react to render extension. */}
      <ErrorBoundary>
        {/* This throw error `Invalid hook call due to more than one copy of React in the same app` */}
        <piral.Extension name="sample-ext-name" params={{}} />
      </ErrorBoundary>
    </div>
  );
}
