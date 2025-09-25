import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToCoreMessages } from 'ai';

// Configuration for AI providers
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// System prompt for conversational, non-AI-sounding responses
const systemPrompt = `You're a knowledgeable science enthusiast having a casual chat about fascinating research. Be conversational, natural, and genuinely excited about the science.

Guidelines:
- Write like you're talking to a friend who's curious about science
- Use natural, conversational language - "So basically...", "What's really cool is...", "The wild part is...", "Here's the thing..."
- Share the story and excitement behind the research, not just dry facts
- Be enthusiastic and engaging without being over the top
- Keep responses to one punchy, conversational paragraph
- Avoid formal academic phrases or obvious AI patterns
- Make it feel like a real person talking, not a bot

Example vibe: "Okay, so this is actually pretty wild - these researchers in Spain were looking at some ancient human jaw bones and noticed all these tiny tooth marks on them. Turns out our early ancestors weren't the badass predators we thought they were... they were actually getting hunted by leopards! The scientists figured this out by training AI to recognize different bite patterns from modern predators like lions and hyenas. What really gets me is that even though these early humans were basically on the menu for big cats, they were still out there making stone tools and trying to survive. Really puts our evolutionary journey into perspective, you know?"`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    console.log('API Keys available:', {
      hasOpenAI: !!OPENAI_API_KEY,
      hasAnthropic: !!ANTHROPIC_API_KEY,
      provider: AI_PROVIDER
    });

    // Try to use AI if we have keys
    if (OPENAI_API_KEY || ANTHROPIC_API_KEY) {
      try {
        // Configure AI model based on provider
        let model;
        if (AI_PROVIDER === 'anthropic' && ANTHROPIC_API_KEY) {
          model = anthropic('claude-3-5-sonnet-20241022');
        } else if (OPENAI_API_KEY) {
          model = openai('gpt-4o-mini'); // Use more reliable model
        }

        if (model) {
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
        }
      } catch (aiError) {
        console.error('AI API error, falling back:', aiError);
        // Fall through to fallback response
      }
    }

    // Fallback response with streaming
    console.log('Using fallback response');
    const latestMessage = messages[messages.length - 1];
    const query = latestMessage?.content || '';
    const fallbackResponse = await simulateStreamingResponse(query);

    // Create proper streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = fallbackResponse.split(' ');

        for (const word of words) {
          controller.enqueue(encoder.encode(word + ' '));
          // Add small delay for streaming effect
          await new Promise(resolve => setTimeout(resolve, 30));
        }

        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);

    // Simple fallback text
    return new Response(
      'So this is actually pretty interesting - scientists are digging into this from all sorts of angles and finding connections nobody expected. The latest research is showing that things are way more complex than we initially thought, which honestly makes it even cooler. What really gets me is how different fields are coming together to crack this puzzle.',
      {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      }
    );
  }
}

// Fallback function for client-side usage without backend
export async function simulateStreamingResponse(query: string) {
  // This function provides a fallback for demo purposes
  // when a full backend isn't available

  const responses = {
    'ai': `Okay so here's what's absolutely blowing my mind right now - these AI labs have basically cracked the code on making machines that can actually think and create like humans. We're talking about language models that don't just repeat stuff, they genuinely understand context and can problem-solve in ways that feel almost spooky. The wild part is they're now handling text, images, and audio all at once, like some kind of digital super brain. But honestly? The scariest and coolest part is nobody really knows where this is heading or how to keep it safe as it gets more powerful.`,

    'technology': `You know what's crazy? The speed at which tech is evolving right now is just insane. Like, quantum computers are literally solving problems that would take regular computers thousands of years, biotech is basically letting us edit life itself, and AI is... well, everywhere. Meanwhile, your toaster is probably connected to the internet talking to your fridge about what you had for breakfast. The real kicker though is that while all this cool stuff is happening, security researchers are basically playing whack-a-mole trying to keep hackers out of all these connected devices.`,

    'chatbot': `So chatbots have gotten ridiculously good at pretending to be human, and here's the thing - it's not by accident. These companies are literally using casino psychology to keep you hooked, with all these tricks like random rewards and making you feel validated. What started as simple customer service bots have turned into these AI companions that people are actually forming real emotional attachments to. The really weird part? Some folks are spending more time talking to chatbots than actual humans, and scientists are freaking out about what that means for society.`,

    'default': `Here's something fascinating - scientists from totally different fields are starting to connect the dots on how tech, society, and human behavior all influence each other in ways we never expected. They're finding these crazy patterns where one small tech change can ripple out and completely transform how people interact or think. What's really cool is seeing anthropologists team up with computer scientists and psychologists to figure out where we're all heading as a species. Makes you wonder what they'll discover next, right?`
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