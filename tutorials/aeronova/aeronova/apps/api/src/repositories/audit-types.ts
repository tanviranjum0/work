import type { AuditEvent } from '@aeronova/shared';

export interface AuditRepository {
  /** Fire-and-forget from the caller's point of view: recording an event must never fail a request. */
  record(event: Omit<AuditEvent, 'id'>): Promise<void>;
  /** Newest first. `type` narrows to one kind of event; omit for everything. */
  list(opts: { limit: number; type?: AuditEvent['type'] }): Promise<AuditEvent[]>;
}
