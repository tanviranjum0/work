import mongoose from 'mongoose';
import type { Logger } from 'pino';

/**
 * One connection per API process. The promise itself is cached so concurrent
 * startup requests share a single
 * connection attempt; a failed attempt is dropped so the next request retries.
 */
let connection: Promise<typeof mongoose> | undefined;

export interface MongoOptions {
  readonly uri: string;
  readonly logger: Logger;
  /** Atlas shared tiers allow few connections; API instances scale horizontally. */
  readonly maxPoolSize?: number;
}

export const connectMongo = ({ uri, logger, maxPoolSize = 5 }: MongoOptions): Promise<typeof mongoose> => {
  if (!connection) {
    mongoose.set('strictQuery', true);
    // Schema-level validation is ours; buffering would hide connection problems
    // behind request timeouts instead of failing fast.
    mongoose.set('bufferCommands', false);
    connection = mongoose
      .connect(uri, {
        maxPoolSize,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 5_000,
        socketTimeoutMS: 20_000,
        retryWrites: true,
      })
      .catch((err: unknown) => {
        connection = undefined;
        logger.error({ err }, 'MongoDB connection failed');
        throw err;
      });
  }
  return connection;
};

let ready: Promise<void> | undefined;

/**
 * Connected **and** every model's indexes built. With bufferCommands=false a
 * query before the connection completes throws, and the unique
 * email index is what turns a concurrent duplicate sign-up into a 409 — so it
 * must exist before the first write. Cached; a failure is dropped so the next
 * request retries rather than the instance staying broken.
 */
export const ensureMongoReady = (opts: MongoOptions): Promise<void> => {
  ready ??= (async () => {
    const conn = await connectMongo(opts);
    const all = Object.values(conn.models);
    // Correctness indexes (e.g. unique email) must exist before the first write.
    await Promise.all(all.map((model) => model.init()));
    // Housekeeping indexes (cache TTL cleanup) must not block serving: expiry is also
    // enforced on every read. FerretDB, used for integration tests, has no TTL indexes.
    for (const model of all.filter((m) => m.schema.get('autoIndex') === false)) {
      model.createIndexes().catch((err: unknown) => {
        opts.logger.warn(
          { err, model: model.modelName },
          'housekeeping index not created; expired entries will not be cleaned up automatically',
        );
      });
    }
  })().catch((err: unknown) => {
    ready = undefined;
    throw err;
  });
  return ready;
};

export const mongoHealth = async (): Promise<'ok' | 'failed'> => {
  try {
    if (mongoose.connection.readyState !== 1) return 'failed';
    await mongoose.connection.db?.admin().command({ ping: 1 });
    return 'ok';
  } catch {
    return 'failed';
  }
};

/** Tests and graceful local/server shutdown only. */
export const disconnectMongo = async (): Promise<void> => {
  connection = undefined;
  ready = undefined;
  await mongoose.disconnect();
};
