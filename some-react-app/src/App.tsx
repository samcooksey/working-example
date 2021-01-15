import * as React from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { usePiletApi, useShellReact, useShellReactDom } from "./framework/apex/shell/PiletApi";
import { SampleExtension } from "./SampleExtension";

export function App() {
  const piral = usePiletApi();
  const shellReact = useShellReact();
  const shellReactDom = useShellReactDom();
  const htmlExtContainer = React.useRef<HTMLDivElement>();
  const createPortalContainer = React.useRef<HTMLDivElement>();

  const portalDiv = document.createElement("div");

  const htmlExtensionDivtoBody = document.createElement("div");

  React.useLayoutEffect(() => {
    // This is not rendering extension to given container
    piral.renderHtmlExtension(htmlExtContainer.current, {
      name: "sample-ext-name",
      params: {},
    });
  });

  React.useLayoutEffect(() => {
    if (createPortalContainer.current) {
      // Appending element that supposed to rendered via createPortal at line  51
      createPortalContainer.current.appendChild(portalDiv);
    }
  }, [portalDiv, createPortalContainer]);

  return (
    <div>
      Render sample Extension
      <br />
      {/* While debugging I noticed that if i dont add `data-portal-id` attribute to bellow conatiner 
      piral.renderHtmlExtension will not execute rendering logic */}
      <div data-portal-id="HTMLExtContainer" ref={htmlExtContainer}>
        Using renderHtmlExtension()
        <br />
      </div>
      <br />
      <div>
        Using createPortal
        <br />
        <ErrorBoundary>
          <div ref={createPortalContainer}></div>
          {/* Eventhough we are using ReactDom and React instance from piral shell to render it
        This also throw Invalid hook call error same as above. 
        */}
          {shellReactDom.createPortal(
            shellReact.createElement(piral.Extension, { name: "sample-ext-name", params: {} }),
            portalDiv,
          )}
        </ErrorBoundary>
      </div>
      <br />
      <div>
        Direct
        <br />
        {/* This will not work because it is using `some-react-app` instance of react to render extension. */}
        <ErrorBoundary>
          {/* This throw error `Invalid hook call due to more than one copy of React in the same app` */}
          <piral.Extension name="sample-ext-name" params={{}} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
