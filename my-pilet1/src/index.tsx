import * as React from "react";
import { PiletApi } from "piral-shell";
import { App } from "./App";

export function setup(app: PiletApi) {
  app.registerExtension("sample-ext-name", (params) => {
    return <div>Sample Extension!</div>;
  });

  app.showNotification("Hello from Piral!", {
    autoClose: 2000,
  });
  app.registerMenu(() => (
    <a href="https://docs.piral.io" target="_blank">
      Documentation
    </a>
  ));
  app.registerTile(
    () => (
      <div>
       
        {/* <app.Extension name="sample-ext-name" params={{ value: 5 }} /> */}
        <div
          style={{
            height: "200px",
            backgroundColor: "lightblue",
          }}
        >
          <h6>Some React App</h6>
          <App piral={app} />
        </div>
      </div>
    ),
    {
      initialColumns: 2,
      initialRows: 2,
    }
  );
}
