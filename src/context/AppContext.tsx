import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  Language,
  Farmer,
  HealthScreening,
  FarmAssessment,
  Alert,
  SyncQueueItem,
  Village,
  RiskLevel,
  CrossDomainRiskAssessment,
} from '../types';
import {
  db,
  initializeSeedData,
  initialFarmers,
  initialVillages,
  initialAlerts,
} from '../db/dexieDb';
import { translations } from '../i18n/translations';
import {
  calculateHealthRisk,
  calculateCropRisk,
  calculateCrossDomainRisk,
} from '../engines/riskEngine';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  
  // Data state
  farmers: Farmer[];
  healthScreenings: HealthScreening[];
  farms: FarmAssessment[];
  alerts: Alert[];
  villages: Village[];
  syncQueue: SyncQueueItem[];
  selectedVillageId: string;
  setSelectedVillageId: (id: string) => void;
  selectedVillage: Village;
  selectedFarmerId: string | null;
  setSelectedFarmerId: (id: string | null) => void;
  
  // Offline & Sync
  isOnline: boolean;
  isSimulatedOffline: boolean;
  setIsSimulatedOffline: (val: boolean) => void;
  isSyncing: boolean;
  syncProgress: number;
  syncNow: () => Promise<void>;
  clearCompletedSync: () => Promise<void>;
  
  // Operations
  addFarmer: (farmerData: Omit<Farmer, 'id' | 'heatRiskScore' | 'cropRiskScore' | 'healthRiskScore' | 'environmentalRiskScore' | 'overallRiskScore' | 'riskCategory' | 'lastSync' | 'syncStatus' | 'createdAt' | 'updatedAt'>) => Promise<Farmer>;
  addHealthScreening: (data: Omit<HealthScreening, 'id' | 'heatStressScore' | 'pesticideRiskScore' | 'overallHealthScore' | 'riskCategory' | 'recommendations' | 'syncStatus' | 'createdAt'>) => Promise<HealthScreening>;
  addFarmAssessment: (data: Omit<FarmAssessment, 'id' | 'diseaseRiskScore' | 'weatherRiskScore' | 'pestRiskScore' | 'overallCropRiskScore' | 'riskCategory' | 'reasoning' | 'advisoryText' | 'syncStatus' | 'createdAt'>) => Promise<FarmAssessment>;
  updateAlertStatus: (alertId: string, newStatus: 'New' | 'Acknowledged' | 'Resolved') => Promise<void>;
  recalculateFarmerRisk: (farmerId: string) => Promise<Farmer | undefined>;
  
  // Scenario & Demo
  launchDemoScenario: () => Promise<void>;
  resetDatabaseToSeed: () => Promise<void>;
  
  // Notifications
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Speech API
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  
  // Active Cross-Domain Calculation for Current Village
  currentCrossDomainRisk: CrossDomainRiskAssessment;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('administrator');
  const [language, setLanguage] = useState<Language>('en');
  const [rawOnline, setRawOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [healthScreenings, setHealthScreenings] = useState<HealthScreening[]>([]);
  const [farms, setFarms] = useState<FarmAssessment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [villages, setVillages] = useState<Village[]>(initialVillages);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState<string>('vil-borigaon');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>('farmer-101');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const effectiveOnline = rawOnline && !isSimulatedOffline;

  // Load from Dexie on mount
  const refreshLocalData = async () => {
    try {
      await initializeSeedData();
      const allFarmers = await db.farmers.toArray();
      const allScreenings = await db.healthScreenings.toArray();
      const allFarms = await db.farms.toArray();
      const allAlerts = await db.alerts.toArray();
      const allVillages = await db.villages.toArray();
      const queue = await db.syncQueue.toArray();

      setFarmers(allFarmers);
      setHealthScreenings(allScreenings);
      setFarms(allFarms);
      setAlerts(allAlerts);
      if (allVillages.length > 0) setVillages(allVillages);
      setSyncQueue(queue);
    } catch (err) {
      console.error('Failed to load IndexedDB records:', err);
    }
  };

  useEffect(() => {
    refreshLocalData();

    const handleOnline = () => {
      setRawOnline(true);
      addToast('Network Reconnected', 'Device is back online. Syncing pending records...', 'info');
    };
    const handleOffline = () => {
      setRawOnline(false);
      addToast('Network Lost', 'Operating in low-bandwidth offline mode. Records will save locally.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Automatically flush the local queue when connectivity returns.
  useEffect(() => {
    if (!rawOnline || isSimulatedOffline || isSyncing) return;
    void syncNow();
  }, [rawOnline, isSimulatedOffline]);

  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const selectedVillage =
    villages.find((v) => v.id === selectedVillageId) || villages[0] || initialVillages[0];

  // Recalculate cross domain risk for current village
  const currentCrossDomainRisk = calculateCrossDomainRisk({
    temperature: selectedVillage.weather.temperature,
    humidity: selectedVillage.weather.humidity,
    rainfallMm: selectedVillage.weather.rainfall,
    crop: 'Paddy',
    outdoorWorkHours: 6,
    pesticideExposure: true,
    reportedSymptoms: ['Dizziness', 'Fatigue', 'Headache'],
    exposedWorkersCount: selectedVillage.agriculturalWorkersExposed || 42,
  });

  // Text to Speech
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      addToast('Speech API', 'Speech synthesis is not supported on this browser.', 'warning');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(
      (v) => v.lang.includes('IN') || v.name.includes('India') || v.lang.includes('en')
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Add Farmer with offline support
  const addFarmer = async (
    farmerData: Omit<
      Farmer,
      | 'id'
      | 'heatRiskScore'
      | 'cropRiskScore'
      | 'healthRiskScore'
      | 'environmentalRiskScore'
      | 'overallRiskScore'
      | 'riskCategory'
      | 'lastSync'
      | 'syncStatus'
      | 'createdAt'
      | 'updatedAt'
    >
  ): Promise<Farmer> => {
    const id = `farmer-${Date.now()}`;
    const healthResult = calculateHealthRisk({
      temperature: selectedVillage.weather.temperature,
      humidity: selectedVillage.weather.humidity,
      outdoorWorkHours: farmerData.dailyOutdoorHours,
      dizziness: farmerData.symptoms.includes('Dizziness'),
      fatigue: farmerData.symptoms.includes('Fatigue'),
      headache: farmerData.symptoms.includes('Headache'),
      nausea: farmerData.symptoms.includes('Nausea'),
      pesticideExposure: farmerData.recentPesticideExposure,
    });

    const cropResult = calculateCropRisk({
      crop: farmerData.primaryCrop,
      cropStage: farmerData.cropGrowthStage,
      temperature: selectedVillage.weather.temperature,
      humidity: selectedVillage.weather.humidity,
      rainfallMm: selectedVillage.weather.rainfall,
      soilMoisture: farmerData.soilMoisture,
      recentPesticideUse: farmerData.recentPesticideExposure,
    });

    const overallScore = Math.round(
      healthResult.overallHealthScore * 0.45 + cropResult.overallCropRiskScore * 0.55
    );
    const category: RiskLevel =
      overallScore >= 80
        ? 'CRITICAL'
        : overallScore >= 60
        ? 'HIGH'
        : overallScore >= 30
        ? 'MODERATE'
        : 'LOW';

    const syncStatus = effectiveOnline ? 'Synced' : 'Pending';

    const newFarmer: Farmer = {
      ...farmerData,
      id,
      heatRiskScore: healthResult.heatStressScore,
      cropRiskScore: cropResult.overallCropRiskScore,
      healthRiskScore: healthResult.overallHealthScore,
      environmentalRiskScore: 40,
      overallRiskScore: overallScore,
      riskCategory: category,
      lastSync: new Date().toISOString(),
      isOfflineCreated: !effectiveOnline,
      syncStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.farmers.put(newFarmer);

    if (!effectiveOnline) {
      const queueItem: SyncQueueItem = {
        id: `sync-${Date.now()}`,
        recordType: 'Farmer Registration',
        recordId: id,
        payload: newFarmer,
        createdOfflineAt: new Date().toISOString(),
        status: 'Pending',
        retryCount: 0,
      };
      await db.syncQueue.put(queueItem);
      addToast('Stored Locally (Offline)', `Farmer "${newFarmer.name}" saved to IndexedDB queue.`, 'info');
    } else {
      addToast('Farmer Registered', `Farmer "${newFarmer.name}" registered and synced.`, 'success');
    }

    await refreshLocalData();
    return newFarmer;
  };

  // Add Health Screening
  const addHealthScreening = async (
    data: Omit<
      HealthScreening,
      | 'id'
      | 'heatStressScore'
      | 'pesticideRiskScore'
      | 'overallHealthScore'
      | 'riskCategory'
      | 'recommendations'
      | 'syncStatus'
      | 'createdAt'
    >
  ): Promise<HealthScreening> => {
    const id = `hs-${Date.now()}`;
    const healthResult = calculateHealthRisk({
      temperature: data.bodyTemperature > 37 ? data.bodyTemperature + 1 : 38,
      humidity: selectedVillage.weather.humidity,
      outdoorWorkHours: data.outdoorWorkHours,
      waterIntakeLiters: data.waterIntakeLiters,
      dizziness: data.dizziness,
      fatigue: data.fatigue,
      headache: data.headache,
      nausea: data.nausea,
      breathingDifficulty: data.breathingDifficulty,
      muscleCramps: data.muscleCramps,
      skinRash: data.skinRash,
      pesticideExposure: data.pesticideExposure,
      bodyTemperature: data.bodyTemperature,
    });

    const syncStatus = effectiveOnline ? 'Synced' : 'Pending';

    const newScreening: HealthScreening = {
      ...data,
      id,
      heatStressScore: healthResult.heatStressScore,
      pesticideRiskScore: healthResult.pesticideRiskScore,
      overallHealthScore: healthResult.overallHealthScore,
      riskCategory: healthResult.riskCategory,
      recommendations: healthResult.recommendations,
      syncStatus,
      isOfflineCreated: !effectiveOnline,
      createdAt: new Date().toISOString(),
    };

    await db.healthScreenings.put(newScreening);

    // Update farmer's risk if linked
    const farmer = await db.farmers.get(data.farmerId);
    if (farmer) {
      farmer.heatRiskScore = healthResult.heatStressScore;
      farmer.healthRiskScore = healthResult.overallHealthScore;
      farmer.overallRiskScore = Math.round(
        (healthResult.overallHealthScore + farmer.cropRiskScore) / 2
      );
      farmer.riskCategory =
        farmer.overallRiskScore >= 80
          ? 'CRITICAL'
          : farmer.overallRiskScore >= 60
          ? 'HIGH'
          : farmer.overallRiskScore >= 30
          ? 'MODERATE'
          : 'LOW';
      farmer.lastHealthScreeningDate = new Date().toISOString();
      await db.farmers.put(farmer);
    }

    if (!effectiveOnline) {
      await db.syncQueue.put({
        id: `sync-${Date.now()}`,
        recordType: 'Health Screening',
        recordId: id,
        payload: newScreening,
        createdOfflineAt: new Date().toISOString(),
        status: 'Pending',
        retryCount: 0,
      });
      addToast('Stored Locally (Offline)', `Screening for ${data.farmerName} queued in IndexedDB.`, 'info');
    } else {
      addToast('Screening Saved', `Health screening recorded with Score: ${healthResult.overallHealthScore} (${healthResult.riskCategory}).`, 'success');
    }

    await refreshLocalData();
    return newScreening;
  };

  // Add Farm Assessment
  const addFarmAssessment = async (
    data: Omit<
      FarmAssessment,
      | 'id'
      | 'diseaseRiskScore'
      | 'weatherRiskScore'
      | 'pestRiskScore'
      | 'overallCropRiskScore'
      | 'riskCategory'
      | 'reasoning'
      | 'advisoryText'
      | 'syncStatus'
      | 'createdAt'
    >
  ): Promise<FarmAssessment> => {
    const id = `farm-assess-${Date.now()}`;
    const cropResult = calculateCropRisk({
      crop: data.crop,
      cropStage: data.cropStage,
      temperature: data.temperature,
      humidity: data.humidity,
      rainfallMm: data.rainfallMm,
      soilMoisture: data.soilMoisture,
      recentPesticideUse: data.recentPesticideUse,
      observedSymptoms: data.observedSymptoms,
    });

    const syncStatus = effectiveOnline ? 'Synced' : 'Pending';

    const newAssessment: FarmAssessment = {
      ...data,
      id,
      diseaseRiskScore: cropResult.diseaseRiskScore,
      weatherRiskScore: cropResult.weatherRiskScore,
      pestRiskScore: cropResult.pestRiskScore,
      overallCropRiskScore: cropResult.overallCropRiskScore,
      riskCategory: cropResult.riskCategory,
      reasoning: cropResult.reasoning,
      advisoryText: cropResult.advisories.join(' '),
      syncStatus,
      createdAt: new Date().toISOString(),
    };

    await db.farms.put(newAssessment);

    if (!effectiveOnline) {
      await db.syncQueue.put({
        id: `sync-${Date.now()}`,
        recordType: 'Farm Assessment',
        recordId: id,
        payload: newAssessment,
        createdOfflineAt: new Date().toISOString(),
        status: 'Pending',
        retryCount: 0,
      });
      addToast('Stored Locally (Offline)', `Farm assessment for ${data.crop} queued for sync.`, 'info');
    } else {
      addToast('Farm Assessment Complete', `Crop Risk calculated: ${cropResult.overallCropRiskScore} (${cropResult.riskCategory}).`, 'success');
    }

    await refreshLocalData();
    return newAssessment;
  };

  // Update Alert
  const updateAlertStatus = async (
    alertId: string,
    newStatus: 'New' | 'Acknowledged' | 'Resolved'
  ) => {
    const alert = await db.alerts.get(alertId);
    if (alert) {
      alert.status = newStatus;
      if (newStatus === 'Acknowledged') {
        alert.acknowledgedBy = role === 'health_worker' ? 'ASHA Supervisor' : 'Rural Officer';
      }
      if (newStatus === 'Resolved') {
        alert.resolvedAt = new Date().toISOString();
      }
      await db.alerts.put(alert);
      addToast('Alert Updated', `Alert "${alert.title}" status changed to ${newStatus}.`, 'info');
      await refreshLocalData();
    }
  };

  // Recalculate Farmer Risk
  const recalculateFarmerRisk = async (farmerId: string) => {
    const farmer = await db.farmers.get(farmerId);
    if (!farmer) return;

    const healthResult = calculateHealthRisk({
      temperature: selectedVillage.weather.temperature,
      humidity: selectedVillage.weather.humidity,
      outdoorWorkHours: farmer.dailyOutdoorHours,
      dizziness: farmer.symptoms.includes('Dizziness'),
      fatigue: farmer.symptoms.includes('Fatigue'),
      headache: farmer.symptoms.includes('Headache'),
      nausea: farmer.symptoms.includes('Nausea'),
      pesticideExposure: farmer.recentPesticideExposure,
    });

    const cropResult = calculateCropRisk({
      crop: farmer.primaryCrop,
      cropStage: farmer.cropGrowthStage,
      temperature: selectedVillage.weather.temperature,
      humidity: selectedVillage.weather.humidity,
      rainfallMm: selectedVillage.weather.rainfall,
      soilMoisture: farmer.soilMoisture,
      recentPesticideUse: farmer.recentPesticideExposure,
    });

    const overall = Math.round(
      healthResult.heatStressScore * 0.35 +
      cropResult.overallCropRiskScore * 0.35 +
      healthResult.overallHealthScore * 0.30
    );

    farmer.heatRiskScore = healthResult.heatStressScore;
    farmer.healthRiskScore = healthResult.overallHealthScore;
    farmer.cropRiskScore = cropResult.overallCropRiskScore;
    farmer.overallRiskScore = overall;
    farmer.riskCategory =
      overall >= 80 ? 'CRITICAL' : overall >= 60 ? 'HIGH' : overall >= 30 ? 'MODERATE' : 'LOW';
    farmer.updatedAt = new Date().toISOString();

    await db.farmers.put(farmer);
    addToast(
      'Risk Recalculated',
      `Updated ${farmer.name}: Heat ${farmer.heatRiskScore}, Crop ${farmer.cropRiskScore}, Overall ${farmer.overallRiskScore} (${farmer.riskCategory}).`,
      'success'
    );
    await refreshLocalData();
    return farmer;
  };

  // Sync Engine (Simulated low-bandwidth batching)
  const syncNow = async () => {
    if (!effectiveOnline) {
      addToast('Cannot Sync', 'Network is offline. Reconnect or disable simulated offline mode first.', 'warning');
      return;
    }

    const pending = await db.syncQueue.where('status').equals('Pending').toArray();
    if (pending.length === 0) {
      addToast('Already Synchronized', 'No pending records in local IndexedDB sync queue.', 'info');
      return;
    }

    setIsSyncing(true);
    setSyncProgress(10);
    addToast('Sync Started', `Uploading ${pending.length} local records to central interoperability gateway...`, 'info');

    // Simulate progressive network batch upload
    for (let i = 0; i < pending.length; i++) {
      const item = pending[i];
      await new Promise((r) => setTimeout(r, 400));
      item.status = 'Syncing';
      await db.syncQueue.put(item);
      setSyncProgress(Math.round(((i + 1) / pending.length) * 80));
    }

    // Mark all as Synced in Queue and Tables
    for (const item of pending) {
      item.status = 'Synced';
      await db.syncQueue.put(item);

      if (item.recordType === 'Farmer Registration') {
        const f = await db.farmers.get(item.recordId);
        if (f) {
          f.syncStatus = 'Synced';
          f.isOfflineCreated = false;
          f.lastSync = new Date().toISOString();
          await db.farmers.put(f);
        }
      } else if (item.recordType === 'Health Screening') {
        const hs = await db.healthScreenings.get(item.recordId);
        if (hs) {
          hs.syncStatus = 'Synced';
          hs.isOfflineCreated = false;
          await db.healthScreenings.put(hs);
        }
      } else if (item.recordType === 'Farm Assessment') {
        const farm = await db.farms.get(item.recordId);
        if (farm) {
          farm.syncStatus = 'Synced';
          await db.farms.put(farm);
        }
      }
    }

    setSyncProgress(100);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncProgress(0);
      addToast('Sync Complete', 'All local records synchronized successfully with central interoperability server.', 'success');
      refreshLocalData();
    }, 500);
  };

  const clearCompletedSync = async () => {
    const synced = await db.syncQueue.where('status').equals('Synced').toArray();
    for (const item of synced) {
      await db.syncQueue.delete(item.id);
    }
    addToast('Queue Cleaned', `Removed ${synced.length} synchronized records from local queue table.`, 'info');
    await refreshLocalData();
  };

  // Launch Demo Scenario
  const launchDemoScenario = async () => {
    setSelectedVillageId('vil-borigaon');
    setSelectedFarmerId('farmer-101');

    // Update village weather to critical heat & humidity
    // Use copies so the immutable seed templates are never mutated by demo mode.
    const borigaon = { ...initialVillages[0], weather: { ...initialVillages[0].weather } };
    borigaon.weather = {
      temperature: 39,
      humidity: 78,
      rainfall: 12,
      rainProbability: 20,
      windSpeed: 9,
      condition: 'Extreme Heat & High Humidity',
    };
    borigaon.currentRisk = 'HIGH';
    borigaon.heatRisk = 82;
    borigaon.agriculturalRisk = 71;
    borigaon.healthRisk = 76;
    borigaon.overallRisk = 79;
    await db.villages.put(borigaon);

    // Update Ramesh Das using a copy of the seed record.
    const ramesh = { ...initialFarmers[0], symptoms: [...initialFarmers[0].symptoms] };
    ramesh.age = 46;
    ramesh.primaryCrop = 'Paddy';
    ramesh.farmSize = 2.5;
    ramesh.dailyOutdoorHours = 6;
    ramesh.recentPesticideExposure = true;
    ramesh.symptoms = ['Dizziness', 'Fatigue', 'Headache'];
    ramesh.cropGrowthStage = 'Flowering';
    ramesh.soilMoisture = 'Medium';
    ramesh.heatRiskScore = 82;
    ramesh.healthRiskScore = 76;
    ramesh.cropRiskScore = 71;
    ramesh.overallRiskScore = 79;
    ramesh.riskCategory = 'HIGH';
    await db.farmers.put(ramesh);

    await refreshLocalData();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#059669', '#0d9488', '#0284c7', '#e11d48'],
      });
    } catch {
      // ignore
    }

    addToast(
      'Demo Scenario Loaded!',
      'Borigaon Compounding Crisis: 39°C Heat + 78% Humidity + Ramesh Das 6h Field Exposure + Paddy Blast Risk = 79 HIGH Community Risk.',
      'success'
    );
  };

  const resetDatabaseToSeed = async () => {
    await db.farmers.clear();
    await db.healthScreenings.clear();
    await db.farms.clear();
    await db.alerts.clear();
    await db.syncQueue.clear();
    await db.villages.clear();
    await db.settings.clear();
    await initializeSeedData();
    await refreshLocalData();
    addToast('Database Reset', 'IndexedDB reset to initial realistic Assam rural seed data.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t: translations[language],
        farmers,
        healthScreenings,
        farms,
        alerts,
        villages,
        syncQueue,
        selectedVillageId,
        setSelectedVillageId,
        selectedVillage,
        selectedFarmerId,
        setSelectedFarmerId,
        isOnline: effectiveOnline,
        isSimulatedOffline,
        setIsSimulatedOffline,
        isSyncing,
        syncProgress,
        syncNow,
        clearCompletedSync,
        addFarmer,
        addHealthScreening,
        addFarmAssessment,
        updateAlertStatus,
        recalculateFarmerRisk,
        launchDemoScenario,
        resetDatabaseToSeed,
        toasts,
        addToast,
        removeToast,
        speak,
        stopSpeaking,
        isSpeaking,
        currentCrossDomainRisk,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
