import { describe, expect, it } from 'vitest';
import { InMemoryAuditRepository } from './in-memory-audit.js';

const event = (overrides: Partial<Parameters<InMemoryAuditRepository['record']>[0]> = {}) => ({
  type: 'LOGIN_SUCCEEDED' as const,
  at: new Date().toISOString(),
  actorUserId: 'u1',
  actorEmail: 'a@example.com',
  requestId: 'req-1',
  context: {},
  ...overrides,
});

describe('InMemoryAuditRepository', () => {
  it('lists newest first', async () => {
    const repo = new InMemoryAuditRepository();
    await repo.record(event({ context: { order: '1' } }));
    await repo.record(event({ context: { order: '2' } }));
    await repo.record(event({ context: { order: '3' } }));
    const list = await repo.list({ limit: 10 });
    expect(list.map((e) => e.context.order)).toEqual(['3', '2', '1']);
    expect(list.every((e) => typeof e.id === 'string' && e.id.length > 0)).toBe(true);
  });

  it('respects the limit and filters by type', async () => {
    const repo = new InMemoryAuditRepository();
    await repo.record(event({ type: 'LOGIN_FAILED', actorUserId: null }));
    await repo.record(event({ type: 'LOGIN_SUCCEEDED' }));
    await repo.record(event({ type: 'BOOKING_CREATED' }));
    expect(await repo.list({ limit: 2 })).toHaveLength(2);
    const failed = await repo.list({ limit: 10, type: 'LOGIN_FAILED' });
    expect(failed).toHaveLength(1);
    expect(failed[0]?.actorUserId).toBeNull();
  });

  it('caps stored events so a long-running process cannot grow this without bound', async () => {
    const repo = new InMemoryAuditRepository();
    for (let i = 0; i < 2_005; i++) await repo.record(event({ context: { i: String(i) } }));
    const list = await repo.list({ limit: 5 });
    // The newest 5 of 2005 events survive; the oldest were evicted.
    expect(list.map((e) => e.context.i)).toEqual(['2004', '2003', '2002', '2001', '2000']);
  });
});
