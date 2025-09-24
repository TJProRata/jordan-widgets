import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingWidget } from './components/FloatingWidget';
import './index.css';

// Debug log to confirm script is executing
console.log('[FloatingWidget] embed.tsx loading...');

// Immediately set up the global object
try {
  console.log('[FloatingWidget] Setting up window.FloatingWidget...');

  // Global initialization function
  (window as any).FloatingWidget = {
    init: (config: any = {}) => {
      console.log('[FloatingWidget] init() called with config:', config);
    const {
      containerId = 'floating-widget-root',
      position = 'bottom-center', // Default to bottom-center
      apiKey = '',
      apiEndpoint = '',
      theme = 'auto',
      onSearch,
      ...customProps
    } = config;

    // Create container if it doesn't exist
    let container = document.getElementById(containerId);
    if (!container) {
      console.log('[FloatingWidget] Creating container:', containerId);
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    } else {
      console.log('[FloatingWidget] Found existing container:', containerId);
    }

    // Create React root and render
    console.log('[FloatingWidget] Creating React root...');
    try {
      const root = ReactDOM.createRoot(container);
      console.log('[FloatingWidget] Rendering FloatingWidget component...');

      root.render(
        <React.StrictMode>
          <FloatingWidget
            position={position}
            apiKey={apiKey}
            theme={theme}
            onSearch={onSearch || createDefaultSearchHandler(apiEndpoint)}
            {...customProps}
          />
        </React.StrictMode>
      );

      console.log('[FloatingWidget] ✅ Widget rendered successfully!');

      // Return control object
      return {
        destroy: () => {
          console.log('[FloatingWidget] Destroying widget...');
          root.unmount();
        },
        update: (newConfig: any) => {
          console.log('[FloatingWidget] Updating widget config:', newConfig);
          root.render(
            <React.StrictMode>
              <FloatingWidget {...newConfig} />
            </React.StrictMode>
          );
        },
        toggle: () => {
          // This would require more complex state management
          console.log('Toggle functionality requires state management setup');
        }
      };
    } catch (error) {
      console.error('[FloatingWidget] ❌ Error during React render:', error);
      throw error;
    }
  }
};

function createDefaultSearchHandler(endpoint: string) {
  return async (query: string) => {
    if (!endpoint) {
      // Return mock data if no endpoint is provided
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        answer: `This is a mock response for "${query}". Configure an API endpoint to get real results.`,
        sources: [
          { title: 'Mock Source 1', url: '#', relevance: 0.9 },
          { title: 'Mock Source 2', url: '#', relevance: 0.8 }
        ]
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return response.json();
  };
}

  console.log('[FloatingWidget] ✅ window.FloatingWidget successfully set!');
  console.log('[FloatingWidget] Available methods:', Object.keys((window as any).FloatingWidget));
} catch (error) {
  console.error('[FloatingWidget] ❌ Failed to set up window.FloatingWidget:', error);
}

// Auto-initialize if script has data-auto-init attribute
if (document.currentScript?.getAttribute('data-auto-init') === 'true') {
  console.log('[FloatingWidget] Auto-init attribute detected');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[FloatingWidget] DOMContentLoaded - auto-initializing...');
    (window as any).FloatingWidget.init();
  });
}