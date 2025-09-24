# AI SDK Integration Setup Guide

Complete setup guide for deploying the Creator AI Hub with real AI SDK integration.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and add your API key:
```bash
cp .env.example .env
```

Edit `.env`:
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
NODE_ENV=production
```

### 3. Development Server
```bash
npm run dev
```
Opens at http://localhost:3000/pages/update-askinbio.html

### 4. Production Build
```bash
npm run build
npm run preview
```

## 🏗️ Architecture

### AI SDK Integration
- **Real Mode**: Uses OpenAI GPT-4 via AI SDK when `OPENAI_API_KEY` is set
- **Simulation Mode**: Falls back to mock responses when no API key
- **Error Handling**: Graceful fallback to simulation on API errors

### Key Components
- `AISDKIntegration` class manages real/simulation modes
- Zod schemas validate AI responses
- CSS classes match the mobile creator interface
- Interactive components with onclick handlers

## 📁 File Structure
```
jordan_widgets/
├── pages/
│   └── update-askinbio.html    # Main app with AI SDK integration
├── assets/
│   └── css/
│       └── creator-mobile.css  # Mobile-first styling
├── package.json                # Dependencies & scripts
├── vite.config.js             # Build configuration
├── .env.example               # Environment template
└── AI-SDK-SETUP.md            # This guide
```

## 🔧 Deployment Options

### Option 1: Static with API Proxy (Recommended)
Deploy to Vercel/Netlify with serverless functions for API calls:

1. **Vercel Deployment:**
```bash
npx vercel
```

2. **Add Environment Variables:**
- OPENAI_API_KEY
- NODE_ENV=production

3. **Create API Route** (optional for enhanced security):
```javascript
// api/ai-generate.js
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';

export default async function handler(req, res) {
  const { prompt, schema } = req.body;
  const result = await generateObject({
    model: openai('gpt-4'),
    schema,
    prompt
  });
  res.json(result.object);
}
```

### Option 2: Client-Side Only
Direct browser-to-OpenAI (less secure, API key exposed):
- Set environment variables in hosting platform
- Use build-time replacement via Vite config

### Option 3: Self-Hosted
Deploy to your own server with Node.js:
```bash
npm run build
npm run serve
```

## 🔒 Security Best Practices

### API Key Protection
- **Never commit** API keys to version control
- **Use environment variables** in production
- **Consider API proxies** for enhanced security
- **Implement rate limiting** to prevent abuse

### CORS Configuration
For cross-origin requests, configure your hosting platform:
```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://yourdomain.com"
        }
      ]
    }
  ]
}
```

## 📊 AI SDK Features

### Supported AI Providers
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude 3 (via @ai-sdk/anthropic)
- **Google**: Gemini (via @ai-sdk/google)
- **Mistral**: Mistral AI (via @ai-sdk/mistral)

### UI Generation Types
- **Todo Lists**: Interactive task management
- **Dashboards**: Real-time analytics displays
- **Buttons**: Dynamic action components
- **News**: Formatted article displays
- **General**: Custom UI based on prompts

### Customization
Modify the AI prompt in `generateUI()` to change:
- Component styling preferences
- Data formats and structures
- Interaction patterns
- Content types

## 🧪 Testing

### Manual Testing
1. Start dev server: `npm run dev`
2. Try different prompts:
   - "Create a todo list"
   - "Show me a dashboard"
   - "Design a button component"
   - "Generate tech news"

### API Key Validation
Test both modes:
- With API key: Real AI generation
- Without API key: Simulation mode

### Error Scenarios
- Invalid API key
- Network timeouts
- Malformed prompts
- Rate limiting

## 🔄 Updating AI Models

### Change Models
Edit `AI_CONFIG.model` in the HTML file:
```javascript
const AI_CONFIG = {
    model: 'gpt-3.5-turbo', // or 'gpt-4', 'claude-3-opus', etc.
    // ...
};
```

### Multiple Providers
```javascript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

const models = {
    creative: anthropic('claude-3-opus-20240229'),
    fast: openai('gpt-3.5-turbo'),
    detailed: openai('gpt-4')
};
```

## 📈 Performance Optimization

### Caching Strategies
- Cache common UI patterns locally
- Implement request deduplication
- Use streaming for long responses

### Bundle Optimization
- Tree-shake unused AI SDK modules
- Lazy load AI functionality
- Compress assets with Vite

### Monitoring
- Track API usage and costs
- Monitor response times
- Log error rates and types

## 🐛 Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
npm install ai @ai-sdk/openai zod
```

**Environment variables not working:**
- Check `.env` file format
- Restart development server
- Verify Vite config defines

**API calls failing:**
- Validate API key format
- Check rate limits
- Review network connectivity

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Debug Mode
Enable detailed logging:
```javascript
const AI_CONFIG = {
    // ...
    debug: true
};
```

## 🚀 Next Steps

1. **Enhanced Prompting**: Fine-tune AI prompts for better UI generation
2. **User Preferences**: Store user customization settings
3. **Component Library**: Build reusable AI-generated component patterns
4. **Analytics**: Track usage patterns and popular UI types
5. **Multi-Modal**: Add image/voice input capabilities

## 📚 Resources

- [AI SDK Documentation](https://sdk.vercel.ai)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Zod Schema Validation](https://zod.dev)
- [Vite Build Tool](https://vitejs.dev)

---

Your Creator AI Hub is now ready for production with real AI SDK integration! 🎉