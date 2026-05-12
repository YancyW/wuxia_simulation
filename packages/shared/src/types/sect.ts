export interface Sect {
  id: string;
  name: string;
  description: string;
  conditionHonorMin?: number;
  conditionHonorMax?: number;
  conditionWitsMin?: number;
  conditionTechniqueMin?: number;
  conditionGender?: 'male' | 'female';
  exclusiveArts: string[];
}
