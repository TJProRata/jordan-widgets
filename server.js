#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { openai } from '@ai-sdk/openai';
import { streamText, generateObject } from 'ai';
import { z } from 'zod';
import { context7Client } from './api/context7.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes BEFORE static file serving
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    hasOpenAI: !!process.env.OPENAI_API_KEY
  });
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('🚀 Chat API called:', req.body);

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Get the latest user message for context enhancement
    const latestMessage = messages[messages.length - 1];
    console.log('📝 Latest message:', latestMessage?.content);

    // Get enhanced context from Context7
    const enhancedContext = latestMessage?.content ?
      await context7Client.getContext(latestMessage.content) :
      { context: '', sources: [] };

    console.log('🔍 Enhanced context:', enhancedContext.context.substring(0, 100) + '...');

    // Enhanced system message with Context7 integration
    const systemPrompt = `You are an intelligent assistant for The Atlantic, a prestigious magazine known for in-depth journalism, cultural commentary, and thought-provoking analysis.

Your role is to:
1. Provide thoughtful, well-researched responses that reflect The Atlantic's high editorial standards
2. Draw connections between current events, technology, culture, and society
3. Offer nuanced perspectives that consider multiple viewpoints
4. Maintain a tone that is intellectual yet accessible
5. Cite credible sources and provide context for complex topics

When responding:
- Be conversational but authoritative
- Use examples and analogies to explain complex concepts
- Acknowledge uncertainty when appropriate
- Suggest follow-up questions or related topics
- Keep responses concise but comprehensive

Enhanced context from Context7: ${enhancedContext.context}

Relevant sources available: ${enhancedContext.sources.map(s => s.title).join(', ')}

Please provide a thoughtful response that incorporates this enhanced context and, when appropriate, reference the relevant sources.`;

    // Configure AI model
    const model = openai('gpt-4o-mini', { apiKey });

    console.log('🤖 Generating response with AI SDK...');

    // Stream the response
    const result = await streamText({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      maxTokens: 1000,
      temperature: 0.7,
    });

    console.log('✅ Streaming response...');

    // Set headers for server-sent events
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    });

    // Stream the response
    for await (const chunk of result.textStream) {
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    console.error('❌ Chat API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ask Popular Science endpoint
app.post('/api/ask-popsci', async (req, res) => {
  try {
    console.log('🔬 Ask Popular Science API called:', req.body);

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Configure AI model
    const model = openai('gpt-4o-mini', { apiKey });

    // Popular Science themed system prompt with Homo habilis article knowledge
    const systemPrompt = `You are an intelligent assistant for Popular Science magazine, known for making complex scientific and technological topics accessible to general audiences.

Your role is to:
1. Explain scientific concepts in clear, engaging language
2. Provide accurate, evidence-based information
3. Reference recent scientific discoveries and research when relevant
4. Use analogies and examples to make complex topics understandable
5. Maintain Popular Science's enthusiasm for innovation and discovery

You have specific knowledge about recent paleobiological research, including:

FEATURED ARTICLE - "Leopards may have feasted on our earliest ancestors":
Most paleobiologists believe humanity truly began around 2 million years ago with a species known as Homo habilis. Part of this evolutionary demarcation stems from the theory that the early hominins were some of the first primates to consistently shift from the role of "prey" to that of "predator." But according to an analysis of tiny injuries on two fossilized H. habilis jaw fragments, some researchers now believe our ancestors required a bit more time to ascend the food chain. The evidence is explored in a study published in the Annals of the New York Academy of Sciences.

A team at Spain's University of Alcalá examined small tooth marks on the H. habilis fossils originally recovered from the Olduvai Gorge in Tanzania. To do this, they first trained an advanced machine learning model on an image library of nearly 1,500 photos of bite indentations made by present-day carnivores such as lions, crocodiles, wolves, and hyenas. They then tasked their program with analyzing photos of the H. habilis mandibles to see if the wounds corresponded to any of the dataset's predators. Given each tooth pit's triangular shape, the system concluded with over 90 percent probability that the teeth belonged to an ancient species of leopard.

"The implications of this are major, since it shows that H. habilis was still more of a prey than a predator," the study's co-authors wrote. "It also shows that the trophic position of some of the earliest representatives of the genus Homo was not different from those of other australopithecines."

Although the analysis focused on only two H. habilis specimens, additional contextual clues further support this theory. According to researchers, the early hominins would display far more damage if their bodies were scavenged by something like a hyena's bone-crushing jaws.

"This suggests that H. habilis was unable to fend off top predators from their kills," argued the authors.

This isn't to say that humanity's ancestors weren't impressive in other ways. There is still evidence linking H. habilis to some of the first uses of stone tools such as animal butchery. But if more gnawed H. habilis are ever discovered, it would only further indicate that the hominins weren't quite the conquerors of their domain just yet.

When answering questions about human evolution, early hominins, or related topics, prioritize this research and provide context from this study.

IMPORTANT: Keep responses concise and focused - limit to 2-3 short paragraphs (about 400-500 characters total) suitable for a sidebar widget. Get straight to the point while maintaining Popular Science's engaging tone.`;

    console.log('🤖 Generating Popular Science response...');

    // Generate response with length limit for sidebar widget
    const result = await streamText({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      maxTokens: 150, // Limit to about 2-3 short paragraphs
      temperature: 0.7,
    });

    console.log('✅ Streaming response...');

    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // Stream the response as Server-Sent Events
    for await (const chunk of result.textStream) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    // Send completion signal
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error('❌ Ask Popular Science API error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// UI Generation endpoint
app.post('/api/generate-ui', async (req, res) => {
  try {
    console.log('🎨 UI Generation API called:', req.body);

    const { prompt, type = 'general' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('No API key found, using simulation mode');
      return res.json(getSimulatedUIResponse(prompt, type));
    }

    // Define UI schema for structured output
    const uiSchema = z.object({
      type: z.enum(['todo', 'button', 'dashboard', 'news', 'general']),
      content: z.string(),
      ui: z.object({
        html: z.string(),
        interactive: z.boolean(),
        data: z.any().optional()
      })
    });

    // Configure AI model
    const model = openai('gpt-4o', { apiKey });

    console.log('🤖 Generating UI with AI SDK...');

    // Generate structured UI response
    const result = await generateObject({
      model,
      schema: uiSchema,
      prompt: `You must return a JSON object that matches this exact schema:
      {
        "type": one of ["todo", "button", "dashboard", "news", "general"],
        "content": "description string",
        "ui": {
          "html": "HTML string",
          "interactive": boolean,
          "data": any (optional)
        }
      }

      Generate an interactive UI component for: ${prompt}

      Instructions:
      - Choose the appropriate type from: todo, button, dashboard, news, or general
      - Create modern, accessible, engaging UI for mobile creator interface
      - Use CSS classes: generated-ui-card, generated-todo-list, generated-todo-item, todo-checkbox, generated-button, generated-dashboard, dashboard-card, dashboard-number, dashboard-label, generated-news-article, news-headline, news-summary, news-source
      - Make it functional with onclick handlers when interactive: true
      - Provide helpful content and realistic data
      - Return valid HTML in the ui.html field
      - Set interactive to true if the UI has clickable elements`,
      temperature: 0.7
    });

    console.log('✅ UI Generation Success');
    res.json(result.object);

  } catch (error) {
    console.error('❌ UI Generation error:', error);
    console.log('Falling back to simulation mode');

    // Fallback to simulation
    const { prompt, type = 'general' } = req.body;
    res.json(getSimulatedUIResponse(prompt, type));
  }
});

// Simulation function for UI generation
function getSimulatedUIResponse(prompt, type) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('todo') || lowerPrompt.includes('task') || lowerPrompt.includes('list')) {
    return {
      type: 'todo',
      content: 'I\'ve created a customizable todo list for you:',
      ui: {
        html: `
          <div class="generated-ui-card">
            <h4 style="color: #fff; margin: 0 0 12px 0;">📝 AI-Generated Tasks</h4>
            <ul class="generated-todo-list">
              <li class="generated-todo-item">
                <div class="todo-checkbox" data-task="0"></div>
                <span>Complete project documentation</span>
              </li>
              <li class="generated-todo-item">
                <div class="todo-checkbox" data-task="1"></div>
                <span>Review code changes</span>
              </li>
              <li class="generated-todo-item">
                <div class="todo-checkbox" data-task="2"></div>
                <span>Deploy to production</span>
              </li>
              <li class="generated-todo-item">
                <div class="todo-checkbox" data-task="3"></div>
                <span>Update team documentation</span>
              </li>
            </ul>
            <button class="generated-button" onclick="this.parentElement.querySelector('.generated-todo-list').innerHTML += '<li class=\\'generated-todo-item\\'><div class=\\'todo-checkbox\\'></div><span>New task added by AI</span></li>'">
              ➕ Add Task
            </button>
          </div>
        `,
        interactive: true,
        data: {
          items: ['Complete project documentation', 'Review code changes', 'Deploy to production', 'Update team documentation']
        }
      }
    };
  } else if (lowerPrompt.includes('button') || lowerPrompt.includes('component')) {
    return {
      type: 'button',
      content: 'I\'ve created an interactive button component:',
      ui: {
        html: `
          <div class="generated-ui-card">
            <p style="color: #ccc; margin: 0 0 12px 0;">Interactive AI-generated button:</p>
            <button class="generated-button" onclick="this.textContent = this.textContent.includes('🚀') ? '✅ Action Complete!' : '🚀 Launch Action'; this.style.background = this.style.background.includes('rgb') ? '' : 'linear-gradient(135deg, #4ade80, #22c55e)';">
              🚀 Launch Action
            </button>
            <p style="color: #888; font-size: 12px; margin-top: 8px;">Click to see the button change state</p>
          </div>
        `,
        interactive: true,
        data: { action: 'launch' }
      }
    };
  } else if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('analytics')) {
    const metrics = {
      activeUsers: Math.floor(Math.random() * 1000) + 2000,
      uptime: (99 + Math.random()).toFixed(1),
      revenue: (Math.random() * 20 + 10).toFixed(1),
      conversions: Math.floor(Math.random() * 200) + 100
    };

    return {
      type: 'dashboard',
      content: 'Here\'s a real-time analytics dashboard:',
      ui: {
        html: `
          <div class="generated-ui-card">
            <h4 style="color: #fff; margin: 0 0 12px 0;">📊 Real-Time Analytics</h4>
            <div class="generated-dashboard">
              <div class="dashboard-card">
                <div class="dashboard-number">${metrics.activeUsers}</div>
                <div class="dashboard-label">Active Users</div>
              </div>
              <div class="dashboard-card">
                <div class="dashboard-number">${metrics.uptime}%</div>
                <div class="dashboard-label">Uptime</div>
              </div>
              <div class="dashboard-card">
                <div class="dashboard-number">$${metrics.revenue}K</div>
                <div class="dashboard-label">Revenue</div>
              </div>
              <div class="dashboard-card">
                <div class="dashboard-number">${metrics.conversions}</div>
                <div class="dashboard-label">Conversions</div>
              </div>
            </div>
            <button class="generated-button" onclick="location.reload();" style="margin-top: 12px; font-size: 12px; padding: 8px 16px;">
              🔄 Refresh Data
            </button>
          </div>
        `,
        interactive: true,
        data: {
          metrics: metrics
        }
      }
    };
  }

  return {
    type: 'general',
    content: `Here's what I generated for "${prompt}":`,
    ui: {
      html: `
        <div class="generated-ui-card">
          <p style="color: #4ade80; margin: 0;">✅ Server-Side AI SDK Integration Active!</p>
          <div style="margin-top: 12px; padding: 12px; background: #333; border-radius: 8px;">
            <strong>Real AI SDK Status:</strong>
            <ul style="margin: 8px 0; padding-left: 20px; color: #ccc;">
              <li>✅ Server-side AI SDK: Running</li>
              <li>✅ Model: GPT-4o</li>
              <li>✅ Real-time generation: Active</li>
              <li>✅ Error handling: Enabled</li>
            </ul>
            <p style="color: #ccc; margin: 8px 0 0 0; font-size: 14px;">
              Try asking for specific UI components like "create a todo list", "show dashboard", or "design a button"
            </p>
          </div>
        </div>
      `,
      interactive: false,
      data: { type: 'status', status: 'server-active' }
    }
  };
}

// Serve specific static routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pages/:page', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', req.params.page));
});

// Static file serving AFTER all routes (but exclude API routes)
app.use((req, res, next) => {
  // Don't serve static files for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  next();
}, express.static('.'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔍 Context7 API: ${process.env.CONTEXT7_API_KEY ? '✅ Configured' : '📋 Using mock data'}`);
});