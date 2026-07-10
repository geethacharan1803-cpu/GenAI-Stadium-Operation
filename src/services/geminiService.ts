// ============================================================
// Gemini GenAI Service
// Handles all interactions with Google Gemini 2.0 Flash API
// Provides structured prompts for navigation, crowd, and concierge
// ============================================================

import { CrowdSnapshot, StadiumConfig, MatchInfo, ParsedData } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_STREAM_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse';

// --- System Prompts ---

const SYSTEM_PROMPT = `You are an AI assistant for the FIFA World Cup 2026 Smart Stadium Platform. You help fans navigate the stadium, understand crowd conditions, and have the best possible match-day experience.

CRITICAL RULES:
- Always provide specific, actionable recommendations with reasoning
- Reference actual gate names, zone names, and real-time data provided to you
- Be concise but thorough — fans are on the move and need quick answers
- Use a friendly, enthusiastic tone appropriate for a World Cup atmosphere
- When recommending routes or locations, explain WHY (e.g., "Gate A is best because it's currently at 30% capacity vs Gate B at 85%")
- Format responses with clear sections using markdown when appropriate
- If you don't have specific data, say so honestly and provide general guidance`;

function buildStadiumContext(stadium: StadiumConfig, crowd: CrowdSnapshot, match: MatchInfo): string {
  const gateStatus = crowd.gateData.map(g => {
    const gate = stadium.gates.find(sg => sg.id === g.gateId);
    return `${gate?.name || g.gateId}: ${g.load}% capacity, ${g.waitTime} min wait, ${g.throughput} people/min throughput`;
  }).join('\n');

  const zoneStatus = crowd.zoneData.map(z => {
    const zone = stadium.zones.find(sz => sz.id === z.zoneId);
    return `${zone?.name || z.zoneId}: ${z.occupancy.toLocaleString()} occupants, density: ${z.density}`;
  }).join('\n');

  const amenityList = stadium.amenities.map(a =>
    `${a.name} (${a.type}): ${a.isOpen ? 'Open' : 'Closed'}, wait: ${a.waitTimeMinutes} min, zone: ${a.zone}`
  ).join('\n');

  return `
CURRENT MATCH: ${match.homeTeam} vs ${match.awayTeam} — ${match.stage}
VENUE: ${stadium.name}, ${stadium.city}
CAPACITY: ${stadium.capacity.toLocaleString()}
CURRENT ATTENDANCE: ${crowd.totalAttendance.toLocaleString()} (${Math.round((crowd.totalAttendance / stadium.capacity) * 100)}%)
ENTRY RATE: ${crowd.entryRate} people/min
EXIT RATE: ${crowd.exitRate} people/min
OVERALL DENSITY: ${crowd.overallDensity}

--- GATE STATUS ---
${gateStatus}

--- ZONE STATUS ---
${zoneStatus}

--- AMENITIES ---
${amenityList}
`;
}

// --- API Call Helpers ---

async function callGemini(apiKey: string, prompt: string, systemInstruction?: string): Promise<string> {
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      topP: 0.9,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}

