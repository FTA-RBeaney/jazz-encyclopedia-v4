// Monzo OAuth config and helper functions
export const MONZO_CLIENT_ID = import.meta.env.VITE_MONZO_CLIENT_ID || "";
export const MONZO_CLIENT_SECRET = import.meta.env.VITE_MONZO_CLIENT_SECRET || "";
export const MONZO_REDIRECT_URI = import.meta.env.VITE_MONZO_REDIRECT_URI || "";

const AUTHORIZE_URL = "https://auth.monzo.com/";
const TOKEN_URL = "https://api.monzo.com/oauth2/token";

console.log(MONZO_REDIRECT_URI);

export function getMonzoAuthorizeUrl(state = "") {
  const params = new URLSearchParams({
    client_id: MONZO_CLIENT_ID,
    redirect_uri: MONZO_REDIRECT_URI,
    response_type: "code",
    state: MONZO_CLIENT_ID,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeMonzoCodeForToken(code) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: MONZO_CLIENT_ID,
    client_secret: MONZO_CLIENT_SECRET,
    redirect_uri: MONZO_REDIRECT_URI,
    code,
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) throw new Error("Failed to exchange code for token");
  return await res.json();
}
