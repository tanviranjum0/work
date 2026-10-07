import { Compass } from "lucide-react";
import { Button, EmptyState } from "../components/ui";

export default function NotFound() {
  return (
    <div style={{ display: "grid", minHeight: "var(--app-height)", placeItems: "center", padding: 16 }}>
      <EmptyState
        icon={<Compass size={26} />}
        title="We could not find that page"
        action={<Button auto to="/">Back to QuickRide</Button>}
      >
        The link may be old or mistyped. Let us get you back on the road.
      </EmptyState>
    </div>
  );
}
