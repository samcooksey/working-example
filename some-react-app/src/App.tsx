import * as React from "react";
import { usePiletApi} from "./framework/apex/shell/PiletApi";

export function App() {
  const piral = usePiletApi();
  const ref = React.useRef();
  const [count, setCount] = React.useState(0);

  React.useLayoutEffect(() => {
    piral.renderHtmlExtension(ref.current, {
      name: "sample-ext-name",
      params: {
        props: {
          count
        }
      },
    });
  }, [count]);


  return (
 <div>
   <button onClick={() => {
     setCount((prev) => prev + 1);
   }}>
     Increment Count
   </button>
   <div ref={ref} />
 </div>
  );
}
