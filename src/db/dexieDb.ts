import Dexie, { Table } from 'dexie';
import {
  Farmer,
  HealthScreening,
  FarmAssessment,
  Alert,
  SyncQueueItem,
  Village,
} from '../types';

export class RuralPulseDatabase extends Dexie {
  farmers!: Table<Farmer, string>;
  healthScreenings!: Table<HealthScreening, string>;
  farms!: Table<FarmAssessment, string>;
  alerts!: Table<Alert, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  villages!: Table<Village, string>;
  settings!: Table<{ key: string; value: any }, string>;

  constructor() {
    super('Gram SetuDB');

    this.version(1).stores({
      farmers:
        'id, farmerId, abhaId, name, village, primaryCrop, riskCategory, syncStatus, updatedAt',
      healthScreenings:
        'id, farmerId, farmerName, village, healthWorkerName, riskCategory, syncStatus, screeningDate',
      farms:
        'id, farmerId, village, crop, riskCategory, syncStatus, assessmentDate',
      alerts:
        'id, type, priority, location, status, timestamp',
      syncQueue:
        'id, recordType, recordId, status, createdOfflineAt',
      villages:
        'id, name, district, currentRisk',
      settings:
        'key',
    });
  }
}

export const db = new RuralPulseDatabase();

// Initial Seed Data
export const initialVillages: Village[] = [
  {
    id: 'vil-borigaon',
    name: 'Borigaon',
    district: 'Morigaon',
    state: 'Assam',
    population: 4280,
    registeredFarmers: 1284,
    healthWorkersCount: 38,
    latitude: 26.2514,
    longitude: 92.3482,
    currentRisk: 'HIGH',
    heatRisk: 82,
    agriculturalRisk: 71,
    healthRisk: 68,
    environmentalRisk: 44,
    overallRisk: 78,
    agriculturalWorkersExposed: 142,
    highRiskIndividuals: 23,
    atRiskFarms: 67,
    weather: {
      temperature: 39,
      humidity: 78,
      rainfall: 12,
      rainProbability: 20,
      windSpeed: 9,
      condition: 'Extreme Heat & High Humidity',
    },
  },
  {
    id: 'vil-sonapur',
    name: 'Sonapur',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    population: 3150,
    registeredFarmers: 890,
    healthWorkersCount: 24,
    latitude: 26.1186,
    longitude: 91.9798,
    currentRisk: 'MODERATE',
    heatRisk: 54,
    agriculturalRisk: 48,
    healthRisk: 42,
    environmentalRisk: 30,
    overallRisk: 47,
    agriculturalWorkersExposed: 65,
    highRiskIndividuals: 8,
    atRiskFarms: 28,
    weather: {
      temperature: 33,
      humidity: 65,
      rainfall: 0,
      rainProbability: 10,
      windSpeed: 12,
      condition: 'Partly Cloudy',
    },
  },
  {
    id: 'vil-dakhin',
    name: 'Dakhin Gaon',
    district: 'Nagaon',
    state: 'Assam',
    population: 2840,
    registeredFarmers: 740,
    healthWorkersCount: 19,
    latitude: 26.3452,
    longitude: 92.6841,
    currentRisk: 'LOW',
    heatRisk: 28,
    agriculturalRisk: 25,
    healthRisk: 22,
    environmentalRisk: 18,
    overallRisk: 24,
    agriculturalWorkersExposed: 22,
    highRiskIndividuals: 2,
    atRiskFarms: 11,
    weather: {
      temperature: 29,
      humidity: 58,
      rainfall: 4,
      rainProbability: 35,
      windSpeed: 14,
      condition: 'Mild Breeze',
    },
  },
  {
    id: 'vil-barpeta',
    name: 'Raha Block',
    district: 'Nagaon',
    state: 'Assam',
    population: 5120,
    registeredFarmers: 1450,
    healthWorkersCount: 42,
    latitude: 26.2285,
    longitude: 92.5183,
    currentRisk: 'HIGH',
    heatRisk: 76,
    agriculturalRisk: 69,
    healthRisk: 62,
    environmentalRisk: 52,
    overallRisk: 70,
    agriculturalWorkersExposed: 118,
    highRiskIndividuals: 19,
    atRiskFarms: 54,
    weather: {
      temperature: 37,
      humidity: 74,
      rainfall: 18,
      rainProbability: 40,
      windSpeed: 8,
      condition: 'Humid & Overcast',
    },
  },
];

