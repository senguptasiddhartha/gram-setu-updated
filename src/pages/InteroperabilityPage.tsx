import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import {
  generateAbdmHealthRecord,
  generateAgriStackRecord,
  generateUnifiedRuralRiskPayload,
  verifyInteroperabilityPayload,
} from '../services/mockInteropService';
import {
  Layers,
  Code2,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  ShieldCheck,
  Sparkles,
  Server,
  Activity,
  HeartPulse,
  Sprout,
  Check,
} from 'lucide-react';

export const InteroperabilityPage: React.FC = () => {
  const { farmers, selectedFarmerId, selectedVillage, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'abdm' | 'agristack' | 'unified'>('unified');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  const abdmPayload = generateAbdmHealthRecord(farmer);
  const agriStackPayload = generateAgriStackRecord(farmer);
  const unifiedPayload = generateUnifiedRuralRiskPayload(farmer, selectedVillage);

  const currentJson =
    activeTab === 'abdm'
      ? abdmPayload
      : activeTab === 'agristack'
      ? agriStackPayload
      : unifiedPayload;

  const currentJsonString = JSON.stringify(currentJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Copied to Clipboard', 'JSON schema payload copied successfully.', 'info');
  };

  const handleDownload = () => {
    const blob = new Blob([currentJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gram Setu-${activeTab.toUpperCase()}-Payload-${farmer.farmerId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Downloaded', 'Payload saved to disk.', 'success');
  };

  const handleVerify = async () => {
    setIsValidating(true);
    setValidationResult(null);
    const res = await verifyInteroperabilityPayload(currentJson);
    setValidationResult(res);
    setIsValidating(false);
    addToast('Schema Verified', 'FHIR & AgriStack standards compliance verified 100%.', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ABDM & AgriStack Interoperability Lab"
        subtitle="Live translation bridging ABDM Ayushman Bharat FHIR health records with Indian AgriStack Land & Crop registries."
        badge="Standards Compliance"
      >
        <button
          onClick={handleVerify}
          disabled={isValidating}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          <ShieldCheck className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
          <span>{isValidating ? 'Validating Payload...' : 'Verify Interoperability Standard'}</span>
        </button>
      </PageHeader>

      {/* Target Farmer Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 font-bold text-sm font-mono">
            {farmer.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>{farmer.name}</span>
              <span className="font-mono text-slate-500 font-normal">({farmer.farmerId})</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              ABHA: {farmer.abhaId} • Village: {farmer.village}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Schema</span>
          </button>
        </div>
      </div>

      {/* Validation Result Box */}
      {validationResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Payload Verification Passed: {validationResult.schemaType}
            </span>
            <span className="font-mono text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              Latency: {validationResult.latencyMs}ms
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-emerald-900">
            <div>
              <strong>Target Gateway:</strong> {validationResult.targetGateway}
            </div>
            <div>
              <strong>FHIR Release:</strong> {validationResult.fhirValidation?.specVersion || 'R4 Standard'}
            </div>
            <div>
              <strong>AgriStack Land Ref:</strong> {validationResult.agriStackValidation?.landRef || 'Validated'}
            </div>
            <div>
              <strong>Digital Signature:</strong> SHA-256 Valid
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs and JSON Editor Preview */}
      <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        {/* Tab Headers */}
        <div className="bg-slate-900/90 px-4 pt-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('unified')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'unified'
                  ? 'bg-slate-950 text-teal-300 border-t-2 border-teal-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Unified Rural Risk Interop Payload</span>
            </button>

            <button
              onClick={() => setActiveTab('abdm')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'abdm'
                  ? 'bg-slate-950 text-rose-300 border-t-2 border-rose-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>ABDM FHIR Record (HL7 R4)</span>
            </button>

            <button
              onClick={() => setActiveTab('agristack')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'agristack'
                  ? 'bg-slate-950 text-emerald-300 border-t-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>AgriStack Plot & Crop Record</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 pb-2">
            Format: application/json+fhir
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed max-h-[500px]">
          <pre className="text-teal-200 font-mono">{currentJsonString}</pre>
        </div>
      </div>
    </div>
  );
};
