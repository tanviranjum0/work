import axios from "axios";
import { socket } from "../contexts/SocketContext";
import Console from "./console";

// Shared client for every authenticated/cross-origin call. withCredentials is required
// even for calls that don't need it yet: app.tanvirdev.site and api.tanvirdev.site are
// different origins, and without it the browser never stores the refresh-token cookie
// the backend sets on login, so refreshAccessToken() below would have nothing to send.
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("messages");
  localStorage.removeItem("rideDetails");
  localStorage.removeItem("panelDetails");
  localStorage.removeItem("showPanel");
  localStorage.removeItem("showBtn");
  socket.disconnect();
}

// A token-expiry 401 is routine (access tokens last 15 minutes) and would otherwise hit
// every screen's own catch block; de-duped so concurrent 401s share one refresh call.
let refreshPromise = null;
function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${import.meta.env.VITE_SERVER_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        socket.connect();
        return response.data.token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Only codes where the access token itself is the problem — NO_TOKEN/INVALID_TOKEN mean
// there was never a usable token to refresh, so retrying would just fail the same way.
const REFRESHABLE_CODES = new Set(["TOKEN_EXPIRED", "TOKEN_REVOKED"]);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const code = response?.data?.code;
    if (
      response?.status === 401 &&
      config &&
      !config._retried &&
      !config.url?.includes("/auth/refresh") &&
      REFRESHABLE_CODES.has(code)
    ) {
      config._retried = true;
      try {
        const token = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        return api(config);
      } catch (refreshError) {
        Console.log("Session refresh failed, logging out", refreshError);
        clearSession();
      }
    }
    return Promise.reject(error);
  },
);

// Reads an error the way the backend actually shapes it: {message, details:[{field,message}]}
// from validate.middleware, or a plain {message} from everything else. Falls back safely
// for network failures, where error.response doesn't exist at all.
export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (data?.details?.length) return data.details[0].message;
  if (typeof data?.message === "string") return data.message;
  if (error?.message) return error.message;
  return fallback;
}

export default api;
