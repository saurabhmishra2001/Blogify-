import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'perplexity-proxy',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/ai' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk.toString(); });
              
              req.on('end', async () => {
                try {
                  const dataRaw = JSON.parse(body || '{}');
                  
                  // 1. Try Groq First
                  const groqKey = env.VITE_GROQ_API_KEY || env.GROQ_API_KEY || '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';
                  const apiKey = groqKey.replace(/['"]/g, '').trim();
                  
                  const rawModel = env.VITE_GROQ_MODEL || env.GROQ_MODEL || 'llama-3.3-70b-versatile';
                  const model = rawModel.replace(/['"]/g, '').trim();

                  console.log('\n--- [AI Proxy] Outgoing Request (Try 1: Groq) ---');
                  console.log('Model:', model);

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
                        messages: dataRaw.messages,
                        max_tokens: dataRaw.max_tokens || 1000,
                      }),
                    });
                  } catch (e) {
                    console.error('Groq connection error:', e.message);
                  }

                  // 2. Try Hugging Face Fallback if Groq response wasn't OK or threw an error
                  if (!response || !response.ok) {
                    console.log(`Groq failed (Status: ${response ? response.status : 'Network Error'})... falling back to Hugging Face!`);
                    
                    const hfKey = env.VITE_HF_API_KEY || env.HF_API_KEY || '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';
                    const hfApiKey = hfKey.replace(/['"]/g, '').trim();
                    const hfModel = env.VITE_HF_MODEL || env.HF_MODEL || 'mistralai/Mixtral-8x7B-Instruct-v0.1';
                    
                    console.log('\n--- [AI Proxy] Outgoing Request (Try 2: Hugging Face) ---');
                    console.log('Model:', hfModel);
                    
                    response = await fetch('https://router.huggingface.co/hf-inference/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${hfApiKey}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        model: hfModel,
                        messages: dataRaw.messages,
                        max_tokens: dataRaw.max_tokens || 1000,
                      }),
                    });
                  }

                  const resText = await response.text();
                  
                  console.log('--- [AI Proxy] API Response ---');
                  console.log('Status:', response.status);
                  
                  if (!response.ok) {
                    console.log('Error Body:', resText);
                  }

                  res.statusCode = response.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(resText);

                } catch (error) {
                  console.error('--- [AI Proxy] Execution Error ---');
                  console.error(error);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Local proxy failed', details: error.message }));
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
