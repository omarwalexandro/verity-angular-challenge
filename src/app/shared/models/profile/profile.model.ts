import {
  object,
  string,
  InferInput,
  InferOutput,
  omit,
  regex,
  pipe,
} from 'valibot';
import { emailPattern, cpfPattern, phonePattern } from '@shared/consts/patterns.const';
import { errorMessage } from '@shared/consts/errors.const';

/**
 * DTO Schema for Profile entity (snake_case input from API)
 */
export const ProfileDtoSchema = object({
  id: string(),
  created_at: string(),
  updated_at: string(),
  personal: object({
    fullName: string(),
    birthDate: string(),
    cpf: pipe(string(), regex(cpfPattern, errorMessage.pattern)),
    phone: pipe(string(), regex(phonePattern, errorMessage.pattern)),
    email: pipe(string(), regex(emailPattern, errorMessage.pattern)),
  }),
  residential: object({
    zipCode: string(),
    address: string(),
    district: string(),
    city: string(),
    state: string(),
  }),
  professional: object({
    profession: string(),
    company: string(),
    salary: string(),
  }),
});

/**
 * DTO Schema for creating a Profile (excludes id, created_at, updated_at)
 */
export const CreateProfileDtoSchema = omit(ProfileDtoSchema, ['id', 'created_at', 'updated_at']);

/**
 * DTO Schema for updating a Profile (excludes created_at, updated_at)
 */
export const UpdateProfileDtoSchema = omit(ProfileDtoSchema, ['created_at', 'updated_at']);

/** Schema for Profile Model (excludes audit fields) */
export const ProfileModelSchema = UpdateProfileDtoSchema;

// Types
/** Profile DTO type (snake_case) */
export type ProfileDto = InferInput<typeof ProfileDtoSchema>;
/** Create Profile DTO type (snake_case) */
export type CreateProfileDto = InferInput<typeof CreateProfileDtoSchema>;
/** Update Profile DTO type (snake_case) */
export type UpdateProfileDto = InferInput<typeof UpdateProfileDtoSchema>;
/** Profile Model type (camelCase) */
export type ProfileModel = InferOutput<typeof ProfileModelSchema>;
/** Personal Model type (camelCase) */
export type PersonalModel = ProfileModel['personal'];
/** Residential Model type (camelCase) */
export type ResidentialModel = ProfileModel['residential'];
/** Professional Model type (camelCase) */
export type ProfessionalModel = ProfileModel['professional'];