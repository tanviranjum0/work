import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { useDebouncedValue } from "./useViewport";

const cache = new Map();

/**
 * Address autocomplete with debounce, cancellation of stale requests, and a small cache so
 * retyping the same text does not hit the (billed) Places API again.
 */
export default function usePlaceSuggestions(query, { enabled = true, minLength = 3, visitor = false } = {}) {
  const text = useDebouncedValue(query.trim(), 380);
  const [state, setState] = useState({ items: [], loading: false, error: "" });
  const latest = useRef(0);

  useEffect(() => {
    if (!enabled || text.length < minLength) {
      setState({ items: [], loading: false, error: "" });
      return undefined;
    }
    const key = `${visitor ? "v" : "u"}:${text.toLowerCase()}`;
    if (cache.has(key)) {
      setState({ items: cache.get(key), loading: false, error: "" });
      return undefined;
    }
    const id = ++latest.current;
    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true, error: "" }));
    api
      .get(visitor ? "/map/get-visitor-suggestions" : "/map/get-suggestions", {
        params: { input: text },
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (id !== latest.current) return;
        cache.set(key, data);
        setState({ items: data, loading: false, error: "" });
      })
      .catch((error) => {
        if (id !== latest.current || error.name === "CanceledError") return;
        setState({ items: [], loading: false, error: error.userMessage || "Suggestions are unavailable." });
      });
    return () => controller.abort();
  }, [text, enabled, minLength, visitor]);

  const clear = () => setState({ items: [], loading: false, error: "" });
  return { ...state, clear, pending: query.trim() !== text };
}
