import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Send } from "lucide-react";
import api, { getApiErrorMessage } from "../utils/api";
import { ROLES } from "../utils/roles";
import { SocketDataContext } from "../contexts/SocketContext";
import { Avatar, Banner, Button, EmptyState, FullScreenLoader, fullNameOf } from "../components/ui";
import "./Chat.css";
import "../components/ride/ride.css";

const QUICK = {
  user: ["I am here", "I am at the pickup point", "Please wait 2 minutes", "Thank you"],
  captain: ["I am on my way", "I have arrived", "I am at the pickup point", "Running a few minutes late"],
};

const timeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function Chat() {
  const { rideId, userType } = useParams();
  const role = ROLES[userType] ? userType : "user";
  const navigate = useNavigate();
  const { socket } = useContext(SocketDataContext);
  const listRef = useRef(null);
  const [state, setState] = useState({ status: "loading", other: null, error: "" });
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/ride/chat-details/${rideId}`)
      .then(({ data }) => {
        if (cancelled) return;
        setMessages(data.messages || []);
        setState({ status: "ready", other: role === "user" ? data.captain : data.user, error: "" });
        socket.emit("join-room", rideId);
      })
      .catch((error) => {
        if (!cancelled) setState({ status: "error", other: null, error: getApiErrorMessage(error, "This conversation is not available.") });
      });
    return () => {
      cancelled = true;
    };
  }, [rideId, role, socket]);

  useEffect(() => {
    const onMessage = ({ msg, by, time }) => setMessages((current) => [...current, { msg, by, time }]);
    socket.on("receiveMessage", onMessage);
    return () => socket.off("receiveMessage", onMessage);
  }, [socket]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text) => {
    const msg = text.trim();
    if (!msg) return;
    if (!socket.connected) socket.connect();
    socket.emit("message", { rideId, msg });
    setMessages((current) => [...current, { msg, by: role, time: timeNow() }]);
    setDraft("");
  };

  if (state.status === "loading") return <FullScreenLoader label="Opening chat" />;
  if (state.status === "error") {
    return (
      <div style={{ display: "grid", minHeight: "var(--app-height)", placeItems: "center", padding: 16 }}>
        <EmptyState title="Chat unavailable" action={<Button auto onClick={() => navigate(-1)}>Go back</Button>}>
          {state.error}
        </EmptyState>
      </div>
    );
  }

  const { other } = state;
  return (
    <div className="chat">
      <header className="chat-head">
        <button type="button" className="qr-back" onClick={() => navigate(-1)} aria-label="Back to trip">
          <ArrowLeft size={20} />
        </button>
        <Avatar fullname={other?.fullname} size="sm" />
        <div className="chat-who">
          <strong>{fullNameOf(other?.fullname) || (role === "user" ? "Your driver" : "Your rider")}</strong>
          <span>{role === "user" ? "Driver" : "Rider"}</span>
        </div>
        {other?.phone && (
          <a className="qr-back" href={`tel:${other.phone}`} aria-label="Call">
            <Phone size={18} color="var(--brand-600)" />
          </a>
        )}
      </header>

      <div className="chat-list" ref={listRef} role="log" aria-live="polite" aria-label="Messages">
        {messages.length === 0 && (
          <Banner tone="info">Messages in this chat are only visible to you and your {role === "user" ? "driver" : "rider"}.</Banner>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.by === role ? "is-mine" : ""}`}>
            {message.msg}
            <time>{message.time}</time>
          </div>
        ))}
      </div>

      <div className="chat-compose">
        <div className="chip-row" style={{ margin: 0, padding: 0 }}>
          {QUICK[role].map((text) => (
            <button key={text} type="button" className="qr-chip" onClick={() => send(text)}>
              {text}
            </button>
          ))}
        </div>
        <form
          className="chat-form"
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
        >
          <input
            className="qr-input"
            aria-label="Message"
            placeholder="Write a message"
            value={draft}
            maxLength={1000}
            autoComplete="off"
            onChange={(event) => setDraft(event.target.value)}
          />
          <Button type="submit" iconOnly auto aria-label="Send" disabled={!draft.trim()}>
            <Send size={19} />
          </Button>
        </form>
      </div>
    </div>
  );
}
