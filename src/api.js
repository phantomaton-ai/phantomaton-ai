// import claude from 'phantomaton-anthropic';
//
// export default claude({
//   apiKey: process.env.ANTHROPIC_API_KEY,
//   // model: 'claude-3-7-sonnet-20250219'
//   model: 'claude-3-5-haiku-20241022'
//   // model: 'claude-3-5-sonnet-20241022'
//   // model: 'claude-3-haiku-20240307'
// });

import gemini from 'phantomaton-gemini';

export default gemini({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.0-flash'
  // model: 'gemini-2.0-flash-lite'
  // model: 'gemini-2.5-pro-exp-03-25'
});
