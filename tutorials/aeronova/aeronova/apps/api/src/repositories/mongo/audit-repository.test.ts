import { beforeEach, describe, expect, it, vi } from 'vitest';

const create = vi.fn();
const find = vi.fn();
vi.mock('./models.js', () => ({
  AuditEventModel: {
    create: (...args: unknown[]) => create(...args),
    find: (...args: unknown[]) => find(...args),
  },
  UserModel: {},
  TravelerModel: {},
  SavedSearchModel: {},
}));

const { MongoAuditRepository } = await import('./audit-repository.js');

beforeEach(() => {
  create.mockReset();
  find.mockReset();
});

describe('MongoAuditRepository', () => {
  it('inserts an event with a Date built from the ISO timestamp', async () => {
    create.mockResolvedValue({});
    const repo = new MongoAuditRepository();
    await repo.record({
      type: 'BOOKING_CREATED',
      at: '2026-09-20T10:00:00.000Z',
      actorUserId: 'u1',
      actorEmail: 'a@example.com',
      requestId: 'r1',
      context: { reference: 'AB12CD' },
    });
    const call = create.mock.calls[0]?.[0] as { at: Date; type: string };
    expect(call.at).toBeInstanceOf(Date);
    expect(call.at.toISOString()).toBe('2026-09-20T10:00:00.000Z');
    expect(call.type).toBe('BOOKING_CREATED');
  });

  it('maps documents back to AuditEvent, converting a Map-typed context to a plain object', async () => {
    const chain = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn(),
    };
    chain.exec.mockResolvedValue([
      {
        _id: 'e1',
        type: 'LOGIN_FAILED',
        at: new Date('2026-09-20T10:00:00.000Z'),
        actorUserId: null,
        actorEmail: 'attempt@example.com',
        requestId: 'r1',
        context: new Map([['reason', 'bad_password']]),
      },
    ]);
    find.mockReturnValue(chain);
    const repo = new MongoAuditRepository();
    const events = await repo.list({ limit: 5, type: 'LOGIN_FAILED' });
    expect(find).toHaveBeenCalledWith({ type: 'LOGIN_FAILED' });
    expect(chain.sort).toHaveBeenCalledWith({ at: -1 });
    expect(chain.limit).toHaveBeenCalledWith(5);
    expect(events[0]).toMatchObject({
      id: 'e1',
      actorUserId: null,
      actorEmail: 'attempt@example.com',
      context: { reason: 'bad_password' },
    });
  });

  it('queries without a type filter when none is given', async () => {
    const chain = {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    };
    find.mockReturnValue(chain);
    await new MongoAuditRepository().list({ limit: 10 });
    expect(find).toHaveBeenCalledWith({});
  });
});
