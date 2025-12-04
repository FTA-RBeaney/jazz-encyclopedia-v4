import { createError, defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { accountId } = getQuery(event);

  // Try to get token from private config first, then public (fallback)
  const token = config.monzoToken || config.public.monzoToken;

  // If account ID is not passed, try to get from config
  const targetAccountId = accountId || config.monzoAccountId || config.public.monzoAccountId;

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: "Monzo token not configured on server",
    });
  }

  if (!targetAccountId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Account ID is required",
    });
  }

  try {
    // We construct the URL manually to ensure 'expand[]' is handled correctly if needed,
    // but $fetch usually handles it. We'll pass it as a query object.
    const response = await $fetch("https://api.monzo.com/transactions", {
      headers: {
        Authorization: `Bearer ${token.trim()}`, // Ensure no whitespace
      },
      query: {
        account_id: targetAccountId,
        "expand[]": "merchant",
      },
    });

    return response;
  } catch (e: any) {
    console.error("Monzo Proxy Error:", e);
    throw createError({
      statusCode: e.statusCode || 500,
      statusMessage: e.message || "Failed to fetch from Monzo",
      data: e.data,
    });
  }
});
