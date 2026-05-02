import type { Player, EconomicEvent, MacroIndicator, QueryResult } from '../types';

const SYSTEM_PROMPT = `You are an expert analyst of the Kenyan economy with deep knowledge of all major corporate, financial, government, and regulatory entities.

Key context about Kenya's economy:
- M-Pesa by Safaricom dominates mobile money, processing KES 35T+ annually
- Kenya has ~$3.8B SGR debt to China Exim Bank, a major fiscal concern
- IMF Extended Credit Facility/Extended Fund Facility program (~$2.34B) with fiscal consolidation conditions
- The Hustler Fund (Financial Inclusion Fund) was launched in 2022
- Finance Bill 2024 was withdrawn after massive Gen-Z led protests
- Kenya successfully refinanced its $2B debut Eurobond in early 2024
- KES depreciated to 160/USD in late 2023 but recovered to ~130/USD by mid-2024
- CBK tightened from 7.0% to 13.0% (2022-2024) then began cutting
- Public debt is ~70% of GDP (~KES 11T)
- NSE 20 index has underperformed, near multi-year lows
- Kenya is world's largest black tea exporter
- Geothermal energy is a key competitive advantage (7th globally)
- The Adani JKIA deal was cancelled after US bribery indictment

You must respond ONLY with a valid JSON object matching this exact schema:
{
  "answer": "string - detailed analytical answer",
  "relevantPlayerIds": ["array of player IDs relevant to the answer"],
  "relevantEventIds": ["array of event IDs relevant to the answer"],
  "confidence": "high | medium | low",
  "followUpQuestions": ["array of 2-3 suggested follow-up questions"]
}

Do NOT include markdown fences, preamble, or any text outside the JSON object. Return ONLY the JSON.`;

function buildContext(players: Player[], events: EconomicEvent[], indicators: MacroIndicator[]): string {
  const playerSummary = players.map((p) =>
    `${p.id}|${p.name}|${p.sector}|${p.type}|${p.keyFacts.join('; ')}`
  ).join('\n');

  const recentEvents = [...events]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30)
    .map((e) => `${e.id}|${e.date}|${e.title}|${e.description}|impact:${e.impact}|${e.impactType}`)
    .join('\n');

  const indicatorSummary = indicators
    .map((ind) => `${ind.name}: ${ind.value}${ind.unit} (trend: ${ind.trend}, change: ${ind.changePercent ?? 0}%)`)
    .join('\n');

  return `=== PLAYERS (${players.length} entities) ===\n${playerSummary}\n\n=== RECENT EVENTS ===\n${recentEvents}\n\n=== MACRO INDICATORS ===\n${indicatorSummary}`;
}

export async function runQuery(
  userQuery: string,
  players: Player[],
  events: EconomicEvent[],
  indicators: MacroIndicator[]
): Promise<QueryResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your-api-key-here') {
    return {
      answer: 'API key not configured. Please set VITE_ANTHROPIC_API_KEY in your .env file to enable AI queries.',
      relevantPlayerIds: [],
      relevantEventIds: [],
      confidence: 'low',
      followUpQuestions: ['How do I configure the API key?'],
    };
  }

  const context = buildContext(players, events, indicators);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5-20250520',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Given the following Kenya economic intelligence database:\n\n${context}\n\nAnswer this query: ${userQuery}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text: string = data.content?.[0]?.text ?? '';

    // Try to parse JSON from the response
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      answer: parsed.answer ?? 'No answer provided.',
      relevantPlayerIds: Array.isArray(parsed.relevantPlayerIds) ? parsed.relevantPlayerIds : [],
      relevantEventIds: Array.isArray(parsed.relevantEventIds) ? parsed.relevantEventIds : [],
      confidence: ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium',
      followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions : [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('JSON')) {
      return {
        answer: 'The AI returned an unparseable response. Please try rephrasing your query.',
        relevantPlayerIds: [],
        relevantEventIds: [],
        confidence: 'low',
        followUpQuestions: ['Can you rephrase your question?'],
      };
    }

    return {
      answer: `Query failed: ${message}`,
      relevantPlayerIds: [],
      relevantEventIds: [],
      confidence: 'low',
      followUpQuestions: ['Is the API key configured correctly?', 'Try asking a simpler question.'],
    };
  }
}
