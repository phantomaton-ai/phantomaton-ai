import claude from 'phantomaton-anthropic';
import gemini from 'phantomaton-gemini';

const g = gemini({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.5-pro-exp-03-25'
  // model: 'gemini-2.0-flash',
  // model: 'gemini-2.0-flash-lite'
});

export default {
  async converse(turns, message) {
    return g.converse(turns.map(turn => ({
      ...turn, role: turn.role === 'assistant' ? 'model' : turn.role
    })), message);
  }
};

// export default claude({
//   apiKey: process.env.ANTHROPIC_API_KEY,
//   // model: 'claude-3-7-sonnet-20250219'
//   model: 'claude-3-5-haiku-20241022'
//   // model: 'claude-3-5-sonnet-20241022'
//   // model: 'claude-3-haiku-20240307'
// });
