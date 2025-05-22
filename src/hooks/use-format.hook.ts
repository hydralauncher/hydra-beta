import { useMemo } from "react";

export function useFormat() {
  const numberFormatter = useMemo(() => {
    return new Intl.NumberFormat("en", {
      maximumFractionDigits: 0,
    });
  }, []);

  const compactNumberFormatter = useMemo(() => {
    return new Intl.NumberFormat("en", {
      maximumFractionDigits: 0,
      notation: "compact",
    });
  }, []);

  return {
    formatNumber: numberFormatter.format,
    formatCompactNumber: compactNumberFormatter.format,
  };
}
