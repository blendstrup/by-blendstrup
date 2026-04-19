import { describe, it, expect } from 'vitest';

// Import keystatic config — this validates TypeScript compilation of the schema
import keystaticConfig from '../../keystatic.config';

type KeystaticConfigShape = {
  collections?: Record<string, unknown>;
  singletons?: Record<string, unknown>;
  ui?: Record<string, unknown>;
};

const cfg = keystaticConfig as unknown as KeystaticConfigShape;

describe('Keystatic schema', () => {
  describe('collections', () => {
    it('exports a works collection', () => {
      expect(cfg.collections).toBeDefined();
      expect(cfg.collections).toHaveProperty('works');
    });

    it('exports a categories collection', () => {
      expect(cfg.collections).toHaveProperty('categories');
    });
  });

  describe('singletons', () => {
    it('exports the settings singleton (existing)', () => {
      expect(cfg.singletons).toHaveProperty('settings');
    });

    it('exports a homepage singleton', () => {
      expect(cfg.singletons).toHaveProperty('homepage');
    });
  });

  describe('ui.navigation', () => {
    it('has navigation groupings', () => {
      expect(cfg.ui).toBeDefined();
      expect(cfg.ui?.['navigation']).toBeDefined();
    });
  });
});
