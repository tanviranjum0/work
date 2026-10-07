import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { WifiOff } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";
import ServerWakeBanner from "./components/ServerWakeBanner";
import { ErrorBoundary, FullScreenLoader, useToast } from "./components/ui";
import { useOnlineStatus, useViewportHeight } from "./hooks/useViewport";
import { ROLES } from "./utils/roles";

// Every screen is its own chunk, so the first paint only downloads what that page needs.
// The two map screens are the heaviest (Google Maps loads lazily inside them).
const Landing = lazy(() => import("./screens/Landing"));
const Login = lazy(() => import("./screens/auth/Login"));
const Signup = lazy(() => import("./screens/auth/Signup"));
const ForgotPassword = lazy(() => import("./screens/auth/PasswordScreens").then((m) => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("./screens/auth/PasswordScreens").then((m) => ({ default: m.ResetPassword })));
const VerifyEmailLink = lazy(() => import("./screens/auth/PasswordScreens").then((m) => ({ default: m.VerifyEmailLink })));
const UserHome = lazy(() => import("./screens/UserHome"));
const CaptainHome = lazy(() => import("./screens/CaptainHome"));
const Profile = lazy(() => import("./screens/Profile"));
let ridesModule;
const loadRides = () => (ridesModule ||= import("./screens/Rides"));
const RideHistory = lazy(() => loadRides().then((m) => ({ default: m.RideHistory })));
const RideDetail = lazy(() => loadRides().then((m) => ({ default: m.RideDetail })));
const RateRide = lazy(() => loadRides().then((m) => ({ default: m.RateRide })));
const Chat = lazy(() => import("./screens/Chat"));
const Track = lazy(() => import("./screens/Track"));
const NotFound = lazy(() => import("./screens/NotFound"));

const PUBLIC_PREFIXES = ["/login", "/signup", "/captain/login", "/captain/signup", "/track/", "/user/forgot", "/captain/forgot", "/user/reset", "/captain/reset", "/user/verify", "/captain/verify"];

// If the API says the session is truly over (refresh token revoked or expired), send people
// to the right sign-in once, with an explanation, instead of letting each screen fail.
function SessionEndedListener() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    const onEnded = () => {
      const path = location.pathname;
      if (path === "/" || PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))) return;
      const role = localStorage.getItem("lastRole") === "captain" ? "captain" : "user";
      toast.info("You were signed out. Please sign in again.");
      navigate(ROLES[role].login, { replace: true, state: { from: path } });
    };
    window.addEventListener("qr:session-ended", onEnded);
    return () => window.removeEventListener("qr:session-ended", onEnded);
  }, [location.pathname, navigate, toast]);

  return null;
}

function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        zIndex: "var(--z-toast)",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        padding: "calc(6px + var(--safe-top)) 12px 6px",
        background: "var(--ink-900)",
        color: "#fff",
        fontSize: "var(--text-sm)",
        fontWeight: 600,
      }}
    >
      <WifiOff size={15} aria-hidden="true" /> You are offline. We will reconnect automatically.
    </div>
  );
}

function RoleRedirect({ to }) {
  return <Navigate to={to} replace />;
}

const guard = (role, element) => <ProtectedRoute role={role}>{element}</ProtectedRoute>;

export default function App() {
  useViewportHeight();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SessionEndedListener />
        <OfflineBanner />
        <ServerWakeBanner />
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login role="user" />} />
            <Route path="/signup" element={<Signup role="user" />} />
            <Route path="/captain/login" element={<Login role="captain" />} />
            <Route path="/captain/signup" element={<Signup role="captain" />} />

            <Route path="/home" element={guard("user", <UserHome />)} />
            <Route path="/user/edit-profile" element={guard("user", <Profile role="user" />)} />
            <Route path="/user/rides" element={guard("user", <RideHistory role="user" />)} />
            <Route path="/user/rides/:rideId" element={guard("user", <RideDetail role="user" />)} />
            <Route path="/user/rides/:rideId/rate" element={guard("user", <RateRide role="user" />)} />

            <Route path="/captain/home" element={guard("captain", <CaptainHome />)} />
            <Route path="/captain/edit-profile" element={guard("captain", <Profile role="captain" />)} />
            <Route path="/captain/rides" element={guard("captain", <RideHistory role="captain" />)} />
            <Route path="/captain/rides/:rideId" element={guard("captain", <RideDetail role="captain" />)} />
            <Route path="/captain/rides/:rideId/rate" element={guard("captain", <RateRide role="captain" />)} />

            <Route path="/:userType/chat/:rideId" element={<Chat />} />
            <Route path="/:userType/verify-email" element={<VerifyEmailLink />} />
            <Route path="/:userType/forgot-password" element={<ForgotPassword />} />
            <Route path="/:userType/reset-password" element={<ResetPassword />} />
            <Route path="/track/:token" element={<Track />} />

            <Route path="/user" element={<RoleRedirect to="/home" />} />
            <Route path="/captain" element={<RoleRedirect to="/captain/home" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
