import { randomUUID } from 'node:crypto';
import type { AuditEvent } from '@aeronova/shared';
import type { AuditRepository } from '../audit-types.js';
import { AuditEventModel, type AuditEventDocument } from './models.js';

const toEvent = (d: AuditEventDocument): AuditEvent => ({
  id: d._id,
  type: d.type as AuditEvent['type'],
  at: d.at.toISOString(),
  actorUserId: d.actorUserId,
  actorEmail: d.actorEmail,
  requestId: d.requestId,
  context: d.context instanceof Map ? Object.fromEntries(d.context) : (d.context ?? {}),
});

export class MongoAuditRepository implements AuditRepository {
  async record(event: Omit<AuditEvent, 'id'>): Promise<void> {
    await AuditEventModel.create({ _id: randomUUID(), ...event, at: new Date(event.at) });
  }

  async list(opts: { limit: number; type?: AuditEvent['type'] }): Promise<AuditEvent[]> {
    const docs = await AuditEventModel.find(opts.type ? { type: opts.type } : {})
      .sort({ at: -1 })
      .limit(opts.limit)
      .lean<AuditEventDocument[]>()
      .exec();
    return docs.map(toEvent);
  }
}
