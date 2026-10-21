export function Orbit() {
  return (
    <div className="orbit" aria-hidden="true">
      <svg viewBox="0 0 600 600" fill="none">
        <defs>
          <linearGradient id="orbit-fade" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#0E131F" stopOpacity=".9" />
            <stop offset="1" stopColor="#0E131F" stopOpacity=".2" />
          </linearGradient>
        </defs>
        <g stroke="url(#orbit-fade)" strokeWidth=".7">
          <circle cx="300" cy="300" r="225" />
          <ellipse cx="300" cy="300" rx="225" ry="80" />
          <ellipse cx="300" cy="300" rx="225" ry="155" />
          <ellipse cx="300" cy="300" rx="80" ry="225" />
          <ellipse cx="300" cy="300" rx="155" ry="225" />
          <path d="M75 300h450M300 75v450" />
        </g>
        <g transform="rotate(-30 300 300)" stroke="#0EFB2E" strokeWidth="2">
          <ellipse cx="300" cy="300" rx="265" ry="95" />
        </g>
        <path d="m460 109-34 44M102 477l39-39" stroke="#0E131F" />
        <circle
          cx="432"
          cy="160"
          r="5"
          fill="#0E131F"
          stroke="#0EFB2E"
          strokeWidth="2"
        />
        <circle cx="163" cy="441" r="4" fill="#0EFB2E" />
        <text
          x="463"
          y="100"
          fill="#0E131F"
          fontSize="11"
          fontFamily="monospace"
        >
          THE STATE
        </text>
        <text
          x="38"
          y="498"
          fill="#0E131F"
          fontSize="11"
          fontFamily="monospace"
        >
          THE FIRM
        </text>
        <path
          d="M30 300h20M550 300h20M300 30v20M300 550v20"
          stroke="#0E131F"
          strokeOpacity=".3"
        />
      </svg>
      <span className="orbit-note mono">A RELATIONSHIP UNDER EXAMINATION</span>
    </div>
  );
}
