import { describe, it, expect } from 'vitest';
import en from '../../messages/en.json';
import da from '../../messages/da.json';

type Messages = Record<string, Record<string, Record<string, string>>>;

describe('i18n message keys — shop namespace', () => {
  describe('English messages', () => {
    it('has shop.saleStatus.available', () => {
      expect((en as unknown as Messages).shop?.saleStatus?.available).toBeDefined();
    });
    it('has shop.saleStatus.sold', () => {
      expect((en as unknown as Messages).shop?.saleStatus?.sold).toBeDefined();
    });
    it('has shop.saleStatus.notListed', () => {
      expect((en as unknown as Messages).shop?.saleStatus?.notListed).toBeDefined();
    });
  });

  describe('Danish messages', () => {
    it('has shop.saleStatus.available', () => {
      expect((da as unknown as Messages).shop?.saleStatus?.available).toBeDefined();
    });
    it('has shop.saleStatus.sold', () => {
      expect((da as unknown as Messages).shop?.saleStatus?.sold).toBeDefined();
    });
    it('has shop.saleStatus.notListed', () => {
      expect((da as unknown as Messages).shop?.saleStatus?.notListed).toBeDefined();
    });
  });
});
