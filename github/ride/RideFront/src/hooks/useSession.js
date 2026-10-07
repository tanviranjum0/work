import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage, getStoredAccount, getToken, saveSession } from "../utils/api";
import { ROLES } from "../utils/roles";

/**
 * Loads the signed-in account for a protected screen.
 *
 *  - A stale access token is refreshed silently by the API client, so reloading the app or
 *    coming back after days away does not ask for a password.
 *  - Only a definitive 401 sends the person to sign in. A sleeping server, a dropped
 *    connection or a 5xx keeps the session and offers "Try again" instead.
 */
export default function useSession(role, onAccount) {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({ status: "loading", account: null, error: "" });
  const onAccountRef = useRef(onAccount);
  onAccountRef.current = onAccount;

  const load = useCallback(async () => {
    const stored = getStoredAccount();
    if (stored?.type && stored.type !== role) {
      // Signed in as the other kind of account: go to that account's home instead.
      navigate(ROLES[stored.type].home, { replace: true });
      return;
    }
    setState((current) => ({ ...current, status: "loading", error: "" }));
    try {
      const { data } = await api.get(ROLES[role].profileEndpoint);
      const account = data[role];
      saveSession({ token: getToken(), type: role, data: account });
      onAccountRef.current?.(account);
      setState({ status: "ready", account, error: "" });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate(ROLES[role].login, { replace: true, state: { from: location.pathname } });
        return;
      }
      setState({ status: "error", account: stored?.data || null, error: getApiErrorMessage(error) });
    }
  }, [role, navigate, location.pathname]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return { ...state, retry: load };
}
