import { RiskLevel, CrossDomainRiskAssessment } from '../types';

export interface HealthRiskInput {
  temperature: number;
  humidity: number;
  outdoorWorkHours: number;
  waterIntakeLiters?: number;

  dizziness: boolean;
  fatigue: boolean;
  headache: boolean;
  nausea: boolean;
  breathingDifficulty?: boolean;
  muscleCramps?: boolean;
  skinRash?: boolean;

  pesticideExposure: boolean;
  bodyTemperature?: number;
  age?: number;
}

export interface HealthRiskOutput {
  heatStressScore: number;
  pesticideRiskScore: number;
  overallHealthScore: number;
  riskCategory: RiskLevel;
  topFactors: string[];
  recommendations: string[];
  urgency: string;
}

export interface CropRiskInput {
  crop: string;
  cropStage: string;
  temperature: number;
  humidity: number;
  rainfallMm: number;
  soilMoisture: 'Low' | 'Medium' | 'High' | 'Waterlogged';
  recentPesticideUse: boolean;
  observedSymptoms?: string[];
}

export interface CropRiskOutput {
  diseaseRiskScore: number;
  weatherRiskScore: number;
  pestRiskScore: number;
  overallCropRiskScore: number;
  riskCategory: RiskLevel;
  reasoning: string[];
  advisories: string[];
}

/* =========================================================
   COMMON
========================================================= */

export function calculateRiskCategory(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MODERATE';
  return 'LOW';
}

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Math.round(value)));

/* =========================================================
   HEALTH RISK ENGINE
========================================================= */

