type IconName = "home" | "sparkle" | "heart" | "arrow" | "plus" | "menu" | "close" | "burst";

export function Icon({ name }: { name: IconName }) {
  if (name === "arrow") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "plus") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "menu") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "close") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.2 12 4.5l8 6.7V20a1 1 0 0 1-1 1h-5.2v-5.2H10.2V21H5a1 1 0 0 1-1-1v-8.8Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "heart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19s-6.2-3.8-8.2-7.2C2.2 9.4 3.2 6.6 6 5.8c1.7-.5 3.2.2 4 1.5.8-1.3 2.3-2 4-1.5 2.8.8 3.8 3.6 2.2 6-2 3.4-8.2 7.2-8.2 7.2Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "burst") {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M60 14v92" strokeWidth="1.2" />
          <path d="M14 60h92" strokeWidth="1.2" />
          <path d="M26 26l68 68" strokeWidth="1.1" />
          <path d="M94 26 26 94" strokeWidth="1.1" />
          <path d="M60 28v10M60 82v10M28 60h10M82 60h10" strokeWidth="1.2" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.2 13.4 9l5.6 1.2L13.4 11.4 12 17.2 10.6 11.4 5 10.2 10.6 9 12 3.2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M18.2 14.8 18.8 17l2.2.6-2.2.6-.6 2.2-.6-2.2-2.2-.6 2.2-.6.6-2.2Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
