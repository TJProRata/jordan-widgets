import { GlassContainer } from '../atoms/GlassContainer';

interface CompactButtonProps {
  onClick: () => void;
}

export function CompactButton({ onClick }: CompactButtonProps) {
  return (
    <GlassContainer variant="compact">
      <button
        onClick={onClick}
        className="w-full h-full flex items-center justify-center px-4 gap-2 hover:scale-105 transition-transform duration-200"
        aria-label="Expand widget"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-white text-sm font-medium">Ask AI</span>
      </button>
    </GlassContainer>
  );
}