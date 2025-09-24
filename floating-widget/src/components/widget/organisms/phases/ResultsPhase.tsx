import React, { useState } from 'react';
import { GlassContainer } from '../../atoms/GlassContainer';

interface ResultsPhaseProps {
  results: {
    answer: string;
    sources?: Array<{
      title: string;
      url: string;
      relevance?: number;
    }>;
  };
  onNewSearch: () => void;
}

export function ResultsPhase({ results, onNewSearch }: ResultsPhaseProps) {
  const [followUpQuestion, setFollowUpQuestion] = useState('');

  const handleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (followUpQuestion.trim()) {
      // In a real implementation, this would trigger a new search
      console.log('Follow-up question:', followUpQuestion);
      setFollowUpQuestion('');
    }
  };

  return (
    <GlassContainer variant="expanded">
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-semibold">Answer</h3>
          <button
            onClick={onNewSearch}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="New search"
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
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>

        {/* Answer Content */}
        <div className="flex-1 overflow-y-auto mb-4">
          <p className="text-white/90 leading-relaxed mb-4">
            {results.answer}
          </p>

          {/* Sources */}
          {results.sources && results.sources.length > 0 && (
            <div className="mt-6">
              <p className="text-white/60 text-sm mb-2">Sources:</p>
              <div className="space-y-2">
                {results.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <p className="text-white/80 text-sm">{source.title}</p>
                    {source.relevance && (
                      <p className="text-white/40 text-xs mt-1">
                        Relevance: {Math.round(source.relevance * 100)}%
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Follow-up Input */}
        <form onSubmit={handleFollowUp} className="pt-4 border-t border-white/10">
          <div className="relative">
            <input
              type="text"
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/70"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </GlassContainer>
  );
}