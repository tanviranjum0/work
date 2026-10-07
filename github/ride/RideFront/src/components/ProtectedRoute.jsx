import { CloudOff, RefreshCcw } from "lucide-react";
import useSession from "../hooks/useSession";
import { useUser } from "../contexts/UserContext";
import { useCaptain } from "../contexts/CaptainContext";
import { Button, EmptyState, FullScreenLoader } from "./ui";
import VerifyEmail from "./VerifyEmail";

/**
 * Gate for signed-in screens. Shows a loader while the account loads, a retry screen if the
 * server is unreachable (without signing anyone out), and email verification when needed.
 */
export default function ProtectedRoute({ role, children }) {
  const { setUser } = useUser();
  const { setCaptain } = useCaptain();
  const { status, account, error, retry } = useSession(role, role === "user" ? setUser : setCaptain);

  if (status === "loading") return <FullScreenLoader label="Signing you in" />;

  if (status === "error") {
    return (
      <div style={{ display: "grid", minHeight: "var(--app-height)", placeItems: "center", padding: 16 }}>
        <EmptyState
          icon={<CloudOff size={26} />}
          title="Can't reach QuickRide"
          action={
            <Button auto icon={<RefreshCcw size={17} />} onClick={retry}>
              Try again
            </Button>
          }
        >
          {error} You are still signed in.
        </EmptyState>
      </div>
    );
  }

  if (account?.emailVerified === false) return <VerifyEmail account={account} role={role} onVerified={retry} />;
  return children;
}
