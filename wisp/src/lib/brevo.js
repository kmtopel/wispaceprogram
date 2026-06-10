// Brevo (formerly Sendinblue) — newsletter contacts API.
// Docs: https://developers.brevo.com/reference/createcontact

const API_BASE = "https://api.brevo.com/v3";

/**
 * Adds (or updates) a contact and subscribes them to a list.
 * Returns { ok: true } on success, or { ok: false, status, error } on failure.
 * Soft-fails on missing env so dev/preview deploys don't crash.
 */
export async function subscribeContact({ email, listId, attributes = {} }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500, error: "BREVO_API_KEY is not set." };
  }
  if (!listId) {
    return { ok: false, status: 500, error: "BREVO_LIST_ID is not set." };
  }

  const res = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email,
      listIds: [Number(listId)],
      // updateEnabled lets us re-subscribe someone who already exists
      // instead of returning an error.
      updateEnabled: true,
      attributes,
    }),
  });

  if (res.ok || res.status === 204) {
    return { ok: true };
  }

  // Try to surface Brevo's error message for easier debugging.
  let detail = "Unknown error";
  try {
    const body = await res.json();
    detail = body?.message || JSON.stringify(body);
  } catch {
    /* response wasn't JSON */
  }

  return { ok: false, status: res.status, error: detail };
}
