import claude from 'phantomaton-anthropic';

export default claude({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-5-sonnet-20241022'
});
