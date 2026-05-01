
export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
}

export interface ClimateData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface CropRecommendation {
  cropName: string;
  confidence: number;
  description: string;
  suitabilityReason: string;
  growthDurationDays: number;
  expectedProfitability: "High" | "Medium" | "Low";
  marketDemand: string;
  sowingTips: string[];
}

export interface RecommendationResponse {
  recommendations: CropRecommendation[];
  summary: string;
}
