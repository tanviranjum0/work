import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { Logger } from 'pino';
import { z } from 'zod';
import { ERROR_CODES, type ApiFailure } from '@aeronova/shared';
import { AppError, NotFoundError, ValidationError } from '../errors/app-error.js';

interface BodyParserError {
  type: string;
  status?: number;
}

const isBodyParserError = (err: unknown): err is BodyParserError =>
  typeof err === 'object' &&
  err !== null &&
  'type' in err &&
  typeof (err as BodyParserError).type === 'string';

/** Converts anything thrown into a stable, safe AppError. */
export const toAppError = (err: unknown): AppError => {
  if (err instanceof AppError) return err;
  if (err instanceof z.ZodError) {
    return new ValidationError(err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })));
  }
  if (isBodyParserError(err)) {
    if (err.type === 'entity.too.large') {
      return new AppError(ERROR_CODES.PAYLOAD_TOO_LARGE, 413, 'This request is larger than we accept.');
    }
    if (err.type === 'entity.parse.failed') {
      return new AppError(ERROR_CODES.VALIDATION_ERROR, 400, 'The request body is not valid JSON.');
    }
  }
  return new AppError(
    ERROR_CODES.INTERNAL_ERROR,
    500,
    'Something on our side failed. Try again in a moment.',
    {
      cause: err,
    },
  );
};

export const notFoundHandler = (): RequestHandler => (_req, _res, next) => {
  next(new NotFoundError('This endpoint does not exist.'));
};

export const errorHandler =
  (logger: Logger): ErrorRequestHandler =>
  (err, req, res, next) => {
    if (res.headersSent) {
      next(err);
      return;
    }
    const appError = toAppError(err);
    const logPayload = { code: appError.code, status: appError.httpStatus, context: appError.context };
    if (appError.isServerError) {
      logger.error({ ...logPayload, err: appError.cause ?? appError }, appError.message);
    } else {
      logger.info(logPayload, `request rejected: ${appError.code}`);
    }
    const body: ApiFailure = {
      success: false,
      error: {
        code: appError.code,
        message: appError.publicMessage,
        requestId: req.requestId,
        ...(appError.issues ? { issues: appError.issues } : {}),
      },
    };
    res.status(appError.httpStatus).json(body);
  };
