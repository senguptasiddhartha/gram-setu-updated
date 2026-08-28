export type UserRole = 'administrator' | 'health_worker' | 'agri_officer' | 'farmer';
export type Language = 'en' | 'as' | 'hi';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type AlertType = 'HEAT' | 'HEALTH' | 'CROP' | 'PESTICIDE' | 'WEATHER' | 'SYNC';
export type AlertStatus = 'New' | 'Acknowledged' | 'Resolved';
export type SyncStatus = 'Pending' | 'Syncing' | 'Synced';

export interface Farmer {
  id: string;
  farmerId: string; // AgriStack format e.g. AGR-AS-2048
  abhaId?: string; // ABDM ABHA format e.g. 91-4820-1928-3019
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  village: string;
  district: string;
  state: string;
  farmSize: number; // acres
  primaryCrop: string;
  cropVariety?: string;
  sowingDate?: string;
  soilType: 'Alluvial' | 'Clay' | 'Sandy Loam' | 'Red Soil' | 'Laterite';
  irrigationType: 'Rainfed' | 'Borewell' | 'Canal' | 'Drip' | 'River Lift';
  
  // Health & Exposure Profile
  dailyOutdoorHours: number;
  recentPesticideExposure: boolean;
  pesticideName?: string;
  pesticideUsageDate?: string;
  symptoms: string[];
  existingHealthConcerns?: string;
  lastHealthScreeningDate?: string;

  // Agricultural Indicators
  cropGrowthStage: 'Germination' | 'Vegetative' | 'Tillering' | 'Flowering' | 'Grain Filling' | 'Maturity' | 'Harvesting';
  soilMoisture: 'Low' | 'Medium' | 'High' | 'Waterlogged';
  
  // Computed Scores
  heatRiskScore: number;
  cropRiskScore: number;
  healthRiskScore: number;
  environmentalRiskScore: number;
  overallRiskScore: number;
  riskCategory: RiskLevel;

  // Sync Metadata
  lastSync: string;
  isOfflineCreated?: boolean;
  syncStatus: SyncStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HealthScreening {
  id: string;
  farmerId: string;
  farmerName: string;
  screeningDate: string;
  healthWorkerName: string;
  village: string;
  
  // Vitals & Symptoms
  bodyTemperature: number; // in Celsius
  systolicBP?: number;
  diastolicBP?: number;
  pulseRate?: number;
  outdoorWorkHours: number;
  waterIntakeLiters: number;
  pesticideExposure: boolean;
  pesticideExposureDetails?: string;

  // Symptom Flags
  dizziness: boolean;
  fatigue: boolean;
  headache: boolean;
  nausea: boolean;
  breathingDifficulty: boolean;
  skinRash: boolean;
  muscleCramps: boolean;
  symptomDuration: string; // e.g. '2 days', 'few hours'

  // Notes (populated via typing or Web Speech voice entry)
  clinicalNotes: string;

  // Computed Risk
  heatStressScore: number;
  pesticideRiskScore: number;
  overallHealthScore: number;
  riskCategory: RiskLevel;
  recommendations: string[];
  referralRequired: boolean;
  referralFacility?: string;

  // Sync
  syncStatus: SyncStatus;
  isOfflineCreated?: boolean;
  createdAt: string;
}

export interface FarmAssessment {
  id: string;
  farmerId: string;
  farmerName: string;
  village: string;
  crop: string;
  cropStage: string;
  assessmentDate: string;
  temperature: number;
  humidity: number;
  rainfallMm: number;
  soilMoisture: 'Low' | 'Medium' | 'High' | 'Waterlogged';
  recentPesticideUse: boolean;
  observedSymptoms: string[];
  
  // Scores
  diseaseRiskScore: number;
  weatherRiskScore: number;
  pestRiskScore: number;
  overallCropRiskScore: number;
  riskCategory: RiskLevel;
  reasoning: string[];
  advisoryText: string;

  syncStatus: SyncStatus;
  createdAt: string;
}

export interface Village {
  id: string;
  name: string;
  district: string;
  state: string;
  population: number;
  registeredFarmers: number;
  healthWorkersCount: number;
  latitude: number;
  longitude: number;
  currentRisk: RiskLevel;
  heatRisk: number;
  agriculturalRisk: number;
  healthRisk: number;
  environmentalRisk: number;
  overallRisk: number;
  agriculturalWorkersExposed: number;
  highRiskIndividuals: number;
  atRiskFarms: number;
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
    rainProbability: number;
    windSpeed: number;
    condition: string;
  };
}

export interface Alert {
  id: string;
  type: AlertType;
  priority: RiskLevel;
  title: string;
  description: string;
  affectedCount: number;
  affectedEntityType: 'workers' | 'farms' | 'households' | 'records';
  location: string;
  villageId?: string;
  timestamp: string;
  recommendedAction: string;
  status: AlertStatus;
  acknowledgedBy?: string;
  resolvedAt?: string;
}

export interface SyncQueueItem {
  id: string;
  recordType: 'Farmer Registration' | 'Health Screening' | 'Farm Assessment' | 'Alert Update' | 'Risk Assessment';
  recordId: string;
  payload: any;
  createdOfflineAt: string;
  status: SyncStatus;
  retryCount: number;
  lastAttempt?: string;
  errorMessage?: string;
}

export interface WeatherData {
  village: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  rainProbability: number;
  windSpeed: number;
  uvIndex: number;
  heatIndex: number;
  airQualityIndex: number;
  timestamp: string;
}

export interface CrossDomainRiskAssessment {
  communityRiskScore: number;
  riskCategory: RiskLevel;
  heatRisk: number;
  cropRisk: number;
  healthRisk: number;
  environmentalRisk: number;
  whyThisMatters: string;
  topFactors: string[];
  recommendations: {
    id: number;
    title: string;
    domain: 'Health' | 'Agriculture' | 'Environmental' | 'Cross-Domain';
    action: string;
    priority: RiskLevel;
  }[];
  affectedPopulationEstimate: number;
  urgency: 'Immediate (0-24h)' | 'High (24-48h)' | 'Moderate (3-5 days)' | 'Advisory';
}
