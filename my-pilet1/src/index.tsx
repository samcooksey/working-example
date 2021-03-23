import * as React from "react";
import { PiletApi } from "piral-shell";
import { App } from "./App";
import { SampleExtension } from "./SampleExtension";
import * as someReactApp from "some-react-app";

export function setup(app: PiletApi) {
  app.registerExtension("some-react-app", {
    type: "html",
    component: {
      mount(element) {
        (element as any).destroy = someReactApp.init(element, {
          piral: app,
        });
      },
      unmount(element) {
        (element as any).destroy?.();
      },
    },
  });

  app.registerExtension("sample-ext-name", ({ params: { props } }) => {
    return <SampleExtension {...props} />;
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
        <div
          style={{
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