export function calculateHealthRisk(
  input: HealthRiskInput
): HealthRiskOutput {
  const {
    temperature,
    humidity,
    outdoorWorkHours,
    waterIntakeLiters = 2,
    dizziness,
    fatigue,
    headache,
    nausea,
    breathingDifficulty = false,
    muscleCramps = false,
    skinRash = false,
    pesticideExposure,
    bodyTemperature = 37,
  } = input;

  const factors: Array<{ text: string; weight: number }> = [];
  const recommendations: string[] = [];

  /* -------------------------
     HEAT STRESS
  ------------------------- */

  let heatScore = 10;

  if (temperature >= 40) {
    heatScore += 40;

    factors.push({
      text: `Extreme ambient temperature: ${temperature}°C`,
      weight: 40,
    });
  } else if (temperature >= 38) {
    heatScore += 32;

    factors.push({
      text: `Very high ambient temperature: ${temperature}°C`,
      weight: 32,
    });
  } else if (temperature >= 35) {
    heatScore += 24;

    factors.push({
      text: `High ambient temperature: ${temperature}°C`,
      weight: 24,
    });
  } else if (temperature >= 32) {
    heatScore += 14;

    factors.push({
      text: `Moderately high ambient temperature: ${temperature}°C`,
      weight: 14,
    });
  }

  /* Humidity */

  if (humidity >= 85) {
    heatScore += 20;

    factors.push({
      text: `Very high humidity: ${humidity}%`,
      weight: 20,
    });
  } else if (humidity >= 75) {
    heatScore += 16;

    factors.push({
      text: `High humidity: ${humidity}%`,
      weight: 16,
    });
  } else if (humidity >= 60) {
    heatScore += 8;
  }

  /* Outdoor exposure */

  if (outdoorWorkHours >= 8) {
    heatScore += 24;

    factors.push({
      text: `Prolonged outdoor exposure: ${outdoorWorkHours} hours/day`,
      weight: 24,
    });
  } else if (outdoorWorkHours >= 6) {
    heatScore += 20;

    factors.push({
      text: `Long outdoor exposure: ${outdoorWorkHours} hours/day`,
      weight: 20,
    });
  } else if (outdoorWorkHours >= 4) {
    heatScore += 14;

    factors.push({
      text: `Moderate outdoor exposure: ${outdoorWorkHours} hours/day`,
      weight: 14,
    });
  } else if (outdoorWorkHours >= 2) {
    heatScore += 7;
  }

  /* Hydration */

  if (waterIntakeLiters < 1.5 && outdoorWorkHours >= 4) {
    heatScore += 12;

    factors.push({
      text: `Low hydration: ${waterIntakeLiters} L/day`,
      weight: 12,
    });
  } else if (waterIntakeLiters < 2 && outdoorWorkHours >= 4) {
    heatScore += 5;
  }

  /* Symptoms */

  if (dizziness) {
    heatScore += 10;

    factors.push({
      text: 'Reported dizziness / lightheadedness',
      weight: 10,
    });
  }

  if (fatigue) {
    heatScore += 7;

    factors.push({
      text: 'Reported physical fatigue',
      weight: 7,
    });
  }

  if (headache) {
    heatScore += 7;

    factors.push({
      text: 'Reported headache',
      weight: 7,
    });
  }

  if (nausea) {
    heatScore += 10;

    factors.push({
      text: 'Reported nausea',
      weight: 10,
    });
  }

  if (muscleCramps) {
    heatScore += 7;

    factors.push({
      text: 'Reported muscle cramps',
      weight: 7,
    });
  }

  if (bodyTemperature >= 39) {
    heatScore += 18;

    factors.push({
      text: `Very high body temperature: ${bodyTemperature}°C`,
      weight: 18,
    });
  } else if (bodyTemperature >= 38.5) {
    heatScore += 12;

    factors.push({
      text: `Elevated body temperature: ${bodyTemperature}°C`,
      weight: 12,
    });
  }

  heatScore = clamp(heatScore);

  /* -------------------------
     PESTICIDE RISK
  ------------------------- */

  let pesticideScore = 5;

  if (pesticideExposure) {
    pesticideScore += 45;

    factors.push({
      text: 'Recent or active occupational pesticide exposure',
      weight: 45,
    });

    if (dizziness) {
      pesticideScore += 10;

      factors.push({
        text: 'Dizziness following possible chemical exposure',
        weight: 10,
      });
    }

    if (nausea) {
      pesticideScore += 10;

      factors.push({
        text: 'Nausea following possible chemical exposure',
        weight: 10,
      });
    }

    if (breathingDifficulty) {
      pesticideScore += 20;

      factors.push({
        text: 'Breathing difficulty after chemical exposure',
        weight: 20,
      });
    }

    if (skinRash) {
      pesticideScore += 10;

      factors.push({
        text: 'Skin irritation / rash',
        weight: 10,
      });
    }
  }

  pesticideScore = clamp(pesticideScore);

  /* -------------------------
     OVERALL SCORE
  ------------------------- */

  let overallScore =
    heatScore * 0.65 +
    pesticideScore * 0.35;

  /*
   * Additional escalation:
   * Multiple symptoms + extreme environment
   * should visibly increase the demo score.
   */

  const symptomCount = [
    dizziness,
    fatigue,
    headache,
    nausea,
    muscleCramps,
  ].filter(Boolean).length;

  if (
    temperature >= 38 &&
    humidity >= 75 &&
    symptomCount >= 2
  ) {
    overallScore += 8;
  }

  if (
    bodyTemperature >= 38.5 &&
    temperature >= 38
  ) {
    overallScore += 8;
  }

  if (
    pesticideExposure &&
    (dizziness ||
      nausea ||
      breathingDifficulty ||
      skinRash)
  ) {
    overallScore += 7;
  }

  const overallHealthScore = clamp(overallScore);

  const riskCategory =
    calculateRiskCategory(overallHealthScore);

  /* -------------------------
     RECOMMENDATIONS
  ------------------------- */

  if (heatScore >= 70) {
    recommendations.push(
      'Move heavy outdoor work to cooler morning or evening hours.'
    );

    recommendations.push(
      'Provide shaded rest breaks and frequent drinking-water access.'
    );

    recommendations.push(
      'Arrange prompt ASHA/ANM health-worker screening.'
    );
  } else if (heatScore >= 50) {
    recommendations.push(
      'Increase hydration and schedule regular shaded rest breaks.'
    );

    recommendations.push(
      'Avoid prolonged exposure during peak afternoon heat.'
    );
  } else if (heatScore >= 30) {
    recommendations.push(
      'Maintain regular hydration and monitor workers during field activity.'
    );
  }

  if (pesticideScore >= 70) {
    recommendations.push(
      'Stop further pesticide exposure until appropriate protective equipment is available.'
    );

    recommendations.push(
      'Wash exposed skin with clean running water and change contaminated clothing.'
    );

    recommendations.push(
      'Seek medical evaluation if breathing difficulty, persistent vomiting, severe dizziness or worsening symptoms occur.'
    );
  } else if (pesticideScore >= 50) {
    recommendations.push(
      'Use certified PPE including gloves, eye protection and appropriate respiratory protection during pesticide handling.'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Continue routine preventive monitoring and maintain adequate hydration.'
    );
  }

  /* -------------------------
     TOP FACTORS
  ------------------------- */

  const topFactors = factors
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map((item) => item.text);

  return {
    heatStressScore: heatScore,
    pesticideRiskScore: pesticideScore,
    overallHealthScore,
    riskCategory,
    topFactors,
    recommendations,
    urgency:
      overallHealthScore >= 80
        ? 'Immediate Medical Attention'
        : overallHealthScore >= 60
        ? 'Priority Health Check'
        : overallHealthScore >= 30
        ? 'Enhanced Monitoring'
        : 'Standard Routine',
  };
}

