import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToCoreMessages } from 'ai';

// Configuration for AI providers
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// System prompt for Popular Science style responses
const systemPrompt = `You are an intelligent assistant for The Pacific, writing in the engaging, accessible style of Popular Science articles.

Your role is to:
1. Respond with exactly 1 paragraph in the style of Popular Science articles
2. Write like a science journalist explaining complex topics to curious readers
3. Use engaging, narrative-driven language that makes science accessible
4. Include specific scientific details and research findings when relevant
5. Maintain an informative yet conversational tone

Writing style guidelines:
- Start with compelling scientific findings or research discoveries
- Include specific details like researchers, institutions, and methodologies
- Use phrases like "According to researchers," "A team at [University] examined," "The study shows"
- Make complex science understandable without being condescending
- End with broader implications or what this means for our understanding
- Keep responses to ONE focused paragraph only

Example tone: "A team at Spain's University of Alcalá examined small tooth marks on the H. habilis fossils originally recovered from the Olduvai Gorge in Tanzania. To do this, they first trained an advanced machine learning model on an image library of nearly 1,500 photos of bite indentations made by present-day carnivores such as lions, crocodiles, wolves, and hyenas."`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Configure AI model based on provider
    let model;
    if (AI_PROVIDER === 'anthropic' && ANTHROPIC_API_KEY) {
      model = anthropic('claude-3-5-sonnet-20241022');
    } else if (OPENAI_API_KEY) {
      model = openai('gpt-4-turbo');
    } else {
      // Fallback response when no API keys configured
      console.log('No API keys configured, using fallback response');

      const latestMessage = messages[messages.length - 1];
      const query = latestMessage?.content || '';
      const fallbackResponse = await simulateStreamingResponse(query);

      // Create a streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const words = fallbackResponse.split(' ');
          let index = 0;

          const interval = setInterval(() => {
            if (index < words.length) {
              controller.enqueue(encoder.encode(words[index] + ' '));
              index++;
            } else {
              clearInterval(interval);
              controller.close();
            }
          }, 50);
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Convert messages to core format and add system message
    const coreMessages = convertToCoreMessages([
      { role: 'system', content: systemPrompt },
      ...messages
    ]);

    // Stream the response
    const result = await streamText({
      model,
      messages: coreMessages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
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
    'ai': `Researchers at leading AI laboratories have developed transformer models that demonstrate unprecedented capabilities in reasoning, creativity, and problem-solving, fundamentally revolutionizing how humans interact with artificial intelligence. Recent studies show these large language models can process and generate text with remarkable sophistication, while new multimodal systems simultaneously handle text, images, and audio data with increasing accuracy. However, scientists are now grappling with important questions about AI safety, bias, and societal impact as these systems become more powerful and widespread in everyday applications.`,

    'technology': `Scientists and engineers across the globe are pushing the boundaries of technological innovation at an unprecedented pace, with breakthroughs in quantum computing, biotechnology, and artificial intelligence reshaping entire industries. Research teams have developed cloud computing infrastructures that enable massive scalability and remote collaboration, while Internet of Things (IoT) devices create interconnected networks where everyday objects can communicate and share data in real-time. As our digital footprint expands exponentially, cybersecurity researchers are working to develop new protection methods and regulatory frameworks to safeguard user privacy while maintaining the momentum of technological advancement.`,

    'chatbot': `Computational linguists and behavioral scientists have transformed simple rule-based chatbots into sophisticated AI-powered conversational agents that use advanced natural language processing to understand context and maintain coherent dialogue. According to recent psychological research, companies are now employing techniques from behavioral science—including variable reward schedules and social validation mechanisms—to keep users engaged, representing a fundamental shift from utility-focused tools to engagement-optimized experiences. This evolution raises critical questions about digital wellness and AI dependency, as studies suggest users may develop parasocial relationships with increasingly sophisticated chatbot systems that closely mimic human conversation patterns.`,

    'default': `Research teams across multiple disciplines are uncovering fascinating connections between technology, society, and human behavior that continue to shape our understanding of modern life. Scientists are employing interdisciplinary approaches to analyze both immediate effects and long-term societal trends, revealing complex patterns that require careful examination from multiple perspectives. These investigations are providing crucial insights into how technological innovation, cultural shifts, and policy decisions interact in ways that fundamentally influence human development and social structures.`
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