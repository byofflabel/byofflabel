export function Cross({ className = "", decorative = true }) {
  return (
    <svg
      aria-hidden={decorative ? "true" : undefined}
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 2H23V17H38V23H23V38H17V23H2V17H17V2Z" fill="currentColor" />
      <path d="M17 2H23V17H38V23H23V38H17V23H2V17H17V2Z" stroke="white" strokeOpacity=".35" />
    </svg>
  );
}
