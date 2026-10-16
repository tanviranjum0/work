import type { AuditEvent, AuditEventType } from '@aeronova/shared';
import type { Logger } from 'pino';
import type { AuditRepository } from '../../repositories/audit-types.js';

export interface AuditService {
  /**
   * Records an event. Never throws: a broken audit store must not break the
   * request it's describing. A failure is logged instead, at `error` level
   * so it surfaces in monitoring without taking the request down with it.
   */
  record(
    type: AuditEventType,
    ctx: {
      requestId: string;
      actorUserId?: string | null;
      actorEmail?: string | null;
      context?: Record<string, string>;
    },
  ): void;
  list(opts: { limit: number; type?: AuditEventType }): Promise<AuditEvent[]>;
}

export const createAuditService = (repo: AuditRepository, logger: Logger): AuditService => ({
  record(type, ctx) {
    void repo
      .record({
        type,
        at: new Date().toISOString(),
        actorUserId: ctx.actorUserId ?? null,
        actorEmail: ctx.actorEmail ?? null,
        requestId: ctx.requestId,
        context: ctx.context ?? {},
      })
      .catch((err: unknown) => {
        logger.error({ err, type, requestId: ctx.requestId }, 'failed to record audit event');
      });
  },
  list: (opts) => repo.list(opts),
});
