import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uploadImage } from "../lib/cloudinary";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!image) throw new Error("Choose a profile image to continue.");
      if (password.length < 12) throw new Error("Use a password with at least 12 characters.");
      const avatar = await uploadImage(image, "/api/auth/upload-avatar");
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, avatar }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to create the account.");
      navigate("/login", { state: { accountCreated: true } });
    } catch (submitError) {
      setError(submitError.message || "Unable to create the account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="signup-title">
        <p className="eyebrow"><span className="eyebrow-line" /> Make yourself at home</p>
        <h1 id="signup-title">Create your account</h1>
        <p className="auth-intro">Create a profile to manage your property listings.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="signup-username">Your name</label>
          <input
            id="signup-username"
            type="text"
            autoComplete="name"
            minLength="2"
            maxLength="40"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            maxLength="254"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            minLength="12"
            maxLength="72"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="signup-avatar">Profile image</label>
          <input
            id="signup-avatar"
            type="file"
            accept="image/avif,image/jpeg,image/png,image/webp"
            required
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />
          <p className="auth-hint">JPG, PNG, WebP, or AVIF. Maximum size: 2 MB.</p>
          {error && <p className="form-message form-error" role="alert">{error}</p>}
          <button className="button auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
