import { describe, it, expect } from 'vitest';

// Import keystatic config — this validates TypeScript compilation of the schema
import keystaticConfig from '../../keystatic.config';

describe('Keystatic schema', () => {
  describe('collections', () => {
    it('exports a works collection', () => {
      expect((keystaticConfig as any).collections).toBeDefined();
      expect((keystaticConfig as any).collections).toHaveProperty('works');
    });

    it('exports a categories collection', () => {
      expect((keystaticConfig as any).collections).toHaveProperty('categories');
    });
  });

  describe('singletons', () => {
    it('exports the settings singleton (existing)', () => {
      expect((keystaticConfig as any).singletons).toHaveProperty('settings');
    });

    it('exports a homepage singleton', () => {
      expect((keystaticConfig as any).singletons).toHaveProperty('homepage');
    });
  });

  describe('ui.navigation', () => {
    it('has navigation groupings', () => {
      expect(keystaticConfig.ui).toBeDefined();
      expect((keystaticConfig.ui as Record<string, unknown>).navigation).toBeDefined();
    });
  });
});
