import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const Login = () => {
  const { setCurrentUser, setIsAlreadyLoggedIn } = useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to sign in.");
      const user = { userObject: data.userObject, avatar: data.avatar || null };
      setCurrentUser(user);
      setIsAlreadyLoggedIn(true);
      navigate("/");
    } catch (submitError) {
      setError(submitError.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow"><span className="eyebrow-line" /> Welcome back</p>
        <h1 id="login-title">Sign in to FullEstate</h1>
        <p className="auth-intro">Pick up where your next move begins.</p>
        {location.state?.accountCreated && (
          <p className="form-message form-success" role="status">Your account is ready. Sign in to continue.</p>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            maxLength="254"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <p className="form-message form-error" role="alert">{error}</p>}
          <button className="button auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-switch">New to FullEstate? <Link to="/sign-up">Create an account</Link></p>
      </section>
    </main>
  );
};

export default Login;
