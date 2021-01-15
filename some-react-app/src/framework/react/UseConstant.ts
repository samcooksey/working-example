import { useState } from "react";

export function useConstant<T>(factory: () => T) {
  const [ret] = useState(factory);

  return ret;
}
