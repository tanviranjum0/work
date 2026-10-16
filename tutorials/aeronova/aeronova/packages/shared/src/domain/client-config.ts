import type { AppMode } from '../app-mode.js';

/**
 * Public runtime configuration the web app reads from the API at start-up, so
 * one web build works in every environment and never needs rebuilding with
 * deploy-time values. Everything here is safe to show any visitor.
 */
export interface ClientConfig {
  readonly appMode: AppMode;
  readonly features: { readonly booking: boolean };
}
