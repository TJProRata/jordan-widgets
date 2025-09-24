import { useState, useRef } from 'react';
import { CompactButton } from '../molecules/CompactButton';
import { ExpandedAnswerTab } from '../organisms/phases/ExpandedAnswerTab';
import { TypingPhase } from '../organisms/phases/TypingPhase';
import { SearchingPhase } from '../organisms/phases/SearchingPhase';
import { ResultsPhase } from '../organisms/phases/ResultsPhase';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { CONTENT_STATES, type ContentState } from '../../../lib/constants';

interface MainFlowProps {
  onSearch?: (query: string) => Promise<any>;
}

export function MainFlow({ onSearch: _onSearch }: MainFlowProps) {
  // Core state management
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentState, setContentState] = useState<ContentState>(CONTENT_STATES.IDLE);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [_isLoading, _setIsLoading] = useState(false);

  // Refs for DOM manipulation
  const widgetRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Click outside to collapse
  useClickOutside(widgetRef, () => {
    if (contentState === CONTENT_STATES.TYPING) {
      setContentState(CONTENT_STATES.IDLE);
    }
  });

  // Event handlers
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 300);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setContentState(CONTENT_STATES.IDLE);
    setSearchValue('');
  };

  const handleSearchSubmit = async (query: string) => {
    // Redirect to search results page instead of showing inline results
    if (query.trim()) {
      window.location.href = `search-results.html?q=${encodeURIComponent(query.trim())}`;
    }
  };


  // Render logic based on state
  return (
    <div ref={widgetRef} className="widget-container">
      {!isExpanded ? (
        <CompactButton onClick={handleToggleExpand} />
      ) : (
        <>
          {contentState === CONTENT_STATES.IDLE && (
            <ExpandedAnswerTab
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSearchSubmit={handleSearchSubmit}
              onSearchFocus={() => setContentState(CONTENT_STATES.TYPING)}
              onClose={handleClose}
            />
          )}
          {contentState === CONTENT_STATES.TYPING && (
            <TypingPhase
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSearchSubmit={handleSearchSubmit}
            />
          )}
          {contentState === CONTENT_STATES.SEARCHING && (
            <SearchingPhase searchQuery={searchValue} />
          )}
          {contentState === CONTENT_STATES.RESULTS && searchResults && (
            <ResultsPhase
              results={searchResults}
              onNewSearch={() => {
                setContentState(CONTENT_STATES.IDLE);
                setSearchValue('');
                setSearchResults(null);
              }}
            />
          )}
          {contentState === CONTENT_STATES.ERROR && (
            <div className="p-6 text-center">
              <p className="text-red-400">Something went wrong. Please try again.</p>
              <button
                onClick={() => setContentState(CONTENT_STATES.IDLE)}
                className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}