/* =========================================================
   AGRICULTURE RISK ENGINE
========================================================= */

export function calculateCropRisk(
  input: CropRiskInput
): CropRiskOutput {
  const {
    crop,
    cropStage,
    temperature,
    humidity,
    rainfallMm,
    soilMoisture,
    recentPesticideUse,
    observedSymptoms = [],
  } = input;

  const reasoning: string[] = [];
  const advisories: string[] = [];

  let diseaseScore = 15;
  let weatherScore = 15;
  let pestScore = 15;

  const normalizedCrop = crop.toLowerCase();
  const normalizedStage = cropStage.toLowerCase();

  /* Paddy / Rice */

  if (
    normalizedCrop.includes('paddy') ||
    normalizedCrop.includes('rice')
  ) {
    if (humidity >= 80 && rainfallMm >= 15) {
      diseaseScore += 45;

      reasoning.push(
        `High humidity (${humidity}%) and rainfall (${rainfallMm}mm) increase fungal disease risk in paddy.`
      );
    } else if (humidity >= 70) {
      diseaseScore += 25;

      reasoning.push(
        `Elevated humidity (${humidity}%) increases fungal disease risk.`
      );
    }

    if (
      normalizedStage.includes('flower') ||
      normalizedStage.includes('tiller')
    ) {
      diseaseScore += 15;

      reasoning.push(
        `The ${cropStage} stage is a vulnerable crop-growth period.`
      );
    }

    if (soilMoisture === 'Waterlogged') {
      diseaseScore += 12;

      reasoning.push(
        'Waterlogging increases disease and root-zone stress risk.'
      );
    }

    if (temperature >= 37) {
      weatherScore += 35;

      reasoning.push(
        `High temperature (${temperature}°C) may cause heat-related crop stress.`
      );
    }
  }

  /* Vegetables */

  else if (
    normalizedCrop.includes('vegetable') ||
    normalizedCrop.includes('tomato') ||
    normalizedCrop.includes('potato') ||
    normalizedCrop.includes('chilli')
  ) {
    if (humidity >= 75 && temperature >= 28) {
      diseaseScore += 40;
      pestScore += 30;

      reasoning.push(
        `Warm and humid conditions (${temperature}°C, ${humidity}% RH) increase disease and pest pressure.`
      );
    }

    if (rainfallMm > 40) {
      diseaseScore += 20;

      reasoning.push(
        'Heavy rainfall may increase fruit rot and water-related disease.'
      );
    }
  }

  /* Mustard */

  else if (
    normalizedCrop.includes('mustard') ||
    normalizedCrop.includes('oilseed')
  ) {
    if (humidity > 80 && temperature < 20) {
      diseaseScore += 40;

      reasoning.push(
        'Cool and humid conditions increase fungal disease risk in mustard.'
      );
    }

    if (temperature > 32) {
      weatherScore += 30;

      reasoning.push(
        'Unexpected heat can increase crop stress during pod filling.'
      );
    }
  }

  /* Generic crop */

  else {
    if (humidity > 80) {
      diseaseScore += 30;

      reasoning.push(
        'High humidity increases generic crop disease pressure.'
      );
    }

    if (rainfallMm > 50) {
      diseaseScore += 20;

      reasoning.push(
        'Heavy rainfall increases water-related crop risk.'
      );
    }

    if (temperature > 38) {
      weatherScore += 35;

      reasoning.push(
        'Very high temperature increases crop heat stress.'
      );
    }
  }

  /* Observed symptoms */

  if (observedSymptoms.length > 0) {
    diseaseScore += observedSymptoms.length * 10;

    reasoning.push(
      `Observed field symptoms: ${observedSymptoms.join(', ')}.`
    );
  }

  /* Soil / drought */

  if (
    soilMoisture === 'Low' &&
    rainfallMm < 5 &&
    temperature > 34
  ) {
    weatherScore += 35;

    reasoning.push(
      'Low soil moisture and high temperature indicate drought stress.'
    );
  }

  /* Pesticide history */

  if (recentPesticideUse) {
    pestScore += 10;

    reasoning.push(
      'Recent pesticide use is recorded and should be considered during field assessment.'
    );
  }

  const diseaseRiskScore = clamp(diseaseScore);
  const weatherRiskScore = clamp(weatherScore);
  const pestRiskScore = clamp(pestScore);

  const overallCropRiskScore = clamp(
    diseaseRiskScore * 0.5 +
      weatherRiskScore * 0.35 +
      pestRiskScore * 0.15
  );

  const riskCategory =
    calculateRiskCategory(overallCropRiskScore);

  /* Advisories */

  if (diseaseRiskScore >= 60) {
    advisories.push(
      'Inspect affected fields frequently for early disease symptoms.'
    );

    advisories.push(
      'Clear blocked drainage channels where standing water is present.'
    );

    advisories.push(
      'Consult the local KVK or agricultural officer before applying chemical controls.'
    );
  } else if (diseaseRiskScore >= 35) {
    advisories.push(
      'Increase field scouting and avoid excessive irrigation or nitrogen application.'
    );
  }

  if (weatherRiskScore >= 55) {
    if (soilMoisture === 'Low') {
      advisories.push(
        'Consider light irrigation during cooler hours to maintain root-zone moisture.'
      );
    } else if (temperature >= 36) {
      advisories.push(
        'Use mulching and other soil-moisture conservation practices.'
      );
    }
  }

  if (pestRiskScore >= 50) {
    advisories.push(
      'Inspect plants for visible pest activity before taking control measures.'
    );
  }

  if (advisories.length === 0) {
    advisories.push(
      'Crop conditions are currently stable. Continue routine monitoring.'
    );
  }

  return {
    diseaseRiskScore,
    weatherRiskScore,
    pestRiskScore,
    overallCropRiskScore,
    riskCategory,
    reasoning,
    advisories,
  };
}

