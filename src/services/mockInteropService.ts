export interface MockApiResponse<T> {
  status: '200 OK' | '500 ERROR' | '404 NOT FOUND';
  latencyMs: number;
  timestamp: string;
  schemaValidated: boolean;
  gateway: string;
  data: T;
}

export const generateAbdmHealthRecord = (farmer: any) => {
  const abhaId = farmer?.abhaId || '91-4820-1928-3019';
  return {
    resourceType: 'Bundle',
    id: `abdm-bundle-${farmer?.id || 'farmer-101'}`,
    type: 'collection',
    timestamp: new Date().toISOString(),
    meta: {
      profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle'],
      versionId: '1.0',
    },
    entry: [
      {
        fullUrl: `urn:uuid:patient-${abhaId}`,
        resource: {
          resourceType: 'Patient',
          id: abhaId,
          identifier: [
            {
              system: 'https://healthid.ndhm.gov.in',
              value: abhaId,
            },
          ],
          name: [{ text: farmer?.name || 'Ramesh Das' }],
          gender: (farmer?.gender || 'Male').toLowerCase(),
          birthDate: `${2026 - (farmer?.age || 45)}-01-01`,
          address: [
            {
              district: farmer?.district || 'Morigaon',
              state: farmer?.state || 'Assam',
              country: 'India',
            },
          ],
        },
      },
      {
        fullUrl: 'urn:uuid:obs-heat-01',
        resource: {
          resourceType: 'Observation',
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'vital-signs',
                  display: 'Vital Signs',
                },
              ],
            },
          ],
          code: {
            text: 'Occupational Heat Strain & Exposure Index',
            coding: [{ system: 'http://loinc.org', code: '8310-5', display: 'Body temperature' }],
          },
          valueQuantity: {
            value: 38.2,
            unit: 'Cel',
            system: 'http://unitsofmeasure.org',
            code: 'Cel',
          },
          component: [
            {
              code: { text: 'Outdoor Sun Work Hours' },
              valueQuantity: { value: farmer?.dailyOutdoorHours || 6, unit: 'hours/day' },
            },
            {
              code: { text: 'Reported Acute Symptoms' },
              valueString: (farmer?.symptoms || ['Dizziness', 'Headache']).join(', '),
            },
          ],
        },
      },
    ],
  };
};

export const generateAgriStackRecord = (farmer: any) => {
  return {
    registry: 'AgriStack - National Farmer Registry (NFR)',
    version: '1.8-REST',
    farmerId: farmer?.farmerId || 'AGR-AS-2048',
    demographics: {
      name: farmer?.name || 'Ramesh Das',
      village: farmer?.village || 'Borigaon',
      district: farmer?.district || 'Morigaon',
      state: farmer?.state || 'Assam',
    },
    landParcel: {
      plotDagNumber: '412/108',
      pattaNumber: 'KP-94',
      areaAcres: farmer?.farmSize || 2.5,
      soilClassification: farmer?.soilType || 'Alluvial',
      irrigation: farmer?.irrigationType || 'Rainfed',
    },
    cropTelemetry: {
      primaryCrop: farmer?.primaryCrop || 'Paddy',
      variety: farmer?.cropVariety || 'Ranjit Sub-1',
      growthStage: farmer?.cropGrowthStage || 'Flowering',
      soilMoisture: farmer?.soilMoisture || 'Medium',
      sowingDate: farmer?.sowingDate || '2026-06-15',
    },
  };
};

export const generateUnifiedRuralRiskPayload = (farmer: any, village: any) => {
  return {
    system: 'Gram Setu - Integrated Rural Risk Intelligence',
    specificationVersion: '2.0.0-ABDM-AgriStack-Bridge',
    timestamp: new Date().toISOString(),
    identifiers: {
      farmerAgriStackId: farmer?.farmerId || 'AGR-AS-2048',
      patientAbhaId: farmer?.abhaId || '91-4820-1928-3019',
      villageLgdCode: '284912',
      villageName: village?.name || 'Borigaon',
    },
    riskAssessment: {
      overallRuralRiskScore: farmer?.overallRiskScore || 79,
      riskCategory: farmer?.riskCategory || 'HIGH',
      domains: {
        occupationalHeatRisk: farmer?.heatRiskScore || 82,
        cropDiseaseVulnerability: farmer?.cropRiskScore || 71,
        clinicalHealthSymptomScore: farmer?.healthRiskScore || 76,
        environmentalStressIndex: 65,
      },
    },
    integratedAdvisory: {
      whyThisMatters:
        'Dual hazard detected: Elevated ambient temperature (39°C) compounds occupational heat exhaustion while 78% relative humidity accelerates paddy fungal blast.',
      synchronizedActions: [
        'Reschedule outdoor manual weeding away from 11:30 AM - 3:30 PM.',
        'Deploy ASHA mobile health screening with ORS hydration packet.',
        'Inspect paddy leaf collar for blast lesions and drain standing surface water.',
      ],
    },
  };
};

export const verifyInteroperabilityPayload = async (payload: any) => {
  await new Promise((r) => setTimeout(r, 600));
  return {
    verified: true,
    status: '200 OK',
    targetGateway: 'NDHM ABDM + AgriStack Multi-Registry Gateway',
    latencyMs: 136,
    schemaType: payload.resourceType === 'Bundle' ? 'HL7 FHIR R4' : payload.registry ? 'AgriStack NFR v1.8' : 'Gram Setu Interop v2.0',
    fhirValidation: {
      specVersion: 'HL7 FHIR R4.0.1',
      profileConformant: true,
    },
    agriStackValidation: {
      landRef: 'Assam Bhunaksha Validated',
      aadhaarVaultTokenVerified: true,
    },
  };
};

