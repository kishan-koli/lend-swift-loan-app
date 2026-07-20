'use client';

import React from 'react';

export function LendSwiftLogo() {
  return (
    <div className="flex items-center gap-3 group">
      {/* Premium SVG Logo - Double Chevron + Spark */}
      <div className="relative w-10 h-10">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient
              id="chevron-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Glow Circle */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#chevron-gradient)"
            opacity="0.1"
            className="group-hover:opacity-20 transition-opacity duration-300"
          />

          {/* First Chevron (Left) */}
          <g className="group-hover:translate-x-0.5 transition-transform duration-300">
            <path
              d="M 10 12 L 18 20 L 10 28"
              stroke="url(#chevron-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* Second Chevron (Right) */}
          <g className="group-hover:translate-x-1 transition-transform duration-300">
            <path
              d="M 18 12 L 26 20 L 18 28"
              stroke="url(#chevron-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* Neon Blue Spark - Top Right */}
          <g filter="url(#glow)" className="group-hover:opacity-100 opacity-80 transition-opacity duration-300">
            <circle cx="28" cy="10" r="1.5" fill="#00D9FF" />
            <circle
              cx="28"
              cy="10"
              r="3"
              fill="none"
              stroke="#00D9FF"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </g>

          {/* Spark rays */}
          <g stroke="#00D9FF" strokeWidth="1" opacity="0.6" className="group-hover:opacity-100 transition-opacity duration-300">
            <line x1="28" y1="6" x2="28" y2="4" />
            <line x1="32" y1="10" x2="34" y2="10" />
            <line x1="31" y1="7" x2="32.5" y2="5.5" />
          </g>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="hidden sm:flex items-baseline gap-0">
        {/* "Lend" in Primary Blue/Slate */}
        <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent group-hover:from-slate-950 dark:group-hover:from-white transition-all duration-300">
          Lend
        </span>
        {/* "Swift" in Tech Emerald */}
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent ml-0.5 group-hover:from-emerald-700 dark:group-hover:from-emerald-300 transition-all duration-300">
          Swift
        </span>
      </div>
    </div>
  );
}
