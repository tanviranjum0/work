/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchLandlord = async () => {
      try {
        const res = await fetch("/api/user/" + listing.userRef, { signal: controller.signal });
        if (!res.ok) throw new Error("Contact details are unavailable.");
        const data = await res.json();
        setLandlord(data);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") setError(fetchError.message || "Contact details are unavailable.");
      }
    };
    fetchLandlord();
    return () => controller.abort();
  }, [listing.userRef]);
  const mailto = landlord
    ? "mailto:" + encodeURIComponent(landlord.email).replace("%40", "@") +
      "?subject=" + encodeURIComponent("Regarding " + listing.name) +
      "&body=" + encodeURIComponent(message)
    : "#";
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            maxLength="1000"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
            aria-label="Message to the property owner"
          ></textarea>

          <a href={mailto} className="button">
            Send Message
          </a>
        </div>
      )}
      {error && <p className="form-message form-error" role="alert">{error}</p>}
    </>
  );
}
