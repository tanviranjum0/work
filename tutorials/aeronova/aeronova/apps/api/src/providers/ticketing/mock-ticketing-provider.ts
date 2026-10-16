import { randomUUID } from 'node:crypto';
import type { Ticket } from '@aeronova/shared';
import type { IssueTicketRequest, IssueTicketResult, TicketingProvider } from './ticketing-provider.js';

/** Prefix makes a demo ticket number unmistakable, and it is never IATA-shaped. */
export const DEMO_TICKET_PREFIX = 'DEMO-';

/**
 * Simulated ticketing. These records are not airline documents and cannot be
 * used to travel; `simulated: true` travels with every ticket so the UI and any
 * generated document must say so.
 */
export class MockTicketingProvider implements TicketingProvider {
  readonly id = 'mock';
  readonly simulated = true;
  private readonly seen = new Map<string, IssueTicketResult>();

  async issueTickets(request: IssueTicketRequest): Promise<IssueTicketResult> {
    const previous = this.seen.get(request.idempotencyKey);
    if (previous) return previous;

    const failing = request.passengers.some((p) => p.familyName.toLowerCase().includes('noticket'));
    const issuedAt = new Date().toISOString();
    const result: IssueTicketResult = failing
      ? { kind: 'failed', reason: 'simulated ticketing failure' }
      : {
          kind: 'issued',
          tickets: request.passengers.map((p, i): Ticket => ({
            id: randomUUID(),
            passengerId: p.id,
            number: `${DEMO_TICKET_PREFIX}${request.supplierReference}-${String(i + 1).padStart(2, '0')}`,
            state: 'ISSUED',
            issuedAt,
            simulated: true,
          })),
        };
    this.seen.set(request.idempotencyKey, result);
    return result;
  }
}
