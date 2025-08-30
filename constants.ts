
import type { ModelConfig } from './types';

export const GENDERS: string[] = ['Female', 'Male', 'Non-binary'];
export const AGES: string[] = ['18-25', '25-35', '35-45', '45+'];
export const ETHNICITIES: string[] = [
  'Caucasian',
  'East Asian',
  'South Asian',
  'Hispanic',
  'Black',
  'Middle Eastern',
  'Mixed Ethnicity'
];
export const SETTINGS: string[] = [
  'Clean studio background (white)',
  'Clean studio background (grey)',
  'Vibrant outdoor city street',
  'Sunny beach setting',
  'Cozy indoor cafe',
  'Modern minimalist home',
  'Lush green park'
];

export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  gender: GENDERS[0],
  age: AGES[1],
  ethnicity: ETHNICITIES[0],
  setting: SETTINGS[0],
  details: 'smiling, looking at camera, professional lighting'
};
