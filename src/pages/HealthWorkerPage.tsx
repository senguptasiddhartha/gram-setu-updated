import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { Modal } from '../components/common/Modal';
import {
  HeartPulse,
  Users,
  AlertTriangle,
  Send,
  Database,
  Mic,
  MicOff,
  Plus,
  ThermometerSun,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface HealthWorkerPageProps {
  onNavigate: (page: string) => void;
}

export const HealthWorkerPage: React.FC<HealthWorkerPageProps> = ({ onNavigate }) => {
  const {
    healthScreenings,
    farmers,
    selectedVillage,
    addHealthScreening,
    isOnline,
    addToast,
  } = useApp();

  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    farmerId: farmers[0]?.id || 'farmer-101',
    farmerName: farmers[0]?.name || 'Ramesh Das',
    village: selectedVillage.name || 'Borigaon',
    healthWorkerName: 'Mina Das (ASHA-04)',
    bodyTemperature: 38.2,
    systolicBP: 136,
    diastolicBP: 86,
    pulseRate: 88,
    outdoorWorkHours: 6,
    waterIntakeLiters: 1.5,
    pesticideExposure: true,
    pesticideExposureDetails: 'Chlorpyrifos 20% EC foliar application without respirator mask',
    dizziness: true,
    fatigue: true,
    headache: true,
    nausea: true,
    breathingDifficulty: false,
    skinRash: false,
    muscleCramps: true,
    symptomDuration: 'Since yesterday noon',
    clinicalNotes: 'Patient exhibits marked dehydration with heat exhaustion symptoms following 6h field work under 39°C sun. Elevated core temperature.',
    referralRequired: true,
    referralFacility: 'Morigaon Model Hospital / PHC',
  });

  // Handle Speech Recognition using browser Web Speech API
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast(
        'Web Speech API',
        'Speech recognition is not natively supported in this browser. You can type notes directly.',
        'warning'
      );
      return;
    }

    if (isListeningSpeech) {
      setIsListeningSpeech(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListeningSpeech(true);
        addToast('Voice Entry Started', 'Listening... Please speak patient symptoms clearly.', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData((prev) => ({
          ...prev,
          clinicalNotes: prev.clinicalNotes
            ? `${prev.clinicalNotes} ${transcript}`
            : transcript,
        }));
        addToast('Voice Captured', `Transcribed: "${transcript}"`, 'success');
        setIsListeningSpeech(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListeningSpeech(false);
        addToast('Voice Entry', 'Speech input ended. You can continue typing notes.', 'info');
      };

      recognition.onend = () => {
        setIsListeningSpeech(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListeningSpeech(false);
    }
  };

  const handleFarmerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fId = e.target.value;
    const f = farmers.find((farm) => farm.id === fId);
    if (f) {
      setFormData((prev) => ({
        ...prev,
        farmerId: f.id,
        farmerName: f.name,
        village: f.village,
        outdoorWorkHours: f.dailyOutdoorHours,
        pesticideExposure: f.recentPesticideExposure,
      }));
    }
  };

  const handleSubmitScreening = async (e: React.FormEvent) => {
    e.preventDefault();
    await addHealthScreening({
      ...formData,
      screeningDate: new Date().toISOString(),
    });
    setIsScreeningModalOpen(false);
  };

  const highRiskScreenings = healthScreenings.filter(
    (hs) => hs.riskCategory === 'HIGH' || hs.riskCategory === 'CRITICAL'
  );
  const pendingReferrals = healthScreenings.filter((hs) => hs.referralRequired);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health Worker Module (ASHA / ANM Workspace)"
        subtitle="Offline-capable clinical screening, heat-stress triage, and occupational health monitoring."
        badge="Community Health Hub"
      >
        <button
          onClick={() => setIsScreeningModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Health Screening</span>
        </button>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <StatCard
          title="Assigned Households"
          value="312"
          subtext="Borigaon Sector 4"
          icon={<Users className="w-4 h-4" />}
          iconBg="bg-teal-50 text-teal-700 border-teal-200"
        />
        <StatCard
          title="Today's Screenings"
          value={healthScreenings.length}
          subtext="Vitals & Heat triage"
          icon={<HeartPulse className="w-4 h-4" />}
          iconBg="bg-rose-50 text-rose-700 border-rose-200"
        />
        <StatCard
          title="High-Risk Cases"
          value={highRiskScreenings.length}
          subtext="Score > 60 requiring care"
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBg="bg-amber-50 text-amber-700 border-amber-200"
        />
        <StatCard
          title="Pending Referrals"
          value={pendingReferrals.length}
          subtext="To Morigaon PHC"
          icon={<Send className="w-4 h-4" />}
          iconBg="bg-purple-50 text-purple-700 border-purple-200"
        />
        <StatCard
          title="Offline Records"
          value={healthScreenings.filter((h) => h.isOfflineCreated).length}
          subtext="Stored in Dexie DB"
          icon={<Database className="w-4 h-4" />}
          iconBg="bg-slate-50 text-slate-700 border-slate-200"
        />
      </div>

      {/* Screenings Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-600" />
              Recent Field Health Screenings
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated with deterministic heat stress and chemical toxicity algorithms.
            </p>
          </div>
          <button
            onClick={() => setIsScreeningModalOpen(true)}
            className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            + Add Screening
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Patient / Farmer</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Vitals</th>
                <th className="py-3 px-4">Exposure</th>
                <th className="py-3 px-4">Clinical Symptoms</th>
                <th className="py-3 px-4">Heat Stress</th>
                <th className="py-3 px-4">Overall Category</th>
                <th className="py-3 px-4">Referral</th>
                <th className="py-3 px-4">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {healthScreenings.map((screening) => (
                <tr key={screening.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{screening.farmerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      By: {screening.healthWorkerName}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-700">{screening.village}</td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{screening.bodyTemperature}°C</div>
                    {screening.systolicBP && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        BP: {screening.systolicBP}/{screening.diastolicBP}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">
                      {screening.outdoorWorkHours}h sun
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {screening.waterIntakeLiters}L water/day
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {screening.dizziness && (
                        <span className="text-[10px] bg-rose-50 text-rose-800 font-semibold px-1.5 py-0.2 rounded border border-rose-200">
                          Dizziness
                        </span>
                      )}
                      {screening.nausea && (
                        <span className="text-[10px] bg-rose-50 text-rose-800 font-semibold px-1.5 py-0.2 rounded border border-rose-200">
                          Nausea
                        </span>
                      )}
                      {screening.headache && (
                        <span className="text-[10px] bg-orange-50 text-orange-800 font-semibold px-1.5 py-0.2 rounded border border-orange-200">
                          Headache
                        </span>
                      )}
                      {!screening.dizziness && !screening.nausea && !screening.headache && (
                        <span className="text-slate-400 italic text-[11px]">None</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-orange-700">
                    {screening.heatStressScore}/100
                  </td>

                  <td className="py-3 px-4">
                    <RiskBadge level={screening.riskCategory} score={screening.overallHealthScore} size="sm" />
                  </td>

                  <td className="py-3 px-4">
                    {screening.referralRequired ? (
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        PHC Referral
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Routine</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {screening.syncStatus === 'Synced' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Synced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                        <Clock className="w-3 h-3 text-amber-600" /> Stored Locally
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Health Screening Modal */}
      <Modal
        isOpen={isScreeningModalOpen}
        onClose={() => setIsScreeningModalOpen(false)}
        title="Record New Health Screening"
        subtitle="Low-bandwidth offline triage with browser Web Speech voice input."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitScreening} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Farmer *</label>
              <select
                value={formData.farmerId}
                onChange={handleFarmerSelect}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.village}) - {f.farmerId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Health Worker Name</label>
              <input
                type="text"
                value={formData.healthWorkerName}
                onChange={(e) => setFormData({ ...formData, healthWorkerName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Vitals */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Physical Vitals & Hydration
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Body Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bodyTemperature}
                  onChange={(e) =>
                    setFormData({ ...formData, bodyTemperature: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Outdoor Sun (Hours)</label>
                <input
                  type="number"
                  value={formData.outdoorWorkHours}
                  onChange={(e) =>
                    setFormData({ ...formData, outdoorWorkHours: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Water Intake (Liters)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.waterIntakeLiters}
                  onChange={(e) =>
                    setFormData({ ...formData, waterIntakeLiters: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Pressure</label>
                <input
                  type="text"
                  placeholder="130/85"
                  value={`${formData.systolicBP}/${formData.diastolicBP}`}
                  onChange={(e) => {
                    const parts = e.target.value.split('/');
                    if (parts.length === 2) {
                      setFormData({
                        ...formData,
                        systolicBP: Number(parts[0]) || 120,
                        diastolicBP: Number(parts[1]) || 80,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Symptoms Checkboxes */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Heat & Toxicity Symptoms
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dizziness}
                  onChange={(e) => setFormData({ ...formData, dizziness: e.target.checked })}
                />
                <span className="font-semibold">Dizziness / Vertigo</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.fatigue}
                  onChange={(e) => setFormData({ ...formData, fatigue: e.target.checked })}
                />
                <span className="font-semibold">Severe Fatigue</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.headache}
                  onChange={(e) => setFormData({ ...formData, headache: e.target.checked })}
                />
                <span className="font-semibold">Throbbing Headache</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.nausea}
                  onChange={(e) => setFormData({ ...formData, nausea: e.target.checked })}
                />
                <span className="font-semibold">Nausea / Vomiting</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.muscleCramps}
                  onChange={(e) => setFormData({ ...formData, muscleCramps: e.target.checked })}
                />
                <span className="font-semibold">Muscle Cramps</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pesticideExposure}
                  onChange={(e) =>
                    setFormData({ ...formData, pesticideExposure: e.target.checked })
                  }
                />
                <span className="font-semibold text-amber-800">Pesticide Exposure</span>
              </label>
            </div>
          </div>

          {/* Voice Input UI & Clinical Notes */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Clinical Symptom Notes
              </label>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isListeningSpeech
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100'
                }`}
              >
                {isListeningSpeech ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Stop Voice Entry</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-teal-600" />
                    <span>Start Voice Entry</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={3}
              value={formData.clinicalNotes}
              onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
              placeholder="Speak using microphone or type symptom observations..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.referralRequired}
                onChange={(e) => setFormData({ ...formData, referralRequired: e.target.checked })}
              />
              <span>Escalate / Refer to Primary Health Centre (PHC)</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScreeningModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Save Screening
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
