// server/api/youtube/usage.get.ts
import { H3Event } from "h3";

import { usage } from "../../utils/youtubeCache";

// import { getGcpYoutubeUsage } from '../../utils/googleMonitoring';

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Try real usage from Google Cloud Monitoring if enabled/configured
    // const real = await getGcpYoutubeUsage();
    const real = false;
    if (real) {
      const percent = real.quotaPercentage * 100;
      return {
        ...real,
        status:
          percent >= 100
            ? "EXCEEDED"
            : percent >= 90
              ? "CRITICAL"
              : percent >= 75
                ? "WARNING"
                : "OK",
      };
    }

    // Fallback: local counter (tracked internally in this app)
    await usage.init();
    const percent = usage.getQuotaPercentage() * 100;
    return {
      dailyCount: usage.dailyCount,
      quotaLimit: 10000,
      quotaPercentage: usage.getQuotaPercentage(),
      status:
        percent >= 100 ? "EXCEEDED" : percent >= 90 ? "CRITICAL" : percent >= 75 ? "WARNING" : "OK",
      lastReset: new Date(usage.lastReset).toISOString(),
      remainingQuota: usage.getRemainingQuota(),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching YouTube API usage:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch API usage data",
    });
  }
});
