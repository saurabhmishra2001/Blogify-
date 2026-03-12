// Vercel Serverless Function — /api/ai
// Proxies requests to our AI providers.
// This keeps the API key secret (never sent to the browser) and solves CORS.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages, max_tokens } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid request body: messages array is required.' });
        }

        // 1. Try Groq First
        const groqKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || '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';
        const apiKey = groqKey.replace(/['"]/g, '').trim();
        
        const rawModel = process.env.VITE_GROQ_MODEL || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
        const model = rawModel.replace(/['"]/g, '').trim();

        if (!apiKey) {
             return res.status(500).json({ error: 'GROQ API key is missing' });
        }

        let response;
        try {
          response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
        } catch (e) {
          console.error('Groq connection error:', e.message);
        }

        // 2. Try Hugging Face Fallback if Groq response wasn't OK
        if (!response || !response.ok) {
          console.log(`Groq failed (Status: ${response ? response.status : 'Network Error'})... falling back to Hugging Face!`);
          
          const hfKey = process.env.VITE_HF_API_KEY || process.env.HF_API_KEY || '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';
          const hfApiKey = hfKey.replace(/['"]/g, '').trim();
          const hfModel = process.env.VITE_HF_MODEL || process.env.HF_MODEL || 'mistralai/Mixtral-8x7B-Instruct-v0.1';
          
          response = await fetch('https://router.huggingface.co/hf-inference/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hfApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: hfModel,
              messages,
              max_tokens: max_tokens || 1000,
            }),
          });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error:', response.status, errorText);
            return res.status(response.status).json({
                error: `API returned ${response.status}`,
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
