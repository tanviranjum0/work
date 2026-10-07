import { Component } from "react";
import { RefreshCcw, TriangleAlert } from "lucide-react";
import Button from "./Button";
import { EmptyState } from "./Feedback";

// Chunk-load failures after a deploy ("Failed to fetch dynamically imported module") are fixed
// by a reload, so the fallback offers one rather than leaving a blank screen.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const chunkError = /dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
      String(this.state.error?.message),
    );
    return (
      <div style={{ minHeight: "var(--app-height)", display: "grid", placeItems: "center", padding: 16 }}>
        <EmptyState
          icon={<TriangleAlert size={26} />}
          title={chunkError ? "A new version is available" : "Something went wrong"}
          action={
            <Button auto icon={<RefreshCcw size={17} />} onClick={() => window.location.reload()}>
              Reload QuickRide
            </Button>
          }
        >
          {chunkError
            ? "QuickRide was just updated. Reload to get the latest version."
            : "We hit an unexpected problem. Reloading usually fixes it, and your trip is safe."}
        </EmptyState>
      </div>
    );
  }
}
