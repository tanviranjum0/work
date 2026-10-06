import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaRegTrashAlt, FaSignOutAlt } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import heroHome from "../assets/re/re7-optimized.jpg";
import { optimizeCloudinaryImage } from "../lib/cloudinary";

const Profile = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    authLoading,
    setCurrentUser,
    setIsAlreadyLoggedIn,
    userListings,
    setUserListings,
  } = useContext(StoreContext);
  const [more, setMore] = useState(false);
  const [loadingListings, setLoadingListings] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const userId = currentUser?.userObject?.id;

  useEffect(() => {
    if (!userId) return undefined;
    const controller = new AbortController();
    const loadListings = async () => {
      setLoadingListings(true);
      setError("");
      try {
        const response = await fetch("/api/listing/user-listings/" + userId, {
          credentials: "include",
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load your listings.");
        setMore(data.length === 10);
        setUserListings({ data, progress: data.length });
      } catch (loadError) {
        if (loadError.name !== "AbortError") setError(loadError.message || "Unable to load your listings.");
      } finally {
        if (!controller.signal.aborted) setLoadingListings(false);
      }
    };
    loadListings();
    return () => controller.abort();
  }, [userId, setUserListings]);

  const loadMore = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(
        "/api/listing/user-listings/" + userId + "?startIndex=" + userListings.progress,
        { credentials: "include" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load more listings.");
      setMore(data.length === 10);
      setUserListings((previous) => ({
        data: [...previous.data, ...data],
        progress: previous.progress + data.length,
      }));
    } catch (loadError) {
      setError(loadError.message || "Unable to load more listings.");
    } finally {
      setActionLoading(false);
    }
  };

  const performAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    setError("");
    try {
      if (confirmAction.type === "logout") {
        const response = await fetch("/api/auth/signout", {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Unable to sign out right now.");
        setCurrentUser(null);
        setIsAlreadyLoggedIn(false);
        navigate("/");
        return;
      }

      const url = confirmAction.type === "account"
        ? "/api/user/delete/" + userId
        : "/api/listing/delete/" + confirmAction.id;
      const response = await fetch(url, {
        method: confirmAction.type === "account" || confirmAction.type === "listing" ? "DELETE" : "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to complete that action.");
      if (confirmAction.type === "account") {
        setCurrentUser(null);
        setIsAlreadyLoggedIn(false);
        navigate("/");
      } else {
        setUserListings((previous) => ({
          data: previous.data.filter((listing) => listing._id !== confirmAction.id),
          progress: Math.max(0, previous.progress - 1),
        }));
        setConfirmAction(null);
      }
    } catch (actionError) {
      setError(actionError.message || "Unable to complete that action.");
      setConfirmAction(null);
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading) {
    return <main className="profile-page"><p className="profile-status">Checking your account…</p></main>;
  }
  if (!currentUser || !userId) {
    return (
      <main className="profile-page profile-signin">
        <p className="eyebrow"><span className="eyebrow-line" /> Your account</p>
        <h1>Sign in to view your profile.</h1>
        <Link className="button" to="/login">Go to sign in <FaArrowRight aria-hidden="true" /></Link>
      </main>
    );
  }

  const requestedActionLabel = confirmAction?.type === "logout"
    ? "sign out"
    : confirmAction?.type === "account"
      ? "delete your account and listings"
      : "delete this listing";

  return (
    <main className="profile-page">
      {confirmAction && (
        <div className="profile-modal-backdrop">
          <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <p className="eyebrow"><span className="eyebrow-line" /> Please confirm</p>
            <h2 id="confirm-title">Are you sure you want to {requestedActionLabel}?</h2>
            <p>This action will take effect immediately.</p>
            <div className="profile-modal-actions">
              <button type="button" className="profile-secondary-button" onClick={() => setConfirmAction(null)} disabled={actionLoading}>Cancel</button>
              <button type="button" className="profile-danger-button" onClick={performAction} disabled={actionLoading}>
                {actionLoading ? "Please wait…" : "Confirm"}
              </button>
            </div>
          </section>
        </div>
      )}

      <p className="eyebrow"><span className="eyebrow-line" /> Your account</p>
      <div className="profile-header">
        <div className="profile-avatar">
          {currentUser.avatar?.secure_url
          ? <img src={optimizeCloudinaryImage(currentUser.avatar.secure_url, 128)} alt="" />
            : <span aria-hidden="true">{currentUser.userObject.name?.slice(0, 1) || "U"}</span>}
        </div>
        <div className="profile-identity">
          <h1>Welcome, {currentUser.userObject.name}</h1>
          <p>{currentUser.userObject.email}</p>
        </div>
        <div className="profile-actions">
          <button type="button" className="profile-secondary-button" onClick={() => setConfirmAction({ type: "logout" })}>
            <FaSignOutAlt aria-hidden="true" /> Sign out
          </button>
          <button type="button" className="profile-danger-button" onClick={() => setConfirmAction({ type: "account" })}>
            <FaRegTrashAlt aria-hidden="true" /> Delete account
          </button>
        </div>
      </div>

      <div className="profile-list-heading">
        <div><p className="eyebrow"><span className="eyebrow-line" /> Your properties</p><h2>Your listings</h2></div>
        <Link to="/create-listing" className="button">Add a listing <FaArrowRight aria-hidden="true" /></Link>
      </div>
      {error && <p className="form-message form-error" role="alert">{error}</p>}
      {loadingListings ? (
        <p className="profile-status">Loading your listings…</p>
      ) : userListings.data.length ? (
        <div className="profile-list">
          {userListings.data.map((listing) => (
            <article className="profile-listing" key={listing._id}>
              <img src={optimizeCloudinaryImage(listing.imageUrls?.[0]?.secure_url || heroHome, 720)} alt="" loading="lazy" />
              <div className="profile-listing-details">
                <p className="profile-listing-type">{listing.type === "rent" ? "For rent" : "For sale"}</p>
                <h3><Link to={"/listing/" + listing._id}>{listing.name}</Link></h3>
                <p>{listing.address}</p>
                <small>Updated {new Date(listing.updatedAt).toLocaleDateString()}</small>
              </div>
              <div className="profile-listing-actions">
                <Link to={"/edit-listing/" + listing._id} state={{ listing }} className="profile-secondary-button">Edit</Link>
                <button type="button" className="profile-icon-button" aria-label={"Delete " + listing.name} onClick={() => setConfirmAction({ type: "listing", id: listing._id })}>
                  <FaRegTrashAlt aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="profile-empty">
          <span className="empty-mark" aria-hidden="true">⌂</span>
          <div><h3>Your next listing can start here.</h3><p>You haven’t shared a property yet.</p></div>
          <Link className="text-link" to="/create-listing">Create a listing <FaArrowRight aria-hidden="true" /></Link>
        </div>
      )}
      {more && (
        <div className="profile-more">
          <button type="button" className="profile-secondary-button" onClick={loadMore} disabled={actionLoading}>
            {actionLoading ? "Loading…" : "Show more"}
          </button>
        </div>
      )}
    </main>
  );
};

export default Profile;
