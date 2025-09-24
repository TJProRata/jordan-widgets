export const WIDGET_POSITIONS = {
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
} as const;

export type WidgetPosition = typeof WIDGET_POSITIONS[keyof typeof WIDGET_POSITIONS];

export const CONTENT_STATES = {
  IDLE: 'idle',
  TYPING: 'typing',
  SEARCHING: 'searching',
  RESULTS: 'results',
  ERROR: 'error',
} as const;

export type ContentState = typeof CONTENT_STATES[keyof typeof CONTENT_STATES];