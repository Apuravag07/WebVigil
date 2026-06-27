"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Globe,
  Plus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { useWebsites } from "@/hooks/useWebsites";
import axios from "axios";
import { API_BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";

type UptimeStatus = "good" | "bad" | "unknown";

// ─── Status helpers ────────────────────────────────────────────────────────

function StatusDot({ status }: { status: UptimeStatus }) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`w-3 h-3 rounded-full flex-shrink-0 ${
          status === "good"
            ? "bg-green-400 animate-pulse-glow-green"
            : status === "bad"
            ? "bg-red-400 animate-pulse-glow-red"
            : "bg-white/20"
        }`}
      />
    </div>
  );
}

function UptimeBars({ ticks }: { ticks: UptimeStatus[] }) {
  return (
    <div className="flex gap-0.5 items-end h-6">
      {ticks.map((tick, i) => (
        <div
          key={i}
          title={tick === "good" ? "Up" : tick === "bad" ? "Down" : "No data"}
          className={`w-3 rounded-sm transition-all duration-200 hover:opacity-100 ${
            tick === "good"
              ? "h-6 bg-green-500/70 hover:bg-green-400"
              : tick === "bad"
              ? "h-6 bg-red-500/70 hover:bg-red-400"
              : "h-3 bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Add Website Modal ─────────────────────────────────────────────────────

function AddWebsiteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (url: string | null) => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError("");
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }
    onClose(url.trim());
    setUrl("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onClose(null)}
      />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Add New Monitor</h2>
          </div>
          <button
            onClick={() => onClose(null)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
              Website URL
            </label>
            <input
              type="url"
              autoFocus
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all duration-200 text-sm"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {error && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          <p className="text-xs text-white/30">
            We&apos;ll check this URL every 60 seconds from our validator network.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onClose(null)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-colors border border-white/8"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 shadow-lg hover:shadow-violet-500/25"
          >
            Start Monitoring
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Processed Website Type ────────────────────────────────────────────────

interface ProcessedWebsite {
  id: string;
  url: string;
  status: UptimeStatus;
  uptimePercentage: number;
  lastChecked: string;
  uptimeTicks: UptimeStatus[];
  avgLatency: number;
}

// ─── Website Card ──────────────────────────────────────────────────────────

function WebsiteCard({
  website,
  onDelete,
}: {
  website: ProcessedWebsite;
  onDelete: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div
      className={`glass rounded-2xl border transition-all duration-300 ${
        website.status === "good"
          ? "border-white/8 hover:border-green-500/20"
          : website.status === "bad"
          ? "border-red-500/20 hover:border-red-500/40"
          : "border-white/8"
      }`}
    >
      {/* Card header */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-white/2 transition-colors rounded-2xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <StatusDot status={website.status} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm truncate max-w-[280px]">
                {website.url}
              </h3>
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${
                  website.status === "good"
                    ? "bg-green-500/15 text-green-400"
                    : website.status === "bad"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {website.status === "good"
                  ? "Operational"
                  : website.status === "bad"
                  ? "Outage"
                  : "Pending"}
              </span>
              <span className="text-xs text-white/30 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {website.lastChecked}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4 flex-shrink-0">
          {/* Uptime percentage */}
          <div className="text-right hidden sm:block">
            <div
              className={`text-lg font-black ${
                website.uptimePercentage >= 99
                  ? "gradient-text-green"
                  : website.uptimePercentage >= 95
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {website.uptimePercentage.toFixed(1)}%
            </div>
            <div className="text-[10px] text-white/30 uppercase tracking-wide">uptime</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(true);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="text-white/30">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/5">
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
                Last 30 minutes
              </p>
              <UptimeBars ticks={website.uptimeTicks} />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center glass rounded-xl p-3">
                <div className={`text-lg font-black ${website.uptimePercentage >= 99 ? "gradient-text-green" : "text-yellow-400"}`}>
                  {website.uptimePercentage.toFixed(2)}%
                </div>
                <div className="text-[10px] text-white/30 mt-0.5">Uptime</div>
              </div>
              <div className="text-center glass rounded-xl p-3">
                <div className="text-lg font-black text-white/80">
                  {website.avgLatency > 0 ? `${website.avgLatency}ms` : "—"}
                </div>
                <div className="text-[10px] text-white/30 mt-0.5">Avg Latency</div>
              </div>
              <div className="text-center glass rounded-xl p-3">
                <div className="text-lg font-black text-white/80">{website.uptimeTicks.filter(t => t === "good").length}/10</div>
                <div className="text-[10px] text-white/30 mt-0.5">Windows Up</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {isDeleting && (
        <div className="px-4 pb-4 border-t border-red-500/20">
          <div className="mt-4 glass rounded-xl p-4 border border-red-500/20">
            <p className="text-sm text-white/70 mb-3">Remove this monitor?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/8 transition-colors"
              >
                Keep it
              </button>
              <button
                onClick={() => {
                  onDelete(website.id);
                  setIsDeleting(false);
                }}
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 transition-colors"
              >
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { websites, refreshWebsites, isLoading, error } = useWebsites();
  const { getToken } = useAuth();

  const processedWebsites: ProcessedWebsite[] = useMemo(() => {
    return websites.map((website) => {
      const sortedTicks = [...website.ticks].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentTicks = sortedTicks.filter(
        (tick) => new Date(tick.createdAt) > thirtyMinutesAgo
      );

      // 10 x 3-minute windows
      const windows: UptimeStatus[] = Array.from({ length: 10 }, (_, i) => {
        const windowStart = new Date(Date.now() - (i + 1) * 3 * 60 * 1000);
        const windowEnd = new Date(Date.now() - i * 3 * 60 * 1000);
        const windowTicks = recentTicks.filter((tick) => {
          const t = new Date(tick.createdAt);
          return t >= windowStart && t < windowEnd;
        });
        if (windowTicks.length === 0) return "unknown";
        const upCount = windowTicks.filter((t) => t.status === "Good").length;
        return upCount / windowTicks.length >= 0.5 ? "good" : "bad";
      });

      // Reverse so oldest → newest left to right
      windows.reverse();

      const totalTicks = sortedTicks.length;
      const upTicks = sortedTicks.filter((t) => t.status === "Good").length;
      const uptimePercentage = totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100;
      const currentStatus = windows[windows.length - 1] ?? "unknown";
      const lastChecked = sortedTicks[0]
        ? new Date(sortedTicks[0].createdAt).toLocaleTimeString()
        : "Never";

      const latencies = sortedTicks.slice(0, 10).map((t) => t.latency).filter(Boolean);
      const avgLatency =
        latencies.length > 0
          ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
          : 0;

      return {
        id: website.id,
        url: website.url,
        status: currentStatus,
        uptimePercentage,
        lastChecked,
        uptimeTicks: windows,
        avgLatency,
      };
    });
  }, [websites]);

  // Summary stats
  const stats = useMemo(() => {
    const total = processedWebsites.length;
    const up = processedWebsites.filter((w) => w.status === "good").length;
    const down = processedWebsites.filter((w) => w.status === "bad").length;
    const avgUptime =
      total > 0
        ? processedWebsites.reduce((acc, w) => acc + w.uptimePercentage, 0) / total
        : 100;
    return { total, up, down, avgUptime };
  }, [processedWebsites]);

  const handleAddWebsite = useCallback(
    async (url: string | null) => {
      setIsModalOpen(false);
      if (!url) return;
      try {
        const token = await getToken();
        await axios.post(
          `${API_BACKEND_URL}/api/v1/website`,
          { url },
          { headers: { Authorization: token } }
        );
        await refreshWebsites();
      } catch (err) {
        console.error("[Dashboard] Failed to add website:", err);
      }
    },
    [getToken, refreshWebsites]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const token = await getToken();
        await axios.delete(`${API_BACKEND_URL}/api/v1/website`, {
          headers: { Authorization: token },
          data: { websiteId: id },
        });
        await refreshWebsites();
      } catch (err) {
        console.error("[Dashboard] Failed to delete website:", err);
      }
    },
    [getToken, refreshWebsites]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient orb */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto pt-24 pb-16 px-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Monitors</h1>
            <p className="text-sm text-white/40 mt-0.5">
              {stats.total === 0
                ? "No websites monitored yet"
                : `${stats.total} website${stats.total !== 1 ? "s" : ""} monitored`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshWebsites}
              className="w-9 h-9 rounded-xl glass border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-violet-500/30 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-violet-500/25"
            >
              <Plus className="w-4 h-4" />
              Add Monitor
            </button>
          </div>
        </div>

        {/* Stats row */}
        {stats.total > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              {
                label: "Total",
                value: stats.total,
                icon: <Activity className="w-4 h-4" />,
                color: "text-white/80",
              },
              {
                label: "Operational",
                value: stats.up,
                icon: <CheckCircle2 className="w-4 h-4" />,
                color: "text-green-400",
              },
              {
                label: "Outages",
                value: stats.down,
                icon: <AlertCircle className="w-4 h-4" />,
                color: "text-red-400",
              },
              {
                label: "Avg Uptime",
                value: `${stats.avgUptime.toFixed(1)}%`,
                icon: <TrendingUp className="w-4 h-4" />,
                color: stats.avgUptime >= 99 ? "text-green-400" : "text-yellow-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="glass rounded-xl p-4 border border-white/8 text-center"
              >
                <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-wide mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-4 border border-white/8 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="h-4 bg-white/10 rounded w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : processedWebsites.length === 0 ? (
          /* Empty state */
          <div className="glass rounded-3xl p-16 border border-white/8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/20">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No monitors yet</h2>
            <p className="text-sm text-white/40 max-w-sm mx-auto mb-8">
              Add your first website to start monitoring. We&apos;ll check it every 60 seconds
              from our global validator network.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-violet-500/25"
            >
              <Plus className="w-4 h-4" />
              Add Your First Website
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {processedWebsites.map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AddWebsiteModal isOpen={isModalOpen} onClose={handleAddWebsite} />
    </div>
  );
}