import type { BookingPassenger, Ticket } from '@aeronova/shared';

export interface IssueTicketRequest {
  readonly supplierReference: string;
  readonly passengers: readonly BookingPassenger[];
  readonly validatingCarrier: string | null;
  readonly idempotencyKey: string;
}

export type IssueTicketResult =
  | { readonly kind: 'issued'; readonly tickets: readonly Ticket[] }
  | { readonly kind: 'failed'; readonly reason: string };

export interface TicketingProvider {
  readonly id: string;
  /** Simulated tickets are labelled everywhere they appear and are not valid for travel. */
  readonly simulated: boolean;
  issueTickets(request: IssueTicketRequest): Promise<IssueTicketResult>;
}
