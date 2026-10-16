import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  readonly requestId: string;
  readonly correlationId: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

export const runWithRequestContext = <T>(ctx: RequestContext, fn: () => T): T => storage.run(ctx, fn);
export const getRequestContext = (): RequestContext | undefined => storage.getStore();
