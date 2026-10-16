import { randomUUID } from 'node:crypto';
import type { AuditEvent } from '@aeronova/shared';
import type { AuditRepository } from './audit-types.js';

/** Bounded so a long-running demo process can't grow this without limit. */
const MAX_EVENTS = 2_000;

export class InMemoryAuditRepository implements AuditRepository {
  private readonly events: AuditEvent[] = [];

  async record(event: Omit<AuditEvent, 'id'>): Promise<void> {
    this.events.push({ id: randomUUID(), ...event });
    if (this.events.length > MAX_EVENTS) this.events.splice(0, this.events.length - MAX_EVENTS);
  }

  async list(opts: { limit: number; type?: AuditEvent['type'] }): Promise<AuditEvent[]> {
    const matching = opts.type ? this.events.filter((e) => e.type === opts.type) : this.events;
    return [...matching].reverse().slice(0, opts.limit);
  }
}
