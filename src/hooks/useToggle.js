import { useState, useCallback } from "react";

export const useToggle = (initState = false) => {
  const [toggle, setToggle] = useState(initState);
  return [toggle, useCallback(() => setToggle((s) => !s))];
};