/* =========================================================
   CROSS-DOMAIN ENGINE
========================================================= */

export function calculateCrossDomainRisk(params: {
  temperature: number;
  humidity: number;
  rainfallMm: number;
  crop: string;
  outdoorWorkHours: number;
  pesticideExposure: boolean;
  reportedSymptoms: string[];
  exposedWorkersCount?: number;
}): CrossDomainRiskAssessment {
  const {
    temperature,
    humidity,
    rainfallMm,
    crop,
    outdoorWorkHours,
    pesticideExposure,
    reportedSymptoms,
    exposedWorkersCount = 42,
  } = params;

  /* -------------------------
     HEALTH
  ------------------------- */

  const normalizedSymptoms =
    reportedSymptoms.map((s) => s.toLowerCase());

  const healthResult = calculateHealthRisk({
    temperature,
    humidity,
    outdoorWorkHours,

    dizziness: normalizedSymptoms.some(
      (s) => s.includes('dizz')
    ),

    fatigue: normalizedSymptoms.some(
      (s) => s.includes('fatig')
    ),

    headache: normalizedSymptoms.some(
      (s) => s.includes('head')
    ),

    nausea: normalizedSymptoms.some(
      (s) => s.includes('naus')
    ),

    breathingDifficulty: normalizedSymptoms.some(
      (s) => s.includes('breath')
    ),

    muscleCramps: normalizedSymptoms.some(
      (s) => s.includes('cramp')
    ),

    pesticideExposure,
  });

  /* -------------------------
     AGRICULTURE
  ------------------------- */

  const cropResult = calculateCropRisk({
    crop,
    cropStage: 'Flowering / Active Growth',
    temperature,
    humidity,
    rainfallMm,
    soilMoisture:
      rainfallMm > 30
        ? 'Waterlogged'
        : rainfallMm > 10
        ? 'Medium'
        : 'Low',
    recentPesticideUse: pesticideExposure,
    observedSymptoms: [],
  });

  const heatRisk = healthResult.heatStressScore;
  const healthRisk = healthResult.overallHealthScore;
  const cropRisk = cropResult.overallCropRiskScore;

  /* -------------------------
     ENVIRONMENT
  ------------------------- */

  let environmentalRisk = 20;

  if (temperature >= 40) {
    environmentalRisk += 40;
  } else if (temperature >= 37) {
    environmentalRisk += 30;
  } else if (temperature >= 33) {
    environmentalRisk += 18;
  }

  if (humidity >= 85) {
    environmentalRisk += 25;
  } else if (humidity >= 75) {
    environmentalRisk += 18;
  }

  if (rainfallMm > 50) {
    environmentalRisk += 20;
  }

  environmentalRisk = clamp(environmentalRisk);

  /* -------------------------
     COMMUNITY SCORE
  ------------------------- */

  const communityRiskScore = clamp(
    heatRisk * 0.35 +
      cropRisk * 0.30 +
      healthRisk * 0.25 +
      environmentalRisk * 0.10
  );

  const riskCategory =
    calculateRiskCategory(communityRiskScore);

  /* -------------------------
     WHY THIS MATTERS
  ------------------------- */

  let whyThisMatters = '';

  if (
    heatRisk >= 70 &&
    cropRisk >= 65
  ) {
    whyThisMatters =
      `Extreme heat (${temperature}°C) and high humidity (${humidity}%) create a combined agricultural and occupational-health risk. ${exposedWorkersCount} workers may require additional protection while ${crop} fields face elevated disease and heat stress.`;
  } else if (
    pesticideExposure &&
    heatRisk >= 60
  ) {
    whyThisMatters =
      `Heat exposure combined with pesticide handling increases occupational risk. Field workers should receive additional protection, hydration and monitoring.`;
  } else if (cropRisk >= 65) {
    whyThisMatters =
      `Current weather conditions are increasing crop disease and agricultural risk for ${crop}.`;
  } else if (healthRisk >= 65) {
    whyThisMatters =
      `Current environmental and occupational conditions indicate elevated worker-health risk requiring additional field monitoring.`;
  } else {
    whyThisMatters =
      `Gram Setu is continuously combining weather, agricultural and occupational-health indicators to identify emerging rural risks.`;
  }

  /* -------------------------
     RECOMMENDATIONS
  ------------------------- */

  const recommendations = [
    {
      id: 1,
      title: 'Reschedule Outdoor Agricultural Work',
      domain: 'Cross-Domain' as const,
      action:
        'Shift intensive field work toward cooler morning and evening periods when heat risk is elevated.',
      priority:
        heatRisk >= 60
          ? ('HIGH' as const)
          : ('MODERATE' as const),
    },

    {
      id: 2,
      title: 'Deploy ASHA/ANM Mobile Health Screening',
      domain: 'Health' as const,
      action:
        `Prioritize screening for approximately ${exposedWorkersCount} exposed agricultural workers when symptoms and heat risk increase.`,
      priority:
        healthRisk >= 60
          ? ('HIGH' as const)
          : ('MODERATE' as const),
    },

    {
      id: 3,
      title: `Intensive ${crop} Disease Surveillance`,
      domain: 'Agriculture' as const,
      action:
        'Increase field scouting and inspect crop areas for early disease or water-stress indicators.',
      priority:
        cropRisk >= 60
          ? ('HIGH' as const)
          : ('MODERATE' as const),
    },

    {
      id: 4,
      title: 'Hydration Stations & Shade Shelters',
      domain: 'Health' as const,
      action:
        'Provide drinking water, ORS and shaded rest areas near active farm clusters during high heat.',
      priority:
        heatRisk >= 60
          ? ('HIGH' as const)
          : ('LOW' as const),
    },

    {
      id: 5,
      title: 'Notify Agricultural Extension Staff',
      domain: 'Agriculture' as const,
      action:
        'Share high-risk crop conditions with the appropriate agricultural extension or KVK team for field-level follow-up.',
      priority:
        communityRiskScore >= 70
          ? ('HIGH' as const)
          : ('MODERATE' as const),
    },
  ];

  /* -------------------------
     TOP FACTORS
  ------------------------- */

  const topFactors = [
    `Ambient conditions: ${temperature}°C and ${humidity}% RH`,
    `${outdoorWorkHours} hours/day agricultural exposure`,
    `${crop} crop-risk index: ${cropRisk}%`,
    reportedSymptoms.length > 0
      ? `Reported symptoms: ${reportedSymptoms.join(', ')}`
      : 'No acute worker symptoms reported',
    pesticideExposure
      ? 'Recent or active pesticide exposure'
      : 'No active pesticide exposure alert',
  ];

  return {
    communityRiskScore,
    riskCategory,
    heatRisk,
    cropRisk,
    healthRisk,
    environmentalRisk,
    whyThisMatters,
    topFactors,
    recommendations,
    affectedPopulationEstimate: exposedWorkersCount,
    urgency:
      communityRiskScore >= 80
        ? 'Immediate (0-24h)'
        : communityRiskScore >= 60
        ? 'High (24-48h)'
        : 'Moderate (3-5 days)',
  };
}

