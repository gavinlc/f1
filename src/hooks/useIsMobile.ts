import * as React from 'react';

/** Breakpoint in pixels below which the device is considered mobile */
const MOBILE_BREAKPOINT = 768;

/**
 * A React hook that determines if the current viewport width is below the mobile breakpoint
 * @returns A boolean indicating whether the current viewport is mobile-sized
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileView /> : <DesktopView />;
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
