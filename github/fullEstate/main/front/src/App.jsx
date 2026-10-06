/* eslint-disable react/prop-types */
import { Component, useContext, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import EditListing from "./pages/EditListing";
import ContextContainer from "./context/StoreContext";
import { StoreContext } from "./context/StoreContext";
import "./App.css";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-page">
          <p className="eyebrow">FullEstate</p>
          <h1>That page needs a moment.</h1>
          <p>Refresh to try again, or return to the home page.</p>
          <a className="button" href="/">Back to home</a>
        </main>
      );
    }
    return this.props.children;
  }
}

const RouteEffects = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);
  return null;
};

const AuthRequired = ({ children }) => {
  const { authLoading, isAlreadyLoggedIn } = useContext(StoreContext);
  if (authLoading) {
    return <main className="profile-page"><p className="profile-status">Checking your account...</p></main>;
  }
  if (!isAlreadyLoggedIn) {
    return (
      <main className="profile-page profile-signin">
        <p className="eyebrow"><span className="eyebrow-line" /> Your account</p>
        <h1>Sign in to continue.</h1>
        <Link className="button" to="/login">Go to sign in</Link>
      </main>
    );
  }
  return children;
};

const AppLayout = () => (
  <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Navbar />
    <div id="main-content" className="page-content" tabIndex="-1">
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-listing" element={<AuthRequired><CreateListing /></AuthRequired>} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-listing/:id" element={<AuthRequired><EditListing /></AuthRequired>} />
        <Route path="*" element={<main className="error-page"><p className="eyebrow">404</p><h1>We couldn’t find that page.</h1><a className="button" href="/">Back to home</a></main>} />
      </Routes>
    </div>
    <Footer />
  </div>
);

const App = () => (
  <ContextContainer>
    <BrowserRouter>
      <AppErrorBoundary><AppLayout /></AppErrorBoundary>
    </BrowserRouter>
  </ContextContainer>
);

export default App;
