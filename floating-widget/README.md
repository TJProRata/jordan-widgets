# Floating Widget

A React-based floating chat/search widget with glass morphism design that can be embedded into any HTML page.

## Features

- 🎨 Beautiful glass morphism design with animations
- 📍 Positioned at **bottom-center** of the page by default
- 🔄 Multiple UI states (collapsed, expanded, typing, searching, results)
- 🎯 Smooth transitions between phases
- 📱 Fully responsive design
- 🔌 Easy HTML integration

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5178 to see the widget demo.

### Production Build

```bash
# Build for embedding in HTML pages
npm run build:embed
```

This creates:
- `dist/floating-widget.iife.js` - JavaScript bundle
- `dist/floating-widget.css` - Styles

## Integration

Add the widget to any HTML page:

```html
<!-- Add before closing </body> tag -->
<link rel="stylesheet" href="path/to/floating-widget.css">
<script src="path/to/floating-widget.iife.js"></script>
<script>
  window.FloatingWidget.init({
    position: 'bottom-center', // Widget appears at bottom center
    onSearch: async (query) => {
      // Your search implementation
      const results = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query })
      });
      return results.json();
    }
  });
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| position | string | 'bottom-center' | Widget position: 'bottom-center', 'bottom-right', 'bottom-left', etc. |
| theme | string | 'auto' | Color theme: 'light', 'dark', 'auto' |
| apiKey | string | '' | Your API key for search service |
| onSearch | function | mock function | Custom search handler function |

## Widget States

1. **Collapsed**: Compact button at bottom-center
2. **Expanded**: Full search interface with suggestions
3. **Typing**: Active search with autocomplete
4. **Searching**: Loading state with animation
5. **Results**: Display search results with sources

## Project Structure

```
floating-widget/
├── src/
│   ├── components/
│   │   ├── widget/
│   │   │   ├── atoms/         # Basic components (GlassContainer)
│   │   │   ├── molecules/     # Combined components (CompactButton, SearchBar)
│   │   │   ├── organisms/     # Complex components (phase components)
│   │   │   └── templates/     # Page templates (MainFlow)
│   │   └── FloatingWidget.tsx # Main widget component
│   ├── lib/                   # Utilities and constants
│   ├── hooks/                 # Custom React hooks
│   └── embed.tsx             # Entry point for HTML embedding
└── dist/                      # Built files
```

## Technologies

- React 18+ with TypeScript
- Vite 5.0+ for fast builds
- Tailwind CSS 4.0 for styling
- Glass morphism design pattern

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## License

This is a demonstration project.
