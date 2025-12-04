// This composable handles Monzo OAuth login and callback
import { ref } from "vue";

import { exchangeMonzoCodeForToken, getMonzoAuthorizeUrl } from "./useMonzoOAuth";

export function useMonzoAuthFlow() {
  const accessToken = ref("");
  const refreshToken = ref("");
  const expiresIn = ref(0);
  const error = ref("");

  function startLogin(state = "") {
    window.location.href = getMonzoAuthorizeUrl(state);
  }

  async function handleCallback(code) {
    try {
      const tokenData = await exchangeMonzoCodeForToken(code);
      accessToken.value = tokenData.access_token;
      refreshToken.value = tokenData.refresh_token;
      expiresIn.value = tokenData.expires_in;
      localStorage.setItem("monzo_access_token", accessToken.value);
      localStorage.setItem("monzo_refresh_token", refreshToken.value);
      localStorage.setItem("monzo_token_expires", (Date.now() + expiresIn.value * 1000).toString());
      error.value = "";
    } catch (e) {
      error.value = e.message || "OAuth callback failed";
    }
  }

  function getStoredToken() {
    const token = localStorage.getItem("monzo_access_token");
    const expires = Number(localStorage.getItem("monzo_token_expires"));
    if (token && expires > Date.now()) {
      return token;
    }
    return "";
  }

  return {
    accessToken,
    refreshToken,
    expiresIn,
    error,
    startLogin,
    handleCallback,
    getStoredToken,
  };
}