/* =========================================================
   UNIFIED RURAL ASSESSMENT
========================================================= */

export function generateRuralRiskAssessment(params: {
  farmerName: string;
  village: string;
  crop: string;
  temperature: number;
  humidity: number;
  outdoorHours: number;
  symptoms: string[];
  pesticideExposure: boolean;
}) {
  const health = calculateHealthRisk({
    temperature: params.temperature,
    humidity: params.humidity,
    outdoorWorkHours: params.outdoorHours,

    dizziness: params.symptoms.includes('Dizziness'),
    fatigue: params.symptoms.includes('Fatigue'),
    headache: params.symptoms.includes('Headache'),
    nausea: params.symptoms.includes('Nausea'),

    pesticideExposure:
      params.pesticideExposure,
  });

  const crop = calculateCropRisk({
    crop: params.crop,
    cropStage: 'Flowering',
    temperature: params.temperature,
    humidity: params.humidity,
    rainfallMm: 12,
    soilMoisture: 'Medium',
    recentPesticideUse:
      params.pesticideExposure,
  });

  const crossDomain =
    calculateCrossDomainRisk({
      temperature: params.temperature,
      humidity: params.humidity,
      rainfallMm: 12,
      crop: params.crop,
      outdoorWorkHours: params.outdoorHours,
      pesticideExposure:
        params.pesticideExposure,
      reportedSymptoms: params.symptoms,
    });

  return {
    farmerName: params.farmerName,
    village: params.village,
    timestamp: new Date().toISOString(),

    healthRisk: health,
    cropRisk: crop,
    crossDomain,

    overallScore:
      crossDomain.communityRiskScore,

    riskCategory:
      crossDomain.riskCategory,
  };
}