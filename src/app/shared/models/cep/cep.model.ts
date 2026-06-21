import { object, string, optional, boolean, literal, union, InferOutput } from 'valibot';

export const CepDtoSchema = object({
  cep: string(),
  logradouro: string(),
  complemento: string(),
  bairro: string(),
  localidade: string(),
  uf: string(),
  erro: optional(union([boolean(), literal('true')])),
});
export type CepModel = InferOutput<typeof CepDtoSchema>;
