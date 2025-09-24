// Client-side AI integration that calls the server API
export class AIClient {
    constructor() {
        this.baseURL = window.location.origin; // Use same origin as the page
        console.log('AI Client initialized with base URL:', this.baseURL);
    }

    async generateUI(prompt, type = 'general') {
        console.log('Generating UI for prompt:', prompt);

        try {
            const response = await fetch(`${this.baseURL}/api/generate-ui`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, type })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ AI Client Success:', result);
            return result;

        } catch (error) {
            console.error('❌ AI Client Error:', error);

            // Return fallback response
            return {
                type: 'general',
                content: `I encountered an error processing "${prompt}".`,
                ui: {
                    html: `
                        <div class="generated-ui-card">
                            <p style="color: #ff6b6b; margin: 0;">⚠️ Connection Error</p>
                            <div style="margin-top: 12px; padding: 12px; background: #333; border-radius: 8px;">
                                <p style="color: #ccc; margin: 0; font-size: 14px;">
                                    Unable to connect to AI service: ${error.message}
                                </p>
                                <button class="generated-button" onclick="location.reload();" style="margin-top: 12px;">
                                    🔄 Retry
                                </button>
                            </div>
                        </div>
                    `,
                    interactive: false,
                    data: { error: error.message }
                }
            };
        }
    }

    async generateText(prompt) {
        try {
            const response = await fetch(`${this.baseURL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            return text;

        } catch (error) {
            console.error('AI Text Generation Error:', error);
            return `I encountered an error processing your request: ${error.message}`;
        }
    }

    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'unhealthy', error: error.message };
        }
    }
}