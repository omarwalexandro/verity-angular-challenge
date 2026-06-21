import { describe, it, expect } from 'vitest';
import { toCamelCase, toSnakeCase, convertCase, transformModelToDto } from './camel-case.util';

describe('toCamelCase', () => {
  it('converts snake_case to camelCase', () => {
    expect(toCamelCase('full_name')).toBe('fullName');
  });

  it('converts multi-segment snake_case', () => {
    expect(toCamelCase('birth_date_value')).toBe('birthDateValue');
  });

  it('leaves already-camelCase strings unchanged', () => {
    expect(toCamelCase('fullName')).toBe('fullName');
  });

  it('handles single word', () => {
    expect(toCamelCase('name')).toBe('name');
  });

  it('handles zip_code', () => {
    expect(toCamelCase('zip_code')).toBe('zipCode');
  });
});

describe('toSnakeCase', () => {
  it('converts camelCase to snake_case', () => {
    expect(toSnakeCase('fullName')).toBe('full_name');
  });

  it('converts multi-segment camelCase', () => {
    expect(toSnakeCase('birthDateValue')).toBe('birth_date_value');
  });

  it('leaves already-snake_case strings unchanged', () => {
    expect(toSnakeCase('fullname')).toBe('fullname');
  });

  it('handles zipCode', () => {
    expect(toSnakeCase('zipCode')).toBe('zip_code');
  });
});

describe('convertCase', () => {
  it('converts flat object keys from snake to camel', () => {
    const input = { full_name: 'John', birth_date: '01/01/1990', zip_code: '12345' };
    const result = convertCase(input, 'camel') as any;
    expect(result.fullName).toBe('John');
    expect(result.birthDate).toBe('01/01/1990');
    expect(result.zipCode).toBe('12345');
  });

  it('converts flat object keys from camel to snake', () => {
    const input = { fullName: 'John', birthDate: '01/01/1990' };
    const result = convertCase(input, 'snake') as any;
    expect(result.full_name).toBe('John');
    expect(result.birth_date).toBe('01/01/1990');
  });

  it('recursively converts nested objects', () => {
    const input = { personal_data: { full_name: 'John' } };
    const result = convertCase(input as any, 'camel') as any;
    expect(result.personalData.fullName).toBe('John');
  });

  it('does not mutate the original object', () => {
    const input = { full_name: 'John' };
    convertCase(input, 'camel');
    expect((input as any).fullName).toBeUndefined();
    expect(input.full_name).toBe('John');
  });

  it('preserves non-object values as-is', () => {
    const input = { count: 5 as unknown as string, active: true as unknown as string };
    const result = convertCase(input, 'camel') as any;
    expect(result.count).toBe(5);
    expect(result.active).toBe(true);
  });
});

describe('transformModelToDto', () => {
  it('converts a model with camelCase keys to snake_case', () => {
    const model = { fullName: 'Maria', zipCode: '60000-000' };
    const dto = transformModelToDto(model) as any;
    expect(dto.full_name).toBe('Maria');
    expect(dto.zip_code).toBe('60000-000');
  });
});
