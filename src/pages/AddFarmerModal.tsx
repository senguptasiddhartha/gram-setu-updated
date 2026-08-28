import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { Sprout, User, HeartPulse, Check, Sparkles } from 'lucide-react';

interface AddFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFarmerModal: React.FC<AddFarmerModalProps> = ({ isOpen, onClose }) => {
  const { addFarmer, selectedVillage, isOnline } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    age: 42,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    farmerId: `AGR-AS-${Math.floor(2000 + Math.random() * 8000)}`,
    abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    village: selectedVillage.name || 'Borigaon',
    district: selectedVillage.district || 'Morigaon',
    state: 'Assam',
    farmSize: 2.0,
    primaryCrop: 'Paddy',
    cropVariety: 'Ranjit Sub-1',
    sowingDate: new Date().toISOString().split('T')[0],
    soilType: 'Alluvial' as const,
    irrigationType: 'Rainfed' as const,
    dailyOutdoorHours: 5,
    recentPesticideExposure: false,
    pesticideName: '',
    symptoms: [] as string[],
    existingHealthConcerns: '',
    cropGrowthStage: 'Tillering' as const,
    soilMoisture: 'Medium' as const,
  });

  const availableSymptoms = [
    'Dizziness',
    'Fatigue',
    'Headache',
    'Nausea',
    'Breathing Difficulty',
    'Skin Rash',
    'Muscle Cramps',
  ];

  const handleSymptomToggle = (symptom: string) => {
    setFormData((prev) => {
      const exists = prev.symptoms.includes(symptom);
      return {
        ...prev,
        symptoms: exists
          ? prev.symptoms.filter((s) => s !== symptom)
          : [...prev.symptoms, symptom],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    await addFarmer({
      ...formData,
    });

    onClose();
  };

  const handleFillDemo = () => {
    setFormData({
      name: 'Hemanta Borah',
      age: 48,
      gender: 'Male',
      phone: '+91 94355 77120',
      farmerId: 'AGR-AS-3012',
      abhaId: '91-7721-3940-1092',
      village: selectedVillage.name,
      district: selectedVillage.district,
      state: 'Assam',
      farmSize: 3.0,
      primaryCrop: 'Paddy',
      cropVariety: 'Bahadur',
      sowingDate: '2026-06-20',
      soilType: 'Alluvial',
      irrigationType: 'Rainfed',
      dailyOutdoorHours: 6,
      recentPesticideExposure: true,
      pesticideName: 'Chlorpyrifos 20 EC',
      symptoms: ['Dizziness', 'Headache'],
      existingHealthConcerns: 'Mild dehydration history',
      cropGrowthStage: 'Flowering',
      soilMoisture: 'Medium',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Farmer (Kisan Registry)"
      subtitle="Interoperable schema compatible with AgriStack Farmer Registry & ABDM ABHA."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between bg-teal-50 border border-teal-200 p-3 rounded-xl">
          <div className="text-xs text-teal-900">
            <strong>Offline-First Registration:</strong> Record will be securely stored in local
            IndexedDB {isOnline ? 'and synced immediately.' : 'and queued for background sync.'}
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-bold text-teal-800 bg-white border border-teal-300 px-2.5 py-1 rounded-lg hover:bg-teal-100/50 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-500" /> Auto-Fill Demo
          </button>
        </div>

        {/* Section 1: Demographics */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-teal-600" /> 1. Personal & Location Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Das"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min={18}
                max={95}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 94350 XXXXX"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Village Cluster</label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Farm & Crop Profile */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-600" /> 2. Agricultural Profile
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Crop</label>
              <select
                value={formData.primaryCrop}
                onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              >
                <option value="Paddy">Paddy (Rice)</option>
                <option value="Vegetables">Horticulture Vegetables</option>
                <option value="Mustard">Mustard / Oilseeds</option>
                <option value="Maize">Maize</option>
                <option value="Jute">Jute</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Growth Stage</label>
              <select
                value={formData.cropGrowthStage}
                onChange={(e) => setFormData({ ...formData, cropGrowthStage: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              >
                <option value="Tillering">Tillering</option>
                <option value="Flowering">Flowering (Critical)</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Grain Filling">Grain Filling</option>
                <option value="Harvesting">Harvesting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Irrigation Source</label>
              <select
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              >
                <option value="Rainfed">Rainfed</option>
                <option value="Borewell">Borewell</option>
                <option value="Canal">Canal</option>
                <option value="Drip">Drip Irrigation</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Soil Moisture</label>
              <select
                value={formData.soilMoisture}
                onChange={(e) => setFormData({ ...formData, soilMoisture: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              >
                <option value="Low">Low (Drought Stress)</option>
                <option value="Medium">Medium (Optimal)</option>
                <option value="High">High (Humid)</option>
                <option value="Waterlogged">Waterlogged (Fungal Risk)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Occupational Exposure & Health */}
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-600" /> 3. Occupational Exposure & Symptoms
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Daily Outdoor Field Hours (Hours/Day)
              </label>
              <input
                type="number"
                min="0"
                max="14"
                value={formData.dailyOutdoorHours}
                onChange={(e) => setFormData({ ...formData, dailyOutdoorHours: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Recent Pesticide Application?
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="pesticide"
                    checked={formData.recentPesticideExposure === true}
                    onChange={() => setFormData({ ...formData, recentPesticideExposure: true })}
                  />
                  Yes (Exposed)
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="pesticide"
                    checked={formData.recentPesticideExposure === false}
                    onChange={() => setFormData({ ...formData, recentPesticideExposure: false })}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
              Reported Acute Symptoms:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSymptoms.map((symptom) => {
                const isSelected = formData.symptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-rose-600" />}
                    <span>{symptom}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save & Run Initial Assessment
          </button>
        </div>
      </form>
    </Modal>
  );
};
