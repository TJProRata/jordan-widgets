import { GlassContainer } from '../../atoms/GlassContainer';

interface SearchingPhaseProps {
  searchQuery: string;
}

export function SearchingPhase({ searchQuery }: SearchingPhaseProps) {
  return (
    <GlassContainer variant="expanded">
      <div className="flex flex-col items-center justify-center h-full p-6">
        {/* Loading Animation */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
        </div>

        <p className="text-white text-lg font-medium mb-2">Searching...</p>
        <p className="text-white/60 text-sm text-center max-w-xs">
          "{searchQuery}"
        </p>

        {/* Progress indicators */}
        <div className="mt-8 space-y-2 w-full max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <p className="text-white/60 text-sm">Analyzing your question</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <p className="text-white/40 text-sm">Searching knowledge base</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <p className="text-white/20 text-sm">Generating response</p>
          </div>
        </div>
      </div>
    </GlassContainer>
  );
}