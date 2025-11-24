import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { fontMap } from "../constants/fonts";

export function useAppBootstrap() {
  const [fontsLoaded, fontError] = useFonts(fontMap);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const ready = fontsLoaded || timeoutReached;

  return {
    ready,
    fontError,
  };
}
