import * as $ from "jquery";
import uniqueId = require("lodash/uniqueId");
import * as React from "react";
import { useConstant } from "./UseConstant";

export function createContextBridge<T>({ Provider }: React.Context<T>) {
  type ProviderProps = Readonly<
    ConsumerProps & {
      value: T;
    }
  >;

  type ConsumerProps = Readonly<
    React.PropsWithChildren<{
      container: Element;
    }>
  >;

  const bridgeContextsEvent = uniqueId("itp:bridgeContexts");

  return {
    Consumer({ children, container }: ConsumerProps) {
      const value = useConstant<T>(() => {
        let ret: T;

        $(container).trigger(bridgeContextsEvent, [
          (newValue: T): void => {
            ret = newValue;
          },
        ]);

        return ret;
      });

      return <Provider value={value}>{children}</Provider>;
    },

    Provider({ children, container, value }: ProviderProps) {
      React.useLayoutEffect(() => {
        $(container).on(bridgeContextsEvent, (evt, callback: (value: T) => void) => {
          callback(value);
          evt.stopImmediatePropagation();
        });

        return (): void => {
          $(container).off(bridgeContextsEvent);
        };
      }, [container, value]);

      return <Provider value={value}>{children}</Provider>;
    },
  } as const;
}
