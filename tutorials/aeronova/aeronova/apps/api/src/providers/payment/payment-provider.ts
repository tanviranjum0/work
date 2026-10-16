import type { Money } from '@aeronova/shared';

export interface PaymentRequest {
  readonly amount: Money;
  readonly reference: string;
  /** Repeat calls with the same key must not take money twice. */
  readonly idempotencyKey: string;
  readonly holderName: string;
}

export type PaymentResult =
  | { readonly kind: 'authorized'; readonly providerReference: string }
  | { readonly kind: 'declined'; readonly reason: string };

/**
 * Card data never reaches this API: a real provider (Stripe or similar) would
 * receive a token created in the browser, and PCI scope stays with them.
 */
export interface PaymentProvider {
  readonly id: string;
  readonly simulated: boolean;
  authorize(request: PaymentRequest): Promise<PaymentResult>;
  refund(providerReference: string, amount: Money): Promise<{ kind: 'refunded' | 'failed' }>;
}
