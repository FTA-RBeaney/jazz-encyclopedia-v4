import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import fsDriver from "unstorage/drivers/fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize storage with file system driver for persistence
const cacheStorage = createStorage({
  driver: fsDriver({
    base: join(__dirname, "../../.cache/youtube"),
  }),
});

// Cache TTL in seconds (1 hour)
const CACHE_TTL = 60 * 60;

// YouTube API allows up to 50 video IDs per request
export const YOUTUBE_BATCH_SIZE = 50;

// In-memory cache as a fallback
const memoryCache = new Map<string, { data: any; expires: number }>();

// Generate a consistent cache key for video IDs
export function getCacheKey(videoIds: string[]): string {
  return `youtube:videos:${[...videoIds].sort().join(",")}`;
}

// Get cached video details
export async function getCachedVideoDetails<T>(videoIds: string[]): Promise<T[] | null> {
  const cacheKey = getCacheKey(videoIds);
  const now = Math.floor(Date.now() / 1000);

  // Check in-memory cache first
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expires > now) {
    return cached.data as T[];
  }

  // Check storage cache
  try {
    const cachedData = await cacheStorage.getItem<T[]>(cacheKey);
    if (cachedData) {
      // Update in-memory cache
      memoryCache.set(cacheKey, {
        data: cachedData,
        expires: now + CACHE_TTL,
      });
      return cachedData;
    }
  } catch (error) {
    console.error("Error reading from cache storage:", error);
  }

  return null;
}

// Set cached video details
export async function setCachedVideoDetails<T>(videoIds: string[], data: T[]): Promise<void> {
  const cacheKey = getCacheKey(videoIds);
  const expires = Math.floor(Date.now() / 1000) + CACHE_TTL;

  // Update in-memory cache
  memoryCache.set(cacheKey, { data, expires });

  // Update storage cache
  try {
    await cacheStorage.setItem(cacheKey, data, { ttl: CACHE_TTL * 1000 });
  } catch (error) {
    console.error("Error writing to cache storage:", error);
  }
}

// Process video IDs in batches
export function batchVideoIds(
  videoIds: string[],
  batchSize: number = YOUTUBE_BATCH_SIZE
): string[][] {
  const batches: string[][] = [];
  for (let i = 0; i < videoIds.length; i += batchSize) {
    batches.push(videoIds.slice(i, i + batchSize));
  }
  return batches;
}

// Extract video ID from URL
export function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^\s&?/]+)/
  );
  return match ? match[1] : null;
}

// Helper to track local quota usage with a source label
export async function trackQuotaUsage(source: string, amount: number = 1) {
  try {
    await usage.init();
    await usage.increment(amount);
    const percent = Math.round(usage.getQuotaPercentage() * 100);
    console.log(`[YouTubeQuota] +${amount} from ${source} — ${usage.dailyCount}/10000 (${percent}%)`);
  } catch (e) {
    console.warn('[YouTubeQuota] Failed to track quota usage:', e);
  }
}

const rateLimit = {
  lastRequest: 0,
  minInterval: 1000, // 1 second between API calls
  queue: [] as (() => void)[],

  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLast = now - this.lastRequest;

    if (timeSinceLast >= this.minInterval) {
      this.lastRequest = now;
      return;
    }

    await new Promise((resolve) => {
      this.queue.push(() => {
        this.lastRequest = Date.now();
        resolve(undefined);
      });

      // Process queue
      if (this.queue.length === 1) {
        setTimeout(() => {
          const next = this.queue.shift();
          next?.();
        }, this.minInterval - timeSinceLast);
      }
    });
  },
};

// Usage tracking configuration
const QUOTA_LIMIT = 10000;
const WARNING_THRESHOLD = 0.8; // 80% of quota

// Enhanced usage tracking with persistence
const usage = {
  dailyCount: 0,
  lastReset: "",
  isInitialized: false,

  // Initialize usage tracking from storage
  async init() {
    if (this.isInitialized) return;

    try {
      const saved = await cacheStorage.getItem<{ count: number; date: string }>("youtube:usage");
      const today = new Date().toDateString();

      if (saved && saved.date === today) {
        this.dailyCount = saved.count;
      } else {
        this.dailyCount = 0;
      }

      this.lastReset = today;
      this.isInitialized = true;
      this.logStatus();
    } catch (error) {
      console.error("Failed to initialize usage tracking:", error);
      this.dailyCount = 0;
      this.lastReset = new Date().toDateString();
      this.isInitialized = true;
    }
  },

  // Increment usage counter
  async increment(amount = 1) {
    await this.init();

    const today = new Date().toDateString();
    if (today !== this.lastReset) {
      console.log(`Resetting YouTube API quota counter. Previous day's usage: ${this.dailyCount}`);
      this.dailyCount = 0;
      this.lastReset = today;
    }

    this.dailyCount += amount;
    await this.save();
    this.logStatus();

    // Check if we're approaching the quota limit
    if (this.getQuotaPercentage() >= WARNING_THRESHOLD) {
      console.warn(`⚠️ YouTube API Quota Warning: ${this.dailyCount}/${QUOTA_LIMIT} (${Math.round(this.getQuotaPercentage() * 100)}%) used today`);
    }

    return this.dailyCount;
  },

  // Save current usage to storage
  async save() {
    try {
      await cacheStorage.setItem("youtube:usage", {
        count: this.dailyCount,
        date: this.lastReset,
      });
    } catch (error) {
      console.error("Failed to save usage data:", error);
    }
  },

  // Get current quota usage percentage
  getQuotaPercentage(): number {
    return Math.min(this.dailyCount / QUOTA_LIMIT, 1);
  },

  // Get remaining quota
  getRemainingQuota(): number {
    return Math.max(0, QUOTA_LIMIT - this.dailyCount);
  },

  // Log current status
  logStatus() {
    const percent = this.getQuotaPercentage() * 100;
    const status = percent >= 100 ? "❌ EXCEEDED" : percent >= 90 ? "🟠 CRITICAL" : percent >= 75 ? "🟡 WARNING" : "🟢 OK";

    console.log(`YouTube API Quota: ${status} - ${this.dailyCount}/${QUOTA_LIMIT} (${percent.toFixed(1)}%)`);
  },
};

// Initialize usage tracking when module loads
usage.init().catch(console.error);

// Export the usage and rateLimit objects
export { usage, rateLimit };
