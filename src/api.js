import claude from 'phantomaton-anthropic';

export default claude({
  apiKey: process.env.ANTHROPIC_API_KEY,
  // model: 'claude-3-7-sonnet-20250219'
  model: 'claude-3-5-haiku-20241022'
  // model: 'claude-3-5-sonnet-20241022'
});
