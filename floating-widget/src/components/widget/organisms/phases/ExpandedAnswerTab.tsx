import { GlassContainer } from '../../atoms/GlassContainer';
import { SearchBar } from '../../molecules/SearchBar';

interface ExpandedAnswerTabProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  onSearchFocus: () => void;
  onClose?: () => void;
}

export function ExpandedAnswerTab({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onSearchFocus,
  onClose
}: ExpandedAnswerTabProps) {
  const suggestions = [
    'What is React?',
    'How to use TypeScript?',
    'Explain useState hook',
    'What is Tailwind CSS?'
  ];

  return (
    <GlassContainer variant="expanded">
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-semibold">How can I help?</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close widget"
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
                className="text-white/70"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          onFocus={onSearchFocus}
          autoFocus={true}
        />

        {/* Suggestions */}
        <div className="flex-1 mt-6 overflow-y-auto">
          <p className="text-white/60 text-sm mb-3">Popular searches:</p>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSearchSubmit(suggestion)}
                className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            Powered by AI Assistant
          </p>
        </div>
      </div>
    </GlassContainer>
  );
}