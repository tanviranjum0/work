/**
 * A durable, admin-visible record of security- and business-relevant events.
 * Distinct from structured application logs: logs are for operational
 * debugging and expire; audit events are for "who did what, when" and are
 * meant to be browsed by an admin. Never carries a password, token, full
 * payment detail or passport number — see AUDIT_CONTEXT_DENYLIST below and
 * docs/SECURITY.md.
 */
export const AUDIT_EVENT_TYPES = [
  'USER_REGISTERED',
  'LOGIN_SUCCEEDED',
  'LOGIN_FAILED',
  'BOOKING_CREATED',
  'BOOKING_CANCELLED',
] as const;
export type AuditEventType = (typeof AUDIT_EVENT_TYPES)[number];

export interface AuditEvent {
  readonly id: string;
  readonly type: AuditEventType;
  readonly at: string;
  /** Null for events with no resolved account, e.g. a failed sign-in for an unknown email. */
  readonly actorUserId: string | null;
  /** The email involved, when there is one — including a failed attempt's, which is legitimate
   *  audit content (it's what lets an admin notice repeated attempts against one address). */
  readonly actorEmail: string | null;
  readonly requestId: string;
  /** Small and deliberately shaped per event type — never free-form request/response bodies. */
  readonly context: Readonly<Record<string, string>>;
}

/** Keys that must never appear in `context`, checked in tests as a guard against accidental additions. */
export const AUDIT_CONTEXT_DENYLIST = [
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'cardNumber',
  'cvc',
  'passportNumber',
] as const;
