import * as React from "react";

export function SampleExtension({ count }) {
  return (
    <div
      style={{
        backgroundColor: "yellow",
      }}
    >
      <h3>Count: {count}</h3>
    </div>
  );
}