export const initialFarmers: Farmer[] = [
  {
    id: 'farmer-101',
    farmerId: 'AGR-AS-2048',
    abhaId: '91-4820-1928-3019',
    name: 'Ramesh Das',
    age: 46,
    gender: 'Male',
    phone: '+91 94350 12894',
    village: 'Borigaon',
    district: 'Morigaon',
    state: 'Assam',
    farmSize: 2.5,
    primaryCrop: 'Paddy',
    cropVariety: 'Ranjit Sub-1',
    sowingDate: '2026-06-15',
    soilType: 'Alluvial',
    irrigationType: 'Rainfed',
    dailyOutdoorHours: 6,
    recentPesticideExposure: true,
    pesticideName: 'Chlorpyrifos 20% EC',
    pesticideUsageDate: '2026-08-25',
    symptoms: ['Dizziness', 'Fatigue', 'Headache'],
    existingHealthConcerns:
      'Mild hypertension, previous heat cramps episode',
    lastHealthScreeningDate: '2026-08-26',
    cropGrowthStage: 'Flowering',
    soilMoisture: 'Medium',
    heatRiskScore: 82,
    cropRiskScore: 71,
    healthRiskScore: 76,
    environmentalRiskScore: 65,
    overallRiskScore: 78,
    riskCategory: 'HIGH',
    lastSync: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    syncStatus: 'Synced',
    createdAt: '2026-08-10T08:30:00Z',
    updatedAt: new Date().toISOString(),
  },

  {
    id: 'farmer-102',
    farmerId: 'AGR-AS-2049',
    abhaId: '91-8392-4910-8842',
    name: 'Anita Devi',
    age: 39,
    gender: 'Female',
    phone: '+91 98640 45210',
    village: 'Sonapur',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    farmSize: 1.8,
    primaryCrop: 'Vegetables',
    cropVariety: 'Hybrid Tomato & Cauliflower',
    sowingDate: '2026-07-02',
    soilType: 'Sandy Loam',
    irrigationType: 'Borewell',
    dailyOutdoorHours: 4,
    recentPesticideExposure: false,
    symptoms: [],
    existingHealthConcerns: 'None reported',
    lastHealthScreeningDate: '2026-08-24',
    cropGrowthStage: 'Vegetative',
    soilMoisture: 'Medium',
    heatRiskScore: 48,
    cropRiskScore: 41,
    healthRiskScore: 32,
    environmentalRiskScore: 30,
    overallRiskScore: 42,
    riskCategory: 'MODERATE',
    lastSync: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    syncStatus: 'Synced',
    createdAt: '2026-08-12T10:15:00Z',
    updatedAt: new Date().toISOString(),
  },

  {
    id: 'farmer-103',
    farmerId: 'AGR-AS-2050',
    abhaId: '91-3719-5820-1193',
    name: 'Rahul Kalita',
    age: 52,
    gender: 'Male',
    phone: '+91 97060 88231',
    village: 'Dakhin Gaon',
    district: 'Nagaon',
    state: 'Assam',
    farmSize: 3.2,
    primaryCrop: 'Mustard',
    cropVariety: 'NRCHB 101',
    sowingDate: '2026-07-20',
    soilType: 'Alluvial',
    irrigationType: 'Canal',
    dailyOutdoorHours: 3,
    recentPesticideExposure: false,
    symptoms: [],
    existingHealthConcerns: 'Joint stiffness',
    lastHealthScreeningDate: '2026-08-22',
    cropGrowthStage: 'Tillering',
    soilMoisture: 'Medium',
    heatRiskScore: 28,
    cropRiskScore: 26,
    healthRiskScore: 22,
    environmentalRiskScore: 18,
    overallRiskScore: 24,
    riskCategory: 'LOW',
    lastSync: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    syncStatus: 'Synced',
    createdAt: '2026-08-15T11:00:00Z',
    updatedAt: new Date().toISOString(),
  },

  {
    id: 'farmer-104',
    farmerId: 'AGR-AS-2051',
    abhaId: '91-6204-7182-9904',
    name: 'Bipul Hazarika',
    age: 44,
    gender: 'Male',
    phone: '+91 94351 90214',
    village: 'Borigaon',
    district: 'Morigaon',
    state: 'Assam',
    farmSize: 4.0,
    primaryCrop: 'Paddy',
    cropVariety: 'Bahadur',
    sowingDate: '2026-06-18',
    soilType: 'Clay',
    irrigationType: 'Rainfed',
    dailyOutdoorHours: 7,
    recentPesticideExposure: true,
    pesticideName: 'Mancozeb 75% WP',
    pesticideUsageDate: '2026-08-26',
    symptoms: ['Fatigue', 'Skin Rash'],
    existingHealthConcerns:
      'Smoker, occasional chest congestion',
    lastHealthScreeningDate: '2026-08-26',
    cropGrowthStage: 'Tillering',
    soilMoisture: 'Waterlogged',
    heatRiskScore: 78,
    cropRiskScore: 68,
    healthRiskScore: 72,
    environmentalRiskScore: 60,
    overallRiskScore: 74,
    riskCategory: 'HIGH',
    lastSync: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    syncStatus: 'Synced',
    createdAt: '2026-08-18T09:45:00Z',
    updatedAt: new Date().toISOString(),
  },

  {
    id: 'farmer-105',
    farmerId: 'AGR-AS-2052',
    abhaId: '91-5192-8830-4411',
    name: 'Monojit Bora',
    age: 36,
    gender: 'Male',
    phone: '+91 98540 33190',
    village: 'Sonapur',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    farmSize: 1.5,
    primaryCrop: 'Vegetables',
    cropVariety: 'Brinjal & Chilli',
    sowingDate: '2026-07-10',
    soilType: 'Sandy Loam',
    irrigationType: 'Drip',
    dailyOutdoorHours: 5,
    recentPesticideExposure: true,
    pesticideName: 'Cypermethrin 10% EC',
    symptoms: ['Nausea', 'Headache'],
    lastHealthScreeningDate: '2026-08-25',
    cropGrowthStage: 'Flowering',
    soilMoisture: 'Medium',
    heatRiskScore: 64,
    cropRiskScore: 58,
    healthRiskScore: 68,
    environmentalRiskScore: 40,
    overallRiskScore: 62,
    riskCategory: 'HIGH',
    lastSync: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    syncStatus: 'Synced',
    createdAt: '2026-08-20T14:20:00Z',
    updatedAt: new Date().toISOString(),
  },
];

