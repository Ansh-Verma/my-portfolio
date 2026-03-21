// api/execute.js — Vercel Serverless Function
// Code execution proxy via JDoodle API.
import { readFileSync } from 'fs';
import { join } from 'path';

export const config = { runtime: "nodejs" };

// JDoodle language mappings
const JDOODLE_LANGS = {
  python: { language: 'python3', versionIndex: '4' },
  javascript: { language: 'nodejs', versionIndex: '4' },
  typescript: { language: 'typescript', versionIndex: '0' },
  'c++': { language: 'cpp17', versionIndex: '1' },
  java: { language: 'java', versionIndex: '4' },
  rust: { language: 'rust', versionIndex: '0' },
  go: { language: 'go', versionIndex: '4' },
  c: { language: 'c', versionIndex: '5' },
};

// Manually parse .env.local since vercel dev doesn't always inject env vars
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf8');
    const vars = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      // Remove surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // Remove any embedded \r\n literals
      value = value.replace(/\\r\\n/g, '').replace(/\r/g, '').replace(/\n/g, '');
      vars[key] = value;
    }
    return vars;
  } catch (e) {
    console.error('[execute] Could not read .env.local:', e.message);
    return {};
  }
}

export default async function handler(req, res) {
  // Load env vars: prefer .env.local (clean), fallback to process.env (may have \r\n artifacts)
  const envVars = loadEnvFile();
  const cleanValue = (v) => (v || '').replace(/\\r\\n/g, '').replace(/[\r\n]/g, '').trim();
  const getEnv = (key) => cleanValue(envVars[key]) || cleanValue(process.env[key]) || '';

  // Health check
  if (req.method === 'GET') {
    const hasId = !!getEnv('JDOODLE_CLIENT_ID');
    const hasSec = !!getEnv('JDOODLE_CLIENT_SECRET');
    return res.status(200).json({
      status: 'ok',
      credentials: hasId && hasSec ? 'configured' : 'missing',
      source: process.env.JDOODLE_CLIENT_ID ? 'process.env' : (envVars.JDOODLE_CLIENT_ID ? '.env.local' : 'none'),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { language, code } = req.body || {};
    if (!language || !code) {
      return res.status(200).json({ success: false, output: '⚠️ Missing language or code.' });
    }

    const clientId = getEnv('JDOODLE_CLIENT_ID');
    const clientSecret = getEnv('JDOODLE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('[execute] Credentials still missing after env load');
      return res.status(200).json({
        success: false,
        output: '⚠️ Code execution not configured. Add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to .env.local',
      });
    }

    const mapping = JDOODLE_LANGS[language];
    if (!mapping) {
      return res.status(200).json({ success: false, output: '⚠️ Unsupported language: ' + language });
    }

    console.log('[execute] Calling JDoodle for', language, 'credentials loaded from', process.env.JDOODLE_CLIENT_ID ? 'process.env' : '.env.local');

    const jdRes = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        clientSecret,
        script: String(code).slice(0, 10000),
        language: mapping.language,
        versionIndex: mapping.versionIndex,
      }),
    });

    const text = await jdRes.text();
    console.log('[execute] JDoodle response:', jdRes.status, text.slice(0, 300));

    let data;
    try { data = JSON.parse(text); } catch {
      return res.status(200).json({ success: false, output: '⚠️ Invalid response from execution service.' });
    }

    if (data.error) {
      return res.status(200).json({ success: false, output: '⚠️ ' + data.error });
    }

    return res.status(200).json({
      success: true,
      output: data.output || '(no output)',
      cpuTime: data.cpuTime,
      memory: data.memory,
    });
  } catch (err) {
    console.error('[execute] Error:', err.message);
    return res.status(200).json({ success: false, output: '⚠️ Server error: ' + err.message });
  }
}
