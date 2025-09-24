import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
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
        console.error('Ask Popular Science API error:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}