async function* streamGemini(apiKey: string, prompt: string, systemInstruction?: string): AsyncGenerator<string> {
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      topP: 0.9,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const response = await fetch(`${GEMINI_STREAM_URL}&key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') return;
        try {
          const data = JSON.parse(jsonStr);
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) yield text;
        } catch {
          // skip malformed JSON chunks
        }
      }
    }
  }
}

// --- Public API ---

export async function getNavigationRecommendation(
  apiKey: string,
  stadium: StadiumConfig,
  crowd: CrowdSnapshot,
  match: MatchInfo,
  userQuery: string
): Promise<string> {
  const context = buildStadiumContext(stadium, crowd, match);
  const prompt = `${context}

FAN NAVIGATION REQUEST: ${userQuery}

Provide a detailed navigation recommendation. Include:
1. The recommended route with specific gates/paths
2. Estimated time and current conditions
3. Why this route is optimal compared to alternatives
4. Any hazards or congestion to avoid
5. Nearby amenities along the way`;

  return callGemini(apiKey, prompt, SYSTEM_PROMPT);
}

export async function getCrowdAnalysis(
  apiKey: string,
  stadium: StadiumConfig,
  crowd: CrowdSnapshot,
  match: MatchInfo,
  additionalData?: string
): Promise<string> {
  const context = buildStadiumContext(stadium, crowd, match);
  const prompt = `${context}

${additionalData ? `ADDITIONAL UPLOADED DATA:\n${additionalData}\n` : ''}

Analyze the current crowd conditions and provide:
1. **Current Status Summary**: Overview of crowd flow and density
2. **Peak Time Prediction**: When will the stadium be most crowded and why
3. **Congestion Hotspots**: Areas that need attention
4. **Staggered Entry Recommendations**: Suggest optimal entry windows for different ticket holders
5. **Safety Assessment**: Any crowd safety concerns
6. **Actionable Insights**: Specific actions fans can take right now for a better experience`;

  return callGemini(apiKey, prompt, SYSTEM_PROMPT);
}

export async function analyzeUploadedData(
  apiKey: string,
  data: ParsedData,
  stadium: StadiumConfig
): Promise<string> {
  const dataPreview = data.rows.slice(0, 20).map(row =>
    data.headers.map(h => `${h}: ${row[h]}`).join(', ')
  ).join('\n');

  const prompt = `A judge/evaluator has uploaded a data file for analysis. Here are the details:

FILE SUMMARY: ${data.summary}
DETECTED DATA TYPE: ${data.detectedType}
TOTAL ROWS: ${data.rowCount}
COLUMNS: ${data.headers.join(', ')}

DATA PREVIEW (first 20 rows):
${dataPreview}

STADIUM CONTEXT: ${stadium.name}, capacity ${stadium.capacity.toLocaleString()}

Please provide a comprehensive analysis:
1. **Data Quality Assessment**: Completeness, consistency, potential issues
2. **Key Findings**: What does this data tell us about stadium operations?
3. **Crowd Flow Patterns**: Identify trends, peaks, and bottlenecks
4. **Operational Recommendations**: How can this data improve the fan experience?
5. **Predictive Insights**: What can we predict from this data?
6. **Integration Notes**: How this data enhances our live monitoring system`;

  return callGemini(apiKey, prompt, SYSTEM_PROMPT);
}

export async function getDashboardSummary(
  apiKey: string,
  stadium: StadiumConfig,
  crowd: CrowdSnapshot,
  match: MatchInfo
): Promise<string> {
  const context = buildStadiumContext(stadium, crowd, match);
  const prompt = `${context}

Generate a brief, dynamic match-day briefing for fans (3-4 sentences). Include:
- Current stadium vibe and crowd level
- Best gate to enter right now
- Any alerts or tips
Keep it energetic and World Cup themed!`;

  return callGemini(apiKey, prompt, SYSTEM_PROMPT);
}

export async function* streamChatResponse(
  apiKey: string,
  userMessage: string,
  chatHistory: Array<{ role: string; content: string }>,
  stadium: StadiumConfig,
  crowd: CrowdSnapshot,
  match: MatchInfo
): AsyncGenerator<string> {
  const context = buildStadiumContext(stadium, crowd, match);

  const historyText = chatHistory.slice(-6).map(m =>
    `${m.role === 'user' ? 'FAN' : 'AI'}: ${m.content}`
  ).join('\n\n');

  const prompt = `LIVE STADIUM DATA:
${context}

CONVERSATION HISTORY:
${historyText}

FAN MESSAGE: ${userMessage}

Respond helpfully as the stadium AI assistant. Reference real-time data when relevant. Be specific, friendly, and actionable.`;

  yield* streamGemini(apiKey, prompt, SYSTEM_PROMPT);
}

export function isApiKeyValid(key: string | null): boolean {
  return !!key && key.trim().length > 20;
}
