class SmartCache {
  #cache = null;
  #maxHistorySize = null;
  constructor() {
    this.#cache = new Map();
    this.#maxHistorySize = 20;
    this.#startCleanup();
  }

  set(key, data, options = {}) {
    const {
      ttl = 5 * 60 * 1000, // 5 minutes par défaut
      dependencies = [], // Clés qui dépendent de cette donnée
      tags = [], // Pour invalidation par tag
    } = options;

    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
      dependencies,
      tags,
    };

    this.#cache.set(key, cacheItem);

    return data;
  }

  // Récupérer avec vérification d'expiration
  get(key) {
    if (!this.#cache.has(key)) return null;

    const item = this.#cache.get(key);

    // Vérifier expiration
    if (Date.now() - item.timestamp > item.ttl) {
      this.#cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Nettoyage automatique
  #startCleanup(interval = 60000) {
    this.cleanupInterval = setInterval(() => {
      this.#cleanup();
    }, interval);
  }

  #cleanup() {
    const now = Date.now();
    for (const [key, item] of this.#cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.#cache.delete(key);
      }
    }
  }

  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Instance singleton
const cacheInstance = new SmartCache();
export default cacheInstance;
