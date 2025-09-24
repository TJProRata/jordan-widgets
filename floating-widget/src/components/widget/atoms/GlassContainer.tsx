import { cn } from '../../../lib/utils';

interface GlassContainerProps {
  children: React.ReactNode;
  variant?: 'compact' | 'expanded' | 'typing';
  className?: string;
}

export function GlassContainer({
  children,
  variant = 'compact',
  className = ''
}: GlassContainerProps) {
  const variants = {
    compact: 'w-[140px] h-[48px] rounded-full',
    expanded: 'w-[400px] h-[500px] rounded-3xl',
    typing: 'w-[400px] h-[120px] rounded-2xl'
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'bg-white/10 backdrop-blur-xl border border-white/20',
        'shadow-2xl shadow-black/10',
        variants[variant],
        className
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}