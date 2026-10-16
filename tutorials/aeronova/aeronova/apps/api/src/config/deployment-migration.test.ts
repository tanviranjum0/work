import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('deployment migration', () => {
  it('removes AWS deployment commands from the active workflow', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../package.json'), 'utf8'),
    );

    expect(packageJson.scripts).not.toHaveProperty('deploy');
    expect(packageJson.scripts).not.toHaveProperty('destroy');
    expect(packageJson.scripts).not.toHaveProperty('infra:synth');
    expect(packageJson.workspaces).toEqual(['packages/*', 'apps/*']);
  });

  it('includes free-tier deployment configuration files', () => {
    const repoRoot = resolve(__dirname, '../../../../');
    expect(existsSync(resolve(repoRoot, 'vercel.json'))).toBe(true);
    expect(existsSync(resolve(repoRoot, 'render.yaml'))).toBe(true);
    expect(existsSync(resolve(repoRoot, 'docs/FREE_DEPLOYMENT_MIGRATION_PLAN.md'))).toBe(true);
    expect(existsSync(resolve(repoRoot, 'docs/FREE_TIER_LIMITATIONS.md'))).toBe(true);
  });
});
