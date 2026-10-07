import axios from "axios";
import { socket } from "../contexts/SocketContext";
import Console from "./console";

// One shared client. withCredentials is required so the browser stores and sends the
// refresh-token cookie the API sets at sign-in (that cookie is what keeps people signed in
// for 30 days, long after the 15-minute access token has expired).
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  timeout: 25000,
});

/* ------------------------------------------------------------------ session storage */

const SESSION_KEYS = ["token", "userData"];
const RIDE_KEYS = ["messages", "rideDetails", "panelDetails", "showPanel", "showBtn"];

export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export function saveSession({ token, type, data }) {
  if (token) localStorage.setItem("token", token);
  if (type && data) localStorage.setItem("userData", JSON.stringify({ type, data }));
  if (type) localStorage.setItem("lastRole", type); // survives sign-out so we know which sign-in to show
  if (token && !socket.connected) socket.connect();
}

export function getStoredAccount() {
  try {
    return JSON.parse(localStorage.getItem("userData"));
  } catch {
    return null;
  }
}

export function clearSession() {
  [...SESSION_KEYS, ...RIDE_KEYS].forEach((key) => localStorage.removeItem(key));
  socket.disconnect();
}

// Milliseconds until the access token expires (negative when it already has).
function msUntilExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000 - Date.now();
  } catch {
    return -1;
  }
}

/* --------------------------------------------------------------------- token refresh */

const SESSION_ENDED_CODES = new Set([
  "NO_REFRESH_TOKEN",
  "INVALID_REFRESH_TOKEN",
  "ACCOUNT_UNAVAILABLE",
]);
// Codes where the access token is the problem, so asking for a new one can fix the request.
const REFRESHABLE_CODES = new Set(["TOKEN_EXPIRED", "TOKEN_REVOKED", "NO_TOKEN", "INVALID_TOKEN"]);

let refreshPromise = null;

async function requestNewToken() {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/auth/refresh`,
    {},
    { withCredentials: true, timeout: 20000 },
  );
  localStorage.setItem("token", data.token);
  if (!socket.connected) socket.connect();
  return data.token;
}

// Single flight per tab, and a cross-tab lock so two open tabs never rotate the same
// refresh token at once (the API also tolerates a short overlap as a second safety net).
export function refreshAccessToken() {
  if (!refreshPromise) {
    const before = getToken();
    const run = async () => {
      const current = getToken();
      // Another tab already refreshed while we waited for the lock.
      if (current && current !== before && msUntilExpiry(current) > 30_000) return current;
      return requestNewToken();
    };
    refreshPromise = (navigator.locks ? navigator.locks.request("qr-refresh", run) : run()).finally(
      () => {
        refreshPromise = null;
      },
    );
  }
  return refreshPromise;
}

function announceSessionEnded() {
  clearSession();
  window.dispatchEvent(new CustomEvent("qr:session-ended"));
}

// A refresh can fail because the session is truly gone (401) or because the network or a
// sleeping server is unavailable. Only the first should sign the person out.
function sessionIsGone(error) {
  const status = error?.response?.status;
  return status === 401 || (status === 403 && SESSION_ENDED_CODES.has(error.response?.data?.code));
}

/* ----------------------------------------------------------------- request pipeline */

api.interceptors.request.use(async (config) => {
  const isAuthCall = /\/(auth\/refresh|login|register|2fa|forgot|reset)/.test(config.url || "");
  let token = getToken();
  // Refresh a little early so requests do not go out with a token about to lapse.
  if (token && !isAuthCall && msUntilExpiry(token) < 45_000) {
    try {
      token = await refreshAccessToken();
    } catch (error) {
      if (sessionIsGone(error)) {
        announceSessionEnded();
        return Promise.reject(error);
      }
      // Network trouble: try the request with what we have; the response handler decides.
    }
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const RETRY_DELAYS = [600, 1800];
const isTransient = (error) =>
  !error.response || [502, 503, 504].includes(error.response.status) || error.code === "ECONNABORTED";

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (!config) return Promise.reject(decorate(error));

    // 1. Expired / missing access token: refresh once and replay the request.
    if (
      response?.status === 401 &&
      !config._refreshed &&
      !config.url?.includes("/auth/refresh") &&
      REFRESHABLE_CODES.has(response.data?.code)
    ) {
      config._refreshed = true;
      try {
        const token = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        return api(config);
      } catch (refreshError) {
        if (sessionIsGone(refreshError)) {
          Console.log("Session ended", refreshError?.response?.data);
          announceSessionEnded();
        }
        // Otherwise keep the session: the server or network was only briefly unavailable.
        return Promise.reject(decorate(refreshError.response ? refreshError : error));
      }
    }

    // 2. Idempotent reads survive a cold-starting free-tier server and flaky mobile data.
    const method = (config.method || "get").toLowerCase();
    if (method === "get" && isTransient(error)) {
      const attempt = config._retries || 0;
      if (attempt < RETRY_DELAYS.length) {
        config._retries = attempt + 1;
        await sleep(RETRY_DELAYS[attempt]);
        return api(config);
      }
    }

    return Promise.reject(decorate(error));
  },
);

/* ---------------------------------------------------------------------------- errors */

const FRIENDLY = {
  NETWORK: "You seem to be offline. Check your connection and try again.",
  TIMEOUT: "That took too long. Please try again.",
  INTERNAL_ERROR: "Something went wrong on our side. Please try again in a moment.",
  SERVICE_UNAVAILABLE: "We are having trouble reaching our servers. Please try again.",
  RATE_LIMIT_EXCEEDED: "You are doing that a little too fast. Please wait a moment.",
  CSRF_REJECTED: "This request could not be verified. Refresh the page and try again.",
};

// Adds `error.userMessage` / `error.code` so every screen can show something useful
// without knowing the backend's error shapes.
function decorate(error) {
  if (error.userMessage) return error;
  const data = error.response?.data;
  let code = data?.code;
  if (!error.response) code = error.code === "ECONNABORTED" ? "TIMEOUT" : "NETWORK";

  let message;
  if (data?.details?.length) message = data.details[0].message;
  else if (Array.isArray(data) && data[0]?.msg) message = data[0].msg;
  else if (data?.errors?.[0]?.msg) message = data.errors[0].msg;
  else if (typeof data?.message === "string" && (error.response?.status < 500 || code === "MAPS_UNAVAILABLE")) {
    message = data.message;
  } else message = FRIENDLY[code] || FRIENDLY.INTERNAL_ERROR;

  error.code = code || error.code;
  error.userMessage = message;
  error.requestId = data?.requestId;
  const retryAfter = Number(error.response?.headers?.["retry-after"]);
  if (retryAfter) error.retryAfter = retryAfter;
  return error;
}

// Reads an error the way the backend actually shapes it. Safe for network failures too.
export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  return decorate(error).userMessage || fallback;
}

export default api;
