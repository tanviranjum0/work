/** Public, non-secret runtime configuration. Anything here ships to every visitor. */
export const clientConfig = Object.freeze({
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, ''),
  requestTimeoutMs: 20_000,
});
