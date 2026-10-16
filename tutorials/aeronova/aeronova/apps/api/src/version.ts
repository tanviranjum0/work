// Injected at deploy time (e.g. git SHA). Never derived from package.json at runtime.
export const APP_VERSION = process.env.APP_VERSION ?? 'dev';
