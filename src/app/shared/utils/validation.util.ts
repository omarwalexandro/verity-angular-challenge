import { safeParse } from 'valibot';

/**
 * Generic validation function for schemas
 * @param schema - The valibot schema to validate against
 * @param data - Unknown data to validate
 * @returns SafeParseResult with success status and data
 */
export const validateWithSchema = (schema: any, data: unknown) => {
  return safeParse(schema, data);
};