export const mockInteropService = {
  // ABDM / FHIR Health Records API (Sandbox Representation)
  async getAbdmPatientRecord(abhaId: string = '91-4820-1928-3019'): Promise<MockApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return {
      status: '200 OK',
      latencyMs: 142,
      timestamp: new Date().toISOString(),
      schemaValidated: true,
      gateway: 'NDHM / ABDM Sandbox Gateway v2.4 (HL7 FHIR R4)',
      data: {
        resourceType: 'Bundle',
        type: 'collection',
        id: 'abdm-bundle-1024',
        entry: [
          {
            fullUrl: `urn:uuid:patient-${abhaId}`,
            resource: {
              resourceType: 'Patient',
              id: abhaId,
              identifier: [
                {
                  system: 'https://healthid.ndhm.gov.in',
                  value: abhaId,
                },
              ],
              name: [
                {
                  text: 'Ramesh Das',
                  family: 'Das',
                  given: ['Ramesh'],
                },
              ],
              gender: 'male',
              birthDate: '1980-04-12',
              address: [
                {
                  district: 'Morigaon',
                  state: 'Assam',
                  country: 'India',
                  postalCode: '782105',
                },
              ],
            },
          },
          {
            fullUrl: 'urn:uuid:obs-heat-01',
            resource: {
              resourceType: 'Observation',
              status: 'final',
              category: [
                {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                      code: 'vital-signs',
                      display: 'Vital Signs',
                    },
                  ],
                },
              ],
              code: {
                text: 'Heat Exhaustion & Occupational Heat Strain Evaluation',
                coding: [
                  {
                    system: 'http://loinc.org',
                    code: '8310-5',
                    display: 'Body temperature',
                  },
                ],
              },
              valueQuantity: {
                value: 38.2,
                unit: 'Cel',
                system: 'http://unitsofmeasure.org',
                code: 'Cel',
              },
            },
          },
          {
            fullUrl: 'urn:uuid:cond-01',
            resource: {
              resourceType: 'Condition',
              clinicalStatus: {
                coding: [{ code: 'active', display: 'Active' }],
              },
              verificationStatus: {
                coding: [{ code: 'confirmed', display: 'Confirmed' }],
              },
              category: [
                {
                  coding: [{ code: 'occupational-hazard', display: 'Occupational Hazard' }],
                },
              ],
              code: {
                text: 'Heat-related illness aggravated by organophosphate pesticide handling',
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '276063007',
                    display: 'Heat exhaustion',
                  },
                ],
              },
              subject: {
                reference: `Patient/${abhaId}`,
              },
            },
          },
        ],
      },
    };
  },

  // AgriStack Farmer & Farm Registry API (Sandbox Representation)
  async getAgriStackRecord(farmerId: string = 'AGR-AS-2048'): Promise<MockApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 520));
    return {
      status: '200 OK',
      latencyMs: 168,
      timestamp: new Date().toISOString(),
      schemaValidated: true,
      gateway: 'AgriStack Open API Gateway v1.8 (Govt of India Interop Standard)',
      data: {
        registryType: 'National Farmer Registry (NFR)',
        farmerId: farmerId,
        aadhaarVaultLinked: true,
        basicProfile: {
          fullName: 'Ramesh Das',
          fatherName: 'Late Bhabesh Das',
          stateCode: '18', // Assam
          districtCode: '298', // Morigaon
          subDistrict: 'Bhuragaon',
          villageLGDCode: '284912',
          kisanCreditCardStatus: 'Active',
          pmKisanBeneficiary: true,
        },
        landPlots: [
          {
            khasraDagNumber: '412/108',
            pattaNumber: 'KP-94',
            areaInAcres: 2.5,
            geoCoordinates: {
              latitude: 26.2514,
              longitude: 92.3482,
              polygonBoundary: [
                [26.2512, 92.348],
                [26.2516, 92.348],
                [26.2516, 92.3485],
                [26.2512, 92.3485],
              ],
            },
            soilHealthCard: {
              soilType: 'Alluvial (Loamy Sand)',
              ph: 6.2,
              organicCarbonPct: 0.54,
              nitrogenKgHa: 'Medium',
              phosphorusKgHa: 'Low',
              potassiumKgHa: 'High',
              zincPpm: 0.48,
            },
            cropHistory: [
              {
                season: 'Kharif 2026',
                cropName: 'Paddy',
                variety: 'Ranjit Sub-1 (Flood tolerant)',
                sownAreaAcres: 2.5,
                sowingDate: '2026-06-15',
                irrigationSource: 'Rainfed / Natural Swamps',
              },
            ],
          },
        ],
      },
    };
  },

  // Open Weather & Microclimate API
  async getWeatherObservation(village: string = 'Borigaon'): Promise<MockApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 380));
    return {
      status: '200 OK',
      latencyMs: 118,
      timestamp: new Date().toISOString(),
      schemaValidated: true,
      gateway: 'IMD / Agromet Microclimate Telemetry Mesh',
      data: {
        location: village,
        state: 'Assam',
        coordinates: { lat: 26.25, lon: 92.34 },
        ambientTemperature: 39.0,
        feelsLikeTemperature: 46.4,
        wetBulbGlobeTemperature: 32.8, // Critical heat stress threshold
        relativeHumidity: 78,
        dewPoint: 28.1,
        rainfallAccumulated24h: 12.4,
        rainProbability6h: 20,
        windSpeedKmh: 9.2,
        windDirection: 'SSE',
        uvIndex: 10.2, // Very High
        solarRadiationWm2: 890,
        heatStressIndexCategory: 'DANGER_HEAT_EXHAUSTION_LIKELY',
        cropDiseaseVulnerabilityIndex: 'HIGH_FUNGAL_FAVORED',
      },
    };
  },
};
