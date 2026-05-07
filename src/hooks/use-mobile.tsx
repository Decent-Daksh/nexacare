import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
<<<<<<< HEAD
    const mql = window.matchMedia(`(max-width: ${String(MOBILE_BREAKPOINT - 1)}px)`);
=======
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
>>>>>>> main
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
<<<<<<< HEAD
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return Boolean(isMobile);
=======
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
>>>>>>> main
}
