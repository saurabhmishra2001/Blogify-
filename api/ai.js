// Vercel Serverless Function — /api/ai
// Proxies requests to Perplexity AI server-side.
// This keeps the API key secret (never sent to the browser) and solves CORS.

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;
    const model = process.env.PERPLEXITY_MODEL || 'sonar-pro';

    if (!apiKey) {
        return res.status(500).json({ error: 'Perplexity API key is not configured on the server.' });
    }

    try {
        const { messages, max_tokens } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid request body: messages array is required.' });
        }

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: max_tokens || 1000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Perplexity API error:', response.status, errorText);
            return res.status(response.status).json({
                error: `Perplexity API returned ${response.status}`,
                details: errorText,
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error in /api/ai:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
