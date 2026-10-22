/** Decorative conceptual geometry. No plotted values or asserted relationships. */
export function Orbit() {
  return (
    <figure className="orbit" data-pointer-reactive aria-hidden="true">
      <svg viewBox="0 0 560 560" width="560" height="560" fill="none">
        <defs>
          <clipPath id="sphere-clip">
            <circle cx="280" cy="280" r="184" />
          </clipPath>
        </defs>
        <g className="orbit-guides">
          <path d="M32 96h496M32 280h496M32 464h496M96 32v496M280 32v496M464 32v496" />
          <path d="M24 96h16M32 88v16M520 96h16M528 88v16M24 464h16M32 456v16M520 464h16M528 456v16" />
          <circle cx="280" cy="280" r="232" strokeDasharray="2 8" />
        </g>
        <g className="orbit-sphere" transform="rotate(-20 280 280)">
          <circle cx="280" cy="280" r="184" />
          <ellipse cx="280" cy="280" rx="144" ry="184" />
          <ellipse cx="280" cy="280" rx="80" ry="184" />
          <path d="M280 96v368" />
          <g clipPath="url(#sphere-clip)">
            <ellipse cx="280" cy="280" rx="184" ry="64" />
            <ellipse cx="280" cy="280" rx="184" ry="128" />
            <path d="M96 280h368M96 180h368M96 380h368" />
          </g>
        </g>
        <ellipse
          className="orbit-path"
          cx="280"
          cy="280"
          rx="252"
          ry="96"
          transform="rotate(-34 280 280)"
        />
        <ellipse
          className="orbit-trace"
          cx="280"
          cy="280"
          rx="252"
          ry="96"
          transform="rotate(-34 280 280)"
          pathLength="1000"
        />
        <g className="orbit-nodes">
          <circle cx="468" cy="143" r="6" />
          <circle cx="92" cy="417" r="6" />
          <path d="m468 143 40-40M92 417l-40 40" />
        </g>
        <g className="orbit-labels">
          <text x="400" y="80">
            THE STATE
          </text>
          <text x="32" y="488">
            THE FIRM
          </text>
          <text x="280" y="540" textAnchor="middle">
            FIG. 01 / A RELATIONSHIP UNDER EXAMINATION
          </text>
        </g>
        <rect x="270" y="270" width="20" height="20" className="orbit-center" />
        <path d="M276 280h8M280 276v8" className="orbit-center-cross" />
      </svg>
    </figure>
  );
}
