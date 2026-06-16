function NewIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="25 25 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="25" y="25" width="70" height="70" rx="16" fill="#3A5F8F" />

      <g stroke="white" strokeWidth="3" strokeLinejoin="round">
        <path d="M60 45 L75 52 L60 60 L45 52 Z" />
        <path d="M45 52 L45 68 L60 76 L60 60 Z" />
        <path d="M75 52 L75 68 L60 76 L60 60 Z" />
      </g>
    </svg>
  );
}
const Logo = () => {
  return (
    <span>
      <NewIcon />
    </span>
  );
};

export default Logo;
