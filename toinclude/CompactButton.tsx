//src/components/widget/molecules/CompactButton.tsx
import React from "react";
import { NYTimesLogo } from "../atoms/logos/NYTimesLogo";

interface CompactButtonProps {
  onClick?: () => void;
  className?: string;
}

export function CompactButton({ onClick, className = "" }: CompactButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative group ${className}`}
      aria-label="Ask The New York Times Anything"
    >
      {/* Gradient border container */}
      <div className="relative w-[180px] h-[52px] rounded-full p-[2px] bg-gradient-to-r from-[#C081FF] to-[#B8FFE3] shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-105">
        {/* Inner dark background */}
        <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center px-5 gap-2">
          {/* Ask text */}
          <span className="text-white text-[15px] font-medium tracking-wide">
            Ask
          </span>

          {/* NYT Logo - scaled down */}
          <div className="scale-[0.6] origin-center">
            <NYTimesLogo />
          </div>
        </div>
      </div>
    </button>
  );
}
