import claude from 'phantomaton-anthropic';

export default claude({ apiKey: process.env.ANTHROPIC_API_KEY });
