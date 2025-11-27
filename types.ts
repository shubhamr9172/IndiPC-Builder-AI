export enum ComponentType {
  CPU = 'CPU',
  MOTHERBOARD = 'Motherboard',
  RAM = 'RAM',
  GPU = 'Graphics Card',
  STORAGE = 'Storage (SSD/HDD)',
  PSU = 'Power Supply',
  CASE = 'Cabinet',
}

export interface Product {
  name: string;
  price: number;
  features: string;
  rating: number; // 1-5
  reason: string; // Why this fits the build
}

export type BuildState = {
  [key in ComponentType]?: Product;
};

export interface UserPreferences {
  usage: 'Gaming' | 'Productivity' | 'Casual' | 'Programming';
  budgetRange: 'Entry Level (₹30k-50k)' | 'Mid Range (₹50k-100k)' | 'High End (₹100k-200k)' | 'Enthusiast (₹200k+)';
}

export const COMPONENT_ORDER = [
  ComponentType.CPU,
  ComponentType.MOTHERBOARD,
  ComponentType.RAM,
  ComponentType.GPU,
  ComponentType.STORAGE,
  ComponentType.PSU,
  ComponentType.CASE,
];
