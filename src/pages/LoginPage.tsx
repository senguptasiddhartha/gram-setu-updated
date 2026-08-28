import React, { useState } from 'react';
import {
  Activity,
  Shield,
  HeartPulse,
  Sprout,
  User,
  ArrowRight,
  MapPin,
  Wifi,
  LockKeyhole,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: () => void;
}

const roles: {
  id: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'administrator',
    title: 'Administrator',
    subtitle: 'State & Block Officer',
    description: 'Monitor overall rural health, agriculture and risk intelligence.',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    id: 'health_worker',
    title: 'Health Worker',
    subtitle: 'ASHA / ANM',
    description: 'Screen workers, identify health risks and manage health alerts.',
    icon: <HeartPulse className="w-6 h-6" />,
  },
  {
    id: 'agri_officer',
    title: 'Agriculture Officer',
    subtitle: 'KVK / Extension Expert',
    description: 'Monitor crop risks, farms and agricultural advisories.',
    icon: <Sprout className="w-6 h-6" />,
  },
  {
    id: 'farmer',
    title: 'Farmer',
    subtitle: 'Kisan / Smallholder',
    description: 'View farm risks, health advisories and recommended actions.',
    icon: <User className="w-6 h-6" />,
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { setRole } = useApp();
  const [selectedRole, setSelectedRole] =
    useState<UserRole>('administrator');

  const handleContinue = () => {
    setRole(selectedRole);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-xl shadow-teal-950/40 mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Gram Setu
          </h1>

          <p className="text-teal-400 font-semibold text-sm mt-2">
            Integrated Rural Risk Intelligence
          </p>

          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Interoperable predictive healthcare and agricultural risk
            mitigation for rural communities.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="grid lg:grid-cols-[1fr_1.35fr]">

            {/* Left */}
            <div className="bg-gradient-to-br from-teal-700 to-cyan-800 p-7 sm:p-9 text-white">
              <div className="flex items-center gap-2 text-teal-100 text-xs font-bold uppercase tracking-widest">
                <LockKeyhole className="w-4 h-4" />
                Demo Access
              </div>

              <h2 className="text-2xl font-black mt-5">
                Select your role
              </h2>

              <p className="text-sm text-teal-100 leading-6 mt-3">
                Choose how you want to experience Gram Setu.
                Each role provides a different operational viewpoint
                of the same rural intelligence platform.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10">
                  <Wifi className="w-4 h-4 text-teal-200" />
                  <div>
                    <p className="text-xs font-bold">
                      Low-Bandwidth Ready
                    </p>
                    <p className="text-[10px] text-teal-200 mt-0.5">
                      Designed for rural connectivity
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10">
                  <MapPin className="w-4 h-4 text-teal-200" />
                  <div>
                    <p className="text-xs font-bold">
                      Assam Rural Cluster
                    </p>
                    <p className="text-[10px] text-teal-200 mt-0.5">
                      Borigaon, Morigaon
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-5 border-t border-white/10">
                <p className="text-[10px] text-teal-200">
                  HACKATHON PROOF OF CONCEPT
                </p>
                <p className="text-xs font-bold mt-1">
                  Gram Setu v1.0
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="p-6 sm:p-9">

              <div className="mb-5">
                <h3 className="text-lg font-black text-slate-900">
                  Continue as
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select a demo viewpoint to enter the platform.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {roles.map((role) => {
                  const selected = selectedRole === role.id;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all ${
                        selected
                          ? 'border-teal-500 bg-teal-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            selected
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {role.icon}
                        </div>

                        {selected && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-4">
                        {role.title}
                      </h4>

                      <p className="text-[10px] font-semibold text-teal-600 mt-0.5">
                        {role.subtitle}
                      </p>

                      <p className="text-xs text-slate-500 leading-5 mt-2">
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full mt-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-600/20"
              >
                Enter Gram Setu
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-400 mt-4">
                Demo access • No username or password required
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-5">
          Integrated Rural Risk Intelligence Platform
        </p>
      </div>
    </div>
  );
};