import { NYTimesLogo } from '../atoms/logos/NYTimesLogo';

interface CompactButtonProps {
  onClick?: () => void;
  className?: string;
}

export function CompactButton({ onClick, className = '' }: CompactButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative group ${className}`}
      aria-label="Ask The New York Times Anything"
    >
      {/* Gradient border with mask-composite */}
      <div className="compact-gradient-border w-[180px] h-[52px] rounded-full backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-105 flex items-center justify-center px-5 gap-2">
        {/* Ask text */}
        <span className="text-white text-[15px] font-medium tracking-wide drop-shadow-sm">
          Ask
        </span>

        {/* NYT Logo - scaled down */}
        <div className="scale-[0.6] origin-center drop-shadow-sm">
          <NYTimesLogo />
        </div>
      </div>
    </button>
  );
}