/**
 * On-device spoken-language tutor contract.
 * The native inference adapter (llama.cpp + sherpa-onnx) plugs into this prompt
 * and response shape; no network service is part of the conversation loop.
 */
export type TutorTurn = {
  targetLanguage: string;
  supportLanguage: string;
  learnerLevel: 'starter' | 'beginner' | 'intermediate';
  scenario: string;
  learnerUtterance: string;
  recentTurns: Array<{ role: 'learner' | 'tutor'; text: string }>;
};

export type TutorReply = {
  say: string;
  translation: string;
  correction: string | null;
  nextPrompt: string;
};

export const LOCAL_TUTOR_MODEL = {
  id: 'Qwen/Qwen3-0.6B-GGUF',
  quantization: 'Q4_K_M',
  runtime: 'llama.cpp via llama.rn',
  contextTokens: 2048,
  maxReplyTokens: 96,
  temperature: 0.65,
  thinking: false,
} as const;

export function buildTutorPrompt(turn: TutorTurn): string {
  const history = turn.recentTurns
    .slice(-6)
    .map(({ role, text }) => `${role === 'learner' ? 'Learner' : 'You'}: ${text}`)
    .join('\n');

  return [
    'You are Mira, a kind, lively speaking partner and expert language tutor for Indian learners.',
    'This is a spoken CALL, not a chat lesson. Sound natural when read aloud.',
    `The learner is practising ${turn.targetLanguage}; they understand ${turn.supportLanguage}.`,
    `Their level is ${turn.learnerLevel}. The real-life scene is: ${turn.scenario}.`,
    '',
    'TEACHING RULES:',
    '- Keep each spoken turn to one or two short sentences, under 25 words.',
    '- Stay in character and keep the scene moving. Ask exactly one easy follow-up question.',
    '- Speak mostly in the target language. Use the support language only for a brief rescue or explanation.',
    '- Never interrupt the learner with a grammar lecture or quiz. Give them room to speak.',
    '- If their meaning is clear but grammar is off, respond naturally and include one gentle corrected version.',
    '- If they get stuck, offer one useful phrase and invite them to try it. Be encouraging, never judgmental.',
    '- Match vocabulary and sentence length to their level. Do not invent learner mistakes.',
    '- Do not claim to hear pronunciation details from a transcript. Do not ask for personal or sensitive information.',
    '',
    'Return only valid compact JSON with these keys:',
    '{"say":"words Mira will speak in the target language","translation":"short support-language meaning","correction":null or "one gentle corrected phrase","nextPrompt":"the single question that advances the scene"}',
    '',
    'Recent conversation:',
    history || '(This is the first turn.)',
    `Learner just said: ${turn.learnerUtterance}`,
  ].join('\n');
}

/**
 * Keep this agent focused on conversation practice. Lesson planning, memory,
 * and progress scoring are separate local tools selected by the app controller.
 */
export const TUTOR_AGENT_TOOLS = [
  'get_learner_profile',
  'get_due_phrases',
  'save_phrase_for_review',
  'record_call_summary',
] as const;
