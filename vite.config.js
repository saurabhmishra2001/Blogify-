import { defineConfig, loadEnv } from 'vite' // Last Update: 2024-02-19 09:44
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use Vite's built-in env loader to get all variables including those without VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-proxy',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/ai' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk.toString(); });
              
              req.on('end', async () => {
                try {
                  const dataRaw = JSON.parse(body || '{}');
                  const apiKey = env.GOOGLE_GEMINI_API_KEY?.split(' ')[0].trim();
                  const model = env.GEMINI_MODEL || 'gemini-2.0-flash';

                  console.log('--- Gemini Proxy Debug ---');
                  console.log('Model:', model);
                  console.log('Key Length:', apiKey?.length);

                  if (!apiKey) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'GOOGLE_GEMINI_API_KEY missing in .env' }));
                    return;
                  }

                  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${apiKey}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      model,
                      messages: dataRaw.messages,
                      max_tokens: dataRaw.max_tokens || 1000,
                    }),
                  });

                  const resText = await response.text();
                  res.statusCode = response.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(resText);

                  if (!response.ok) {
                    console.error('Upstream Error:', response.status, resText);
                  }
                } catch (error) {
                  console.error('Proxy Error:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Local proxy exception', details: error.message }));
                }
              });
              return;
            }
            next();
          });
        },
      },
    ],
  }
})
