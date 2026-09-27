const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const encodeBase64 = (value) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

const decodeBase64 = (value) => {
  const binary = atob(value.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export async function handleJournal(request, env) {
  const authorization = request.headers.get('authorization') || '';
  const suppliedKey = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

  if (!env.JOURNAL_ADMIN_TOKEN || suppliedKey !== env.JOURNAL_ADMIN_TOKEN) {
    return json({ error: 'Invalid admin key.' }, 401);
  }

  if (!env.GITHUB_TOKEN) {
    return json({ error: 'The GitHub token is not configured.' }, 500);
  }

  let entry;
  try {
    entry = await request.json();
  } catch {
    return json({ error: 'The request body must be valid JSON.' }, 400);
  }

  const required = ['date', 'project', 'built', 'learned', 'solved', 'next'];
  const missing = required.filter((field) => !String(entry[field] || '').trim());
  if (missing.length) {
    return json({ error: `Missing fields: ${missing.join(', ')}` }, 400);
  }

  const normalized = {
    date: String(entry.date).slice(0, 10),
    displayDate: new Intl.DateTimeFormat('en-US', {
      month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC',
    }).format(new Date(`${String(entry.date).slice(0, 10)}T00:00:00Z`)).toUpperCase(),
    project: String(entry.project).trim().slice(0, 100),
    built: String(entry.built).trim().slice(0, 800),
    learned: String(entry.learned).trim().slice(0, 800),
    solved: String(entry.solved).trim().slice(0, 800),
    next: String(entry.next).trim().slice(0, 800),
    tags: Array.isArray(entry.tags)
      ? entry.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 8)
      : String(entry.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 8),
  };

  const owner = env.GITHUB_OWNER || 'brutev';
  const repository = env.GITHUB_REPO || 'portfolio';
  const path = 'src/data/journal.json';
  const endpoint = `https://api.github.com/repos/${owner}/${repository}/contents/${path}`;
  const headers = {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${env.GITHUB_TOKEN}`,
    'x-github-api-version': '2022-11-28',
    'user-agent': 'vignesh-portfolio-journal',
  };

  const currentResponse = await fetch(endpoint, { headers });
  if (!currentResponse.ok) {
    return json({ error: 'Could not read the journal from GitHub.' }, 502);
  }

  const currentFile = await currentResponse.json();
  const entries = JSON.parse(decodeBase64(currentFile.content));
  entries.unshift(normalized);

  const updateResponse = await fetch(endpoint, {
    method: 'PUT',
    headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify({
      message: `Journal: ${normalized.date}`,
      content: encodeBase64(`${JSON.stringify(entries, null, 2)}\n`),
      sha: currentFile.sha,
      branch: 'main',
    }),
  });

  if (!updateResponse.ok) {
    const details = await updateResponse.text();
    return json({ error: 'GitHub rejected the journal update.', details }, 502);
  }

  const result = await updateResponse.json();
  return json({
    ok: true,
    message: 'Journal entry published. Cloudflare will deploy the commit automatically.',
    commitUrl: result.commit?.html_url || null,
  });
}

export async function onRequestPost({ request, env }) {
  return handleJournal(request, env);
}