export const initialAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'HEAT',
    priority: 'HIGH',
    title: 'Extreme Heat Stress Advisory',
    description:
      '42 agricultural workers exposed to extreme heat conditions (>39°C, 78% RH) during peak weeding & spraying hours.',
    affectedCount: 42,
    affectedEntityType: 'workers',
    location: 'Borigaon (North Zone)',
    villageId: 'vil-borigaon',
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    recommendedAction:
      'Mandate work suspension between 12:00 PM and 4:00 PM; distribute ORS sachets via ASHA workers.',
    status: 'New',
  },

  {
    id: 'alert-2',
    type: 'CROP',
    priority: 'MODERATE',
    title: 'Paddy Blast Disease Risk',
    description:
      'Persistent 84% microclimate humidity and stagnant drainage indicate elevated fungal spore germination.',
    affectedCount: 67,
    affectedEntityType: 'farms',
    location: 'Morigaon Agricultural Belt',
    villageId: 'vil-borigaon',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    recommendedAction:
      'Deploy scouting protocol for diamond-shaped foliar lesions; clear lateral drainage channels.',
    status: 'New',
  },

  {
    id: 'alert-3',
    type: 'PESTICIDE',
    priority: 'HIGH',
    title: 'Occupational Chemical Toxicity Cluster',
    description:
      '7 field laborers reported dizziness, nausea, and skin irritation following unsupervised pesticide application.',
    affectedCount: 7,
    affectedEntityType: 'workers',
    location: 'Borigaon & Raha Block',
    villageId: 'vil-borigaon',
    timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    recommendedAction:
      'Immediate dermal wash, pause chemical handling without respirators, dispatch ANM for blood pressure monitoring.',
    status: 'Acknowledged',
    acknowledgedBy: 'Mina Das (ASHA Supervisor)',
  },

  {
    id: 'alert-4',
    type: 'WEATHER',
    priority: 'MODERATE',
    title: 'Localized Convective Storm Probability',
    description:
      'Weather radar indicates 40% chance of sudden localized heavy rain with wind gusts up to 28 km/h.',
    affectedCount: 120,
    affectedEntityType: 'farms',
    location: 'Kamrup & Morigaon Border',
    villageId: 'vil-sonapur',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    recommendedAction:
      'Secure open grain storage and suspend aerial foliar sprays to avoid chemical runoff.',
    status: 'Resolved',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

export const initialHealthScreenings: HealthScreening[] = [
  {
    id: 'hs-101',
    farmerId: 'farmer-101',
    farmerName: 'Ramesh Das',
    screeningDate: new Date(
      Date.now() - 1000 * 60 * 60 * 24
    ).toISOString(),
    healthWorkerName: 'Mina Das (ASHA-04)',
    village: 'Borigaon',
    bodyTemperature: 38.2,
    systolicBP: 138,
    diastolicBP: 88,
    pulseRate: 92,
    outdoorWorkHours: 6,
    waterIntakeLiters: 1.5,
    pesticideExposure: true,
    pesticideExposureDetails:
      'Chlorpyrifos applied without respirator mask',
    dizziness: true,
    fatigue: true,
    headache: true,
    nausea: true,
    breathingDifficulty: false,
    skinRash: false,
    muscleCramps: true,
    symptomDuration: 'Since yesterday noon',
    clinicalNotes:
      'Patient was weeding paddy under intense sun for 6 hours. Reports lightheadedness and nausea upon standing. Hydration deficit observed.',
    heatStressScore: 82,
    pesticideRiskScore: 70,
    overallHealthScore: 76,
    riskCategory: 'HIGH',
    recommendations: [
      'Immediate 2-day outdoor work exemption.',
      'Oral Rehydration Salts (ORS) 3 packets/day.',
      'Schedule follow-up vitals check at Sub-Centre.',
    ],
    referralRequired: true,
    referralFacility: 'Morigaon Model Hospital / PHC',
    syncStatus: 'Synced',
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24
    ).toISOString(),
  },

  {
    id: 'hs-102',
    farmerId: 'farmer-102',
    farmerName: 'Anita Devi',
    screeningDate: new Date(
      Date.now() - 1000 * 60 * 60 * 48
    ).toISOString(),
    healthWorkerName: 'Anjali Devi (ASHA-07)',
    village: 'Sonapur',
    bodyTemperature: 37.1,
    systolicBP: 120,
    diastolicBP: 78,
    pulseRate: 76,
    outdoorWorkHours: 4,
    waterIntakeLiters: 2.8,
    pesticideExposure: false,
    dizziness: false,
    fatigue: false,
    headache: false,
    nausea: false,
    breathingDifficulty: false,
    skinRash: false,
    muscleCramps: false,
    symptomDuration: 'None',
    clinicalNotes:
      'Routine screening. Adequate hydration and sun protection noted. Vitals completely stable.',
    heatStressScore: 38,
    pesticideRiskScore: 10,
    overallHealthScore: 28,
    riskCategory: 'LOW',
    recommendations: [
      'Continue routine hydration and sun safety habits.',
    ],
    referralRequired: false,
    syncStatus: 'Synced',
    createdAt: new Date(
      Date.now() - 1000 * 60 * 60 * 48
    ).toISOString(),
  },
];

export async function initializeSeedData() {
  const isSeeded = await db.settings.get('isSeeded');
  const farmersCount = await db.farmers.count();
  const villagesCount = await db.villages.count();

  if (
    !isSeeded?.value ||
    farmersCount === 0 ||
    villagesCount === 0
  ) {
    await db.villages.bulkPut(initialVillages);
    await db.farmers.bulkPut(initialFarmers);
    await db.alerts.bulkPut(initialAlerts);
    await db.healthScreenings.bulkPut(initialHealthScreenings);

    await db.settings.put({
      key: 'isSeeded',
      value: true,
    });

    await db.settings.put({
      key: 'lastSyncTimestamp',
      value: new Date().toISOString(),
    });
  }
}