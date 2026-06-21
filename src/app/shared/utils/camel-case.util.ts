/**
 * Type helper to transform keys from snake_case to camelCase
 */
type CamelCaseKeys<T> = {
  [K in keyof T as K extends string ? (K extends `${infer First}_${infer Rest}` ? `${First}${Capitalize<Rest>}` : K) : K]: T[K];
};

/**
 * Type helper to transform keys from camelCase to snake_case
 */
type SnakeCaseKeys<T> = {
  [K in keyof T as K extends string ? (K extends `${infer First}${infer Rest}` ? Rest extends Capitalize<infer R> ? `${First}_${Lowercase<R>}` : K : K) : K]: T[K];
};

type CaseConversion = 'camel' | 'snake';

/**
 * Converts a snake_case string to camelCase
 * @param str - The snake_case string to convert
 * @returns The camelCase string
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Converts a camelCase string to snake_case
 * @param str - The camelCase string to convert
 * @returns The snake_case string
 */
export const toSnakeCase = (str: string): string => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

/**
 * Generic function to convert object keys between snake_case and camelCase
 * @param obj - The object to convert
 * @param conversion - The type of conversion ('camel' or 'snake')
 * @returns A new object with converted keys (recursively for nested objects)
 */
export const convertCase = <T extends Record<string, unknown>>(
  obj: T,
  conversion: CaseConversion
): CamelCaseKeys<T> | SnakeCaseKeys<T> => {
  const result = {} as Record<string, unknown>;
  const convertFn = conversion === 'camel' ? toCamelCase : toSnakeCase;
  const shouldConvert = conversion === 'camel' 
    ? (key: string) => key.includes('_')
    : (key: string) => /[A-Z]/.test(key);
  
  const recursiveConvert = (value: unknown): unknown => {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return convertCase(value as Record<string, unknown>, conversion);
    }
    return value;
  };

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const convertedKey = shouldConvert(key) ? convertFn(key) : key;
      result[convertedKey] = recursiveConvert(obj[key]);
    }
  }
  return result as CamelCaseKeys<T> | SnakeCaseKeys<T>;
};

/**
 * Transforms a model (camelCase) to DTO (snake_case)
 * @param model - The model to send to API
 * @returns The transformed DTO
 */
export const transformModelToDto = <T extends Record<string, unknown>>(model: T) => {
  return convertCase(model, 'snake') as SnakeCaseKeys<T>;
};
