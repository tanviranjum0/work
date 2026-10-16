import type { Money } from '@aeronova/shared';
import type { PaymentProvider, PaymentRequest, PaymentResult } from './payment-provider.js';

/**
 * Simulated payments. No money moves and no card details are accepted.
 * Deterministic outcomes make the failure paths demonstrable:
 *   holder name containing "decline" -> declined
 *   holder name containing "error"   -> the provider itself fails
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly id = 'mock';
  readonly simulated = true;
  private readonly seen = new Map<string, PaymentResult>();

  async authorize(request: PaymentRequest): Promise<PaymentResult> {
    const previous = this.seen.get(request.idempotencyKey);
    if (previous) return previous;

    const holder = request.holderName.toLowerCase();
    if (holder.includes('error')) throw new Error('simulated payment provider outage');
    const result: PaymentResult = holder.includes('decline')
      ? { kind: 'declined', reason: 'Your card was declined by the issuer.' }
      : { kind: 'authorized', providerReference: `demo_pay_${request.idempotencyKey.slice(0, 12)}` };
    this.seen.set(request.idempotencyKey, result);
    return result;
  }

  async refund(_providerReference: string, _amount: Money): Promise<{ kind: 'refunded' | 'failed' }> {
    return { kind: 'refunded' };
  }
}
