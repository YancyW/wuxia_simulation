export interface Sect {
  id: string;
  name: string;
  description: string;
  type?: 'orthodox' | 'unorthodox' | 'neutral';
  conditionHonorMin?: number;
  conditionHonorMax?: number;
  conditionWitsMin?: number;
  conditionTechniqueMin?: number;
  conditionBoneMin?: number;
  conditionAgilityMin?: number;
  conditionConstitutionMin?: number;
  conditionGender?: 'male' | 'female';
  exclusiveArts: string[];
  allies?: string[];
  enemies?: string[];
}
