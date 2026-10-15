import { describe, expect, it } from 'vitest';
import { limitsFor } from './PassengerPicker';

describe('passenger limits', () => {
  it('never allows more infants than adults or more than nine travellers', () => {
    expect(limitsFor({ adults: 1, children: 0, infants: 1 }, 'infants').max).toBe(1);
    expect(limitsFor({ adults: 2, children: 0, infants: 2 }, 'adults').min).toBe(2);
    expect(limitsFor({ adults: 5, children: 4, infants: 0 }, 'children').max).toBe(4);
    expect(limitsFor({ adults: 5, children: 4, infants: 0 }, 'infants').max).toBe(0);
    expect(limitsFor({ adults: 1, children: 0, infants: 0 }, 'adults')).toEqual({ min: 1, max: 9 });
  });
});
