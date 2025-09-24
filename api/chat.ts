import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToCoreMessages } from 'ai';
import { context7Client, type Context7Response } from './context7.js';

// Configuration for AI providers
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Enhanced Context7 integration
async function getEnhancedContext(query: string): Promise<{ context: string, sources: any[] }> {
  try {
    const context7Response: Context7Response = await context7Client.getContext(query);
    return {
      context: context7Response.context,
      sources: context7Response.sources
    };
  } catch (error) {
    console.warn('Context7 integration failed, using fallback:', error);
    return {
      context: 'From The Atlantic knowledge base and expert analysis: ',
      sources: []
    };
  }
}

// Enhanced system prompt with The Atlantic context
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

You have access to enhanced knowledge through Context7 integration, which provides up-to-date documentation and expert sources.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Get the latest user message for context enhancement
    const latestMessage = messages[messages.length - 1];
    const enhancedContext = latestMessage?.content ?
      await getEnhancedContext(latestMessage.content) : { context: '', sources: [] };

    // Enhanced system message with Context7 integration
    const enhancedSystemPrompt = `${systemPrompt}

Enhanced context from Context7: ${enhancedContext.context}

Relevant sources available: ${enhancedContext.sources.map(s => s.title).join(', ')}

Please provide a thoughtful response that incorporates this enhanced context and, when appropriate, reference the relevant sources.`;

    // Configure AI model based on provider
    let model;
    if (AI_PROVIDER === 'anthropic' && ANTHROPIC_API_KEY) {
      model = anthropic('claude-3-5-sonnet-20241022');
    } else if (OPENAI_API_KEY) {
      model = openai('gpt-4-turbo');
    } else {
      return new Response('No AI provider configured', { status: 500 });
    }

    // Convert messages to core format and add enhanced system message
    const coreMessages = convertToCoreMessages([
      { role: 'system', content: enhancedSystemPrompt },
      ...messages
    ]);

    // Stream the response
    const result = await streamText({
      model,
      messages: coreMessages,
      maxTokens: 1000,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Fallback function for client-side usage without backend
export async function simulateStreamingResponse(query: string) {
  // This function provides a fallback for demo purposes
  // when a full backend isn't available

  const responses = {
    'ai': `Artificial Intelligence is experiencing unprecedented growth, with transformer models revolutionizing how we interact with technology. Recent developments in large language models have demonstrated remarkable capabilities in reasoning, creativity, and problem-solving.

The current AI landscape is marked by rapid innovation in areas like multimodal AI, which can process text, images, and audio simultaneously. Companies are racing to develop more efficient models that require less computational power while maintaining high performance.

However, this progress comes with important considerations around bias, safety, and societal impact. Researchers emphasize the need for responsible AI development that prioritizes human welfare and addresses potential risks.

What specific aspect of AI development interests you most?`,

    'technology': `The technology sector continues to evolve at a breakneck pace, driven by advances in artificial intelligence, quantum computing, and biotechnology. Digital transformation has accelerated across industries, fundamentally changing how businesses operate and how people interact with technology.

Cloud computing has become the backbone of modern digital infrastructure, enabling scalable solutions and remote collaboration. Meanwhile, the Internet of Things (IoT) is creating an interconnected world where everyday objects can communicate and share data.

Privacy and security remain paramount concerns as our digital footprint expands. New regulations and technologies are emerging to protect user data while maintaining innovation momentum.

What technology trend would you like to explore further?`,

    'chatbot': `Chatbots have evolved from simple rule-based systems to sophisticated AI-powered conversational agents. Modern chatbots use advanced natural language processing to understand context, maintain conversation history, and provide more human-like interactions.

The psychology behind chatbot engagement is fascinating - companies are employing techniques from behavioral science to keep users engaged, including variable reward schedules and social validation mechanisms. This represents a shift from utility-focused tools to engagement-optimized experiences.

However, this evolution raises important questions about digital wellness and the potential for AI dependency. As chatbots become more sophisticated at mimicking human conversation, users may develop parasocial relationships with AI systems.

Are you interested in the technical aspects or the psychological implications of chatbot design?`,

    'default': `That's an interesting question that touches on several important themes we often explore at The Atlantic. The intersection of technology, society, and human behavior continues to shape our world in profound ways.

Contemporary issues require nuanced analysis that considers multiple perspectives and long-term implications. Whether we're discussing technological innovation, cultural shifts, or policy decisions, it's crucial to examine both immediate effects and broader societal trends.

I'd be happy to dive deeper into any specific aspect of your question. What particular angle would you like to explore?`
  };

  const lowerQuery = query.toLowerCase();
  let response = responses.default;

  if (lowerQuery.includes('ai') || lowerQuery.includes('artificial intelligence')) {
    response = responses.ai;
  } else if (lowerQuery.includes('technology') || lowerQuery.includes('tech')) {
    response = responses.technology;
  } else if (lowerQuery.includes('chatbot') || lowerQuery.includes('chat') || lowerQuery.includes('bot')) {
    response = responses.chatbot;
  }

  // Simulate streaming by returning chunks
  return response;
}