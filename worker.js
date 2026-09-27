import { handleJournal } from './functions/api/journal.js';

const json = (data, status) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/journal') {
      if (request.method !== 'POST') {
        return json({ error: 'Method not allowed.' }, 405);
      }
      return handleJournal(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
