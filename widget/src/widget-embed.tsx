import { createRoot } from 'react-dom/client';
import { CompactButton } from './components/molecules/CompactButton';
import './widget-styles.css';

// Widget component that handles search interaction
function Widget() {
  const handleSearch = () => {
    console.log('Search clicked - ready for future functionality');
    // Future: Open search interface or perform search
  };

  return <CompactButton onClick={handleSearch} />;
}

// Auto-initialize widget when script loads
function initWidget() {
  // Create container for the widget
  const container = document.createElement('div');
  container.id = 'compact-widget-container';

  // Position widget in top-left corner
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.left = '20px';
  container.style.zIndex = '9999';
  container.style.pointerEvents = 'auto';

  // Append to body
  document.body.appendChild(container);

  // Render React component
  const root = createRoot(container);
  root.render(<Widget />);

  console.log('✅ Compact Widget initialized successfully');

  return {
    container,
    root,
    destroy: () => {
      root.unmount();
      document.body.removeChild(container);
    }
  };
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}

// Export for manual initialization if needed
(window as any).CompactWidget = {
  init: initWidget
};