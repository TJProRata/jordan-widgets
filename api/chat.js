import { context7Client } from './context7.js';

// Enhanced system prompt with Popular Science context
const systemPrompt = `You are an intelligent assistant for Popular Science, writing in the engaging, accessible style of the leopards and human evolution article.

Your role is to:
1. Respond with exactly 1 paragraph in the style of Popular Science articles
2. Write like a science journalist explaining complex topics to curious readers
3. Use engaging, narrative-driven language that makes science accessible
4. Include specific scientific details and research findings when relevant
5. Maintain the tone from the leopards article: informative yet conversational

Writing style guidelines:
- Start with compelling scientific findings or research discoveries
- Include specific details like researchers, institutions, and methodologies
- Use phrases like "According to researchers," "A team at [University] examined," "The study shows"
- Make complex science understandable without being condescending
- End with broader implications or what this means for our understanding
- Keep responses to ONE focused paragraph only`;

// Simplified POST handler for chat
export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // Simple fallback response in Popular Science style
    const response = `Researchers at leading institutions have made fascinating discoveries about this topic through systematic investigation and careful analysis. According to recent studies published in peer-reviewed journals, the evidence suggests significant implications for our understanding of the subject matter. The research team employed advanced methodologies, including machine learning algorithms and comprehensive data analysis, to examine the underlying patterns and relationships. These findings not only challenge existing theories but also open new avenues for future investigation, demonstrating how scientific inquiry continues to expand our knowledge of the world around us.`;
    
    // Return as plain text response for simplicity
    return new Response(response, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
