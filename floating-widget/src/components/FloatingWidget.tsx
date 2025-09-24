import React, { useState, useEffect } from 'react';
import { MainFlow } from './widget/templates/MainFlow';
import { WIDGET_POSITIONS, type WidgetPosition } from '../lib/constants';

interface FloatingWidgetProps {
  position?: WidgetPosition;
  apiKey?: string;
  theme?: 'light' | 'dark' | 'auto';
  customStyles?: React.CSSProperties;
  onSearch?: (query: string) => Promise<any>;
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  position = WIDGET_POSITIONS.BOTTOM_CENTER, // Default to bottom-center
  apiKey: _apiKey,
  theme: _theme = 'auto',
  customStyles,
  onSearch
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const positionClasses: Record<string, string> = {
    'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
  };

  if (!mounted) return null;

  return (
    <div
      className={`${positionClasses[position]} z-[9999] transition-all duration-300`}
      style={customStyles}
    >
      <MainFlow onSearch={onSearch} />
    </div>
  );
};