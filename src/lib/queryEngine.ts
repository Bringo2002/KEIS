import type { QueryResult } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function runQuery(userQuery: string): Promise<QueryResult> {
  if (!BASE_URL) {
    return {
      answer: 'API URL not configured. Please set VITE_API_URL in your .env file.',
      relevantPlayerIds: [],
      relevantEventIds: [],
      confidence: 'low',
      followUpQuestions: ['How do I configure the API URL?'],
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data: QueryResult = await response.json();

    return {
      answer: data.answer ?? 'No answer provided.',
      relevantPlayerIds: Array.isArray(data.relevantPlayerIds) ? data.relevantPlayerIds : [],
      relevantEventIds: Array.isArray(data.relevantEventIds) ? data.relevantEventIds : [],
      confidence: ['high', 'medium', 'low'].includes(data.confidence) ? data.confidence : 'medium',
      followUpQuestions: Array.isArray(data.followUpQuestions) ? data.followUpQuestions : [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      answer: `Query failed: ${message}`,
      relevantPlayerIds: [],
      relevantEventIds: [],
      confidence: 'low',
      followUpQuestions: ['Is the backend running?', 'Check VITE_API_URL in your .env file.'],
    };
  }
}