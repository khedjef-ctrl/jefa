import React, { useState, useEffect } from 'react';
import { 
  AdminAnalyticsData, 
  SubscriptionPlanId, 
  UserProfile 
} from '../types/insurance';
import { 
  ShieldCheck, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  Edit3, 
  Check, 
  Clock, 
  Activity,
  Layers,
  Lock
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserProfile | null;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onClose,
}) => {
  const [stats, setStats] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Manual Override Form
  const [targetEmail, setTargetEmail] = useState('');
  const [overridePlan, setOverridePlan] = useState<SubscriptionPlanId>('agency');
  const [overrideLimit, setOverrideLimit] = useState<number>(-1);
  const [overrideMessage, setOverrideMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('policylens_token') || currentUser?.token;
      const res = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Access denied. You must be an authorized admin.');
      }

      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrative analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOverridePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setOverrideMessage(null);
    try {
      const token = localStorage.getItem('policylens_token') || currentUser?.token;
      const res = await fetch('/api/admin/override-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetEmail,
          newPlan: overridePlan,
          newLimit: Number(overrideLimit),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to override user plan');

      setOverrideMessage(data.message);
      setTargetEmail('');
      fetchStats();
    } catch (err: any) {
      setOverrideMessage(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400 space-y-3">
        <svg className="animate-spin h-6 w-6 text-emerald-400 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p>Loading administrative dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">Administrator Access Required</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white"
        >
          Return to PolicyLens
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">PolicyLens Admin Console</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Executive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational metrics, MRR, subscriptions, rate monitoring, and manual customer overrides.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchStats}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Exit Admin
          </button>
        </div>
      </div>

      {/* 4 Metric Cards: MRR, Active Subs, Total Users, Churn Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Monthly Recurring Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ${stats?.mrr.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block">
            +18.4% this quarter
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Subscriptions</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats?.activeSubscriptions}
          </div>
          <span className="text-[11px] text-slate-400 block">
            Solo & Agency accounts
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Agency Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats?.totalUsers}
          </div>
          <span className="text-[11px] text-slate-400 block">
            Independent agents registered
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Churn Rate</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {stats?.churnRate}%
          </div>
          <span className="text-[11px] text-slate-400 block">
            Trailing 30-day average
          </span>
        </div>
      </div>

      {/* Manual Plan Override for Support Cases */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Customer Support: Manual Plan & Quota Override
          </h3>
        </div>

        {overrideMessage && (
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800 text-xs text-blue-200">
            {overrideMessage}
          </div>
        )}

        <form onSubmit={handleOverridePlan} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Target User Email</label>
            <input
              type="email"
              required
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Assign Plan</label>
            <select
              value={overridePlan}
              onChange={(e) => setOverridePlan(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="free">Free (3 limit, watermark)</option>
              <option value="solo">Solo Agent (20 limit)</option>
              <option value="agency">Small Agency (Unlimited)</option>
              <option value="enterprise">Enterprise (Unlimited + API)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Analyses Limit (-1 for unltd)</label>
            <input
              type="number"
              value={overrideLimit}
              onChange={(e) => setOverrideLimit(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer"
            >
              Update User Plan
            </button>
          </div>
        </form>
      </div>

      {/* Recent Activity: Signups & Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Recent Agency Signups</span>
          </h3>

          <div className="divide-y divide-slate-800 text-xs">
            {stats?.recentSignups.map((u) => (
              <div key={u.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{u.email}</div>
                  <div className="text-[11px] text-slate-400">
                    Plan: <span className="text-emerald-400 font-semibold uppercase">{u.plan}</span> ({u.status})
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Analyses Log */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Recent Comparative Runs</span>
          </h3>

          <div className="divide-y divide-slate-800 text-xs">
            {stats?.recentAnalyses.map((a) => (
              <div key={a.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{a.user_email}</div>
                  <div className="text-[11px] text-slate-400">
                    {a.carriers_count} quotes ({a.carriers.join(', ')})
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500 font-mono">
                  {Math.round(a.token_count || 0)} tokens
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Logs */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Diagnostic Error Logs ({stats?.errorLogs.length || 0})</span>
        </h3>

        {stats?.errorLogs.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No system errors recorded.</p>
        ) : (
          <div className="space-y-2 text-xs">
            {stats?.errorLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-rose-200 flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-rose-400 uppercase font-bold mr-2">[{log.type}]</span>
                  <span>{log.message}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono ml-3">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
