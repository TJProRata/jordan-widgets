import { GlassContainer } from '../../atoms/GlassContainer';
import { SearchBar } from '../../molecules/SearchBar';

interface TypingPhaseProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
}

export function TypingPhase({
  searchValue,
  onSearchChange,
  onSearchSubmit
}: TypingPhaseProps) {
  const suggestions = searchValue.length > 2 ? [
    `${searchValue} in React`,
    `${searchValue} tutorial`,
    `${searchValue} best practices`,
    `How to use ${searchValue}`
  ] : [];

  return (
    <GlassContainer variant="typing">
      <div className="p-4">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          placeholder="Type your question..."
          autoFocus={true}
        />

        {suggestions.length > 0 && (
          <div className="mt-2 space-y-1">
            {suggestions.slice(0, 2).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSearchSubmit(suggestion)}
                className="w-full text-left px-3 py-1 text-white/60 hover:text-white text-sm transition-colors truncate"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </GlassContainer>
  );
}