import { describe, it, expect } from 'vitest';
import { object, string, pipe, minLength } from 'valibot';
import { validateWithSchema } from './validation.util';

const TestSchema = object({
  name: pipe(string(), minLength(1)),
});

describe('validateWithSchema', () => {
  it('returns success: true for valid data', () => {
    const result = validateWithSchema(TestSchema, { name: 'João' });
    expect(result.success).toBe(true);
  });

  it('returns output data on success', () => {
    const result = validateWithSchema(TestSchema, { name: 'Maria' });
    expect(result.success && result.output).toEqual({ name: 'Maria' });
  });

  it('returns success: false for invalid data', () => {
    const result = validateWithSchema(TestSchema, { name: '' });
    expect(result.success).toBe(false);
  });

  it('returns issues array on failure', () => {
    const result = validateWithSchema(TestSchema, {});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });

  it('handles null input gracefully (returns failure)', () => {
    const result = validateWithSchema(TestSchema, null);
    expect(result.success).toBe(false);
  });
});
