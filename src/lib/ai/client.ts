const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

interface AICallResult {
  output: string
  model: string
  tokensUsed: number
}

export async function callGemini(prompt: string, apiKey: string, retries = 1): Promise<AICallResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.text().catch(() => 'unknown')
      throw new Error(`Gemini API error (${res.status}): ${err}`)
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('Gemini returned empty response')
    }

    const tokensUsed = data?.usageMetadata?.totalTokenCount ?? 0

    return { output: text, model: 'gemini-2.5-flash', tokensUsed }
  } catch (err) {
    clearTimeout(timeout)
    if (retries > 0 && err instanceof Error && !err.message.includes('400')) {
      return callGemini(prompt, apiKey, retries - 1)
    }
    throw err
  }
}

export async function callOpenAI(prompt: string, apiKey: string): Promise<AICallResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 8192,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.text().catch(() => 'unknown')
      throw new Error(`OpenAI API error (${res.status}): ${err}`)
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content

    if (!text) {
      throw new Error('OpenAI returned empty response')
    }

    const tokensUsed = data?.usage?.totalTokens ?? 0

    return { output: text, model: 'gpt-4o', tokensUsed }
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

export async function generateWithFallback(prompt: string): Promise<AICallResult> {
  const geminiKey = process.env.GEMINI_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  if (geminiKey) {
    try {
      return await callGemini(prompt, geminiKey)
    } catch (geminiErr) {
      console.warn('Gemini failed, trying OpenAI fallback:', (geminiErr as Error).message)
      if (openaiKey) {
        return await callOpenAI(prompt, openaiKey)
      }
      throw geminiErr
    }
  }

  if (openaiKey) {
    return await callOpenAI(prompt, openaiKey)
  }

  throw new Error('No AI API keys configured. Set GEMINI_API_KEY or OPENAI_API_KEY in .env.local')
}
