// Fire-and-forget lead submission to Google Apps Script web app.
// Uses no-cors so we can't read the response, but the POST fires and
// Apps Script writes the row. Replace SHEET_URL with your deployed URL.

const SHEET_URL = process.env.NEXT_PUBLIC_LEADS_SHEET_URL ?? ''

export function sendLead(data: Record<string, unknown>): void {
  if (!SHEET_URL) return
  fetch(SHEET_URL, {
    method: 'POST',
    mode:   'no-cors',
    // no Content-Type header — 'application/json' is blocked in no-cors mode.
    // Body is still JSON; Apps Script reads it from e.postData.contents.
    body:   JSON.stringify(data),
  }).catch(() => {})
}
