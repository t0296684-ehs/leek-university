// api/keepalive.js
// Vercel Cron Job — 每天 ping 一次 Supabase，防止免費方案自動暫停
// 執行一個輕量 REST 查詢（讀取 runs 表第 1 筆，不影響資料）

const SUPABASE_URL = 'https://rpivyhrxahdcysthqode.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaXZ5aHJ4YWhkY3lzdGhxb2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTkxNjgsImV4cCI6MjA2MTIzNTE2OH0.sb_publishable_V1feJIgjyaZvLDVDtd5y3g_KIe3topr';

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/runs?select=id&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const status = response.status;
    const ts = new Date().toISOString();

    if (status === 200 || status === 206) {
      console.log(`[keepalive] OK ${status} @ ${ts}`);
      return res.status(200).json({ ok: true, status, ts });
    } else {
      console.warn(`[keepalive] Unexpected ${status} @ ${ts}`);
      return res.status(200).json({ ok: false, status, ts });
    }
  } catch (err) {
    console.error('[keepalive] Error:', err.message);
    return res.status(200).json({ ok: false, error: err.message });
  }
}
