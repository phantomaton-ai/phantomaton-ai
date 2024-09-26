import { getResponse } from './api.js';

export default async function summarize(messages) {
  const summarizationRequest = { role: 'user', content: `
  SYSTEM MESSAGE: Please summarize the conversation thus far, including important details
  from the existing Summary.
  
  Your response will be saved verbatim and used in subsequent rounds of conversation. Please 
  avoid extraneous commentary and omit formatting such of headers. You will be speaking to 
  yourself, so maintain an appropriately-informative tone.
  ` };
  const { role, content } = await getResponse([...messages, summarizationRequest]);
  const texts = content.filter(({ type }) => type === 'text').map(({ text }) => text);
  return texts.join('\n');
}
