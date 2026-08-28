import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { RiskBadge } from '../components/common/RiskBadge';
import { AddFarmerModal } from './AddFarmerModal';
import {
  Search,
  Filter,
  UserPlus,
  ArrowUpDown,
  MapPin,
  Sprout,
  HeartPulse,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface FarmersPageProps {
  onNavigate: (page: string) => void;
}

export const FarmersPage: React.FC<FarmersPageProps> = ({ onNavigate }) => {
  const { farmers, setSelectedFarmerId, recalculateFarmerRisk } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState('All');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Unique filters
  const villages = ['All', ...Array.from(new Set(farmers.map((f) => f.village)))];
  const crops = ['All', ...Array.from(new Set(farmers.map((f) => f.primaryCrop)))];
  const risks = ['All', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'];

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.phone.includes(searchTerm) ||
      farmer.village.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVillage =
      selectedVillageFilter === 'All' || farmer.village === selectedVillageFilter;
    const matchesCrop =
      selectedCropFilter === 'All' || farmer.primaryCrop === selectedCropFilter;
    const matchesRisk =
      selectedRiskFilter === 'All' || farmer.riskCategory === selectedRiskFilter;

    return matchesSearch && matchesVillage && matchesCrop && matchesRisk;
  });

  const handleSelectFarmer = (id: string) => {
    setSelectedFarmerId(id);
    onNavigate('farmer-detail');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farmer Management (Kisan Registry)"
        subtitle="Low-bandwidth registry connected with AgriStack and ABDM patient records."
        badge={`${farmers.length} Registered Farmers`}
      >
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Farmer</span>
        </button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by farmer name, phone, AgriStack ID, or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                aria-label="Filter by Village"
                value={selectedVillageFilter}
                onChange={(e) => setSelectedVillageFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-700 p-0 focus:ring-0 cursor-pointer"
              >
                {villages.map((v) => (
                  <option key={v} value={v}>
                    Village: {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <Sprout className="w-3.5 h-3.5 text-slate-500" />
              <select
                aria-label="Filter by Crop"
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-700 p-0 focus:ring-0 cursor-pointer"
              >
                {crops.map((c) => (
                  <option key={c} value={c}>
                    Crop: {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <HeartPulse className="w-3.5 h-3.5 text-slate-500" />
              <select
                aria-label="Filter by Risk"
                value={selectedRiskFilter}
                onChange={(e) => setSelectedRiskFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-700 p-0 focus:ring-0 cursor-pointer"
              >
                {risks.map((r) => (
                  <option key={r} value={r}>
                    Risk: {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Farmers Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Farmer Profile</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Primary Crop</th>
                <th className="py-3 px-4">Farm Size</th>
                <th className="py-3 px-4">Occupational Risk</th>
                <th className="py-3 px-4">Crop Vulnerability</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Sync Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No farmers match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer) => (
                  <tr
                    key={farmer.id}
                    onClick={() => handleSelectFarmer(farmer.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{farmer.name}</span>
                        {farmer.recentPesticideExposure && (
                          <span className="w-2 h-2 rounded-full bg-amber-500" title="Recent pesticide exposure" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>{farmer.farmerId}</span>
                        <span>•</span>
                        <span>{farmer.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium">{farmer.village}</div>
                      <div className="text-[11px] text-slate-400">{farmer.district}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{farmer.primaryCrop}</span>
                      <div className="text-[11px] text-slate-500">{farmer.cropGrowthStage}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {farmer.farmSize} acres
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-orange-700">
                          {farmer.heatRiskScore}/100
                        </span>
                        <span className="text-[10px] text-slate-400">({farmer.dailyOutdoorHours}h sun)</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-700">
                          {farmer.cropRiskScore}/100
                        </span>
                        <span className="text-[10px] text-slate-400">({farmer.soilMoisture})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <RiskBadge level={farmer.riskCategory} score={farmer.overallRiskScore} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      {farmer.syncStatus === 'Synced' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Synced
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Clock className="w-3 h-3" /> Local Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectFarmer(farmer.id);
                        }}
                        className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors inline-flex items-center gap-1 font-bold text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddFarmerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
