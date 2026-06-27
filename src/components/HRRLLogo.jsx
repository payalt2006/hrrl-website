import React from 'react';

export default function HRRLLogo({ size = 40, monochrome = false }) {
  const brandBlue = monochrome ? 'currentColor' : '#0F2A4A';
  const archRed = monochrome ? 'currentColor' : '#9B1C1C';
  const duneGold = monochrome ? 'currentColor' : '#D97706';
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={monochrome ? 'opacity-90' : ''}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill={monochrome ? 'transparent' : 'white'} />
      
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke={brandBlue} strokeWidth="3" />
      <circle cx="50" cy="50" r="34" fill="none" stroke={brandBlue} strokeWidth="1" opacity="0.3" />

      {/* Arch / Gateway */}
      <path 
        d="M38 65 V35 C38 25, 62 25, 62 35 V65" 
        fill="none" 
        stroke={archRed} 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      <path d="M38 35 V65 H44 V35 Z" fill={archRed} />
      <path d="M56 35 V65 H62 V35 Z" fill={archRed} />

      {/* Dunes / Landscape */}
      <path 
        d="M25 65 Q35 55 50 65 Q65 55 75 65 Z" 
        fill={duneGold} 
      />
      <path 
        d="M35 65 Q50 60 65 65 Z" 
        fill={duneGold} 
        opacity="0.8"
      />

      {/* Text HRRL inside */}
      <text 
        x="50" 
        y="80" 
        fontFamily="Inter, sans-serif" 
        fontWeight="800" 
        fontSize="14" 
        fill={brandBlue} 
        textAnchor="middle" 
        letterSpacing="0.05em"
      >
        HRRL
      </text>

      {/* Circular Text Paths */}
      <defs>
        <path id="topArc" d="M 15 50 A 35 35 0 0 1 85 50" fill="none" />
        <path id="bottomArc" d="M 12 50 A 38 38 0 0 0 88 50" fill="none" />
      </defs>

      <text fontSize="7" fill={brandBlue} fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="0.02em">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          एचपीसीएल राजस्थान रिफाइनरी लिमिटेड
        </textPath>
      </text>

      <text fontSize="6.5" fill={brandBlue} fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="0.02em">
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          HPCL Rajasthan Refinery Limited
        </textPath>
      </text>
    </svg>
  );
}
