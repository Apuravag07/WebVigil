"use client";
import React from "react";
import {
  Activity,
  Bell,
  Clock,
  Server,
  ArrowRight,
  Check,
  Globe,
  Shield,
  Zap,
  BarChart3,
  ChevronRight,
  Cpu,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Ambient background orbs ───────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] animate-float" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] animate-float-delayed" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-600/8 blur-[100px] animate-float-slow" />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-medium text-violet-300 border border-violet-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Decentralized · Trustless · Always On
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-5xl md:text-7xl font-black leading-[1.05] tracking-tight animate-fade-in-up-delay-1">
            Know Before
            <br />
            <span className="gradient-text text-glow">Your Users Do</span>
          </h1>

          <p className="mt-6 text-center text-lg md:text-xl text-white/50 max-w-2xl mx-auto animate-fade-in-up-delay-2">
            A decentralized network of validators monitors your websites every minute
            from multiple locations worldwide. Get instant alerts — before your
            users notice downtime.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up-delay-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-violet-500/30 glow-violet-sm group"
            >
              Start Monitoring Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 glass hover:bg-white/8 text-white/80 hover:text-white font-medium rounded-xl transition-all duration-200 border border-white/8"
            >
              How It Works
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in-up-delay-3">
            {[
              { label: "Uptime SLA", value: "99.9%" },
              { label: "Check Interval", value: "60s" },
              { label: "Global Nodes", value: "∞" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Hero visual — mock dashboard card */}
          <div className="mt-20 max-w-3xl mx-auto animate-fade-in-up-delay-3">
            <div className="glass-strong rounded-2xl p-6 border border-white/8 glow-violet">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-white/30 font-mono">webvigil / dashboard</span>
              </div>
              <div className="space-y-3">
                {[
                  { url: "api.myapp.com", status: "good", uptime: "100.0", ticks: [1,1,1,1,1,1,1,1,1,1] },
                  { url: "myapp.com", status: "good", uptime: "99.8", ticks: [1,1,1,0,1,1,1,1,1,1] },
                  { url: "cdn.myapp.com", status: "bad", uptime: "97.2", ticks: [1,1,0,0,1,1,0,1,1,1] },
                ].map((site) => (
                  <div
                    key={site.url}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          site.status === "good"
                            ? "bg-green-400 animate-pulse-glow-green"
                            : "bg-red-400 animate-pulse-glow-red"
                        }`}
                      />
                      <span className="text-sm font-mono text-white/80">{site.url}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex gap-0.5">
                        {site.ticks.map((t, i) => (
                          <div
                            key={i}
                            className={`w-2 h-5 rounded-sm ${
                              t ? "bg-green-500/70" : "bg-red-500/70"
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${site.status === "good" ? "text-green-400" : "text-red-400"}`}>
                        {site.uptime}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Features</span>
            <h2 className="mt-3 text-4xl font-black text-white">
              Everything you need,{" "}
              <span className="gradient-text">nothing you don&apos;t</span>
            </h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              Built for developers who care about reliability and transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Bell className="w-5 h-5" />,
                title: "Instant Alerts",
                description:
                  "Get notified the moment your service goes down via email, Slack, or webhook — before customers notice.",
                color: "from-violet-500 to-purple-600",
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: "Global Validators",
                description:
                  "A decentralized network of independent validators checks your site from multiple regions simultaneously.",
                color: "from-indigo-500 to-blue-600",
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: "60-Second Checks",
                description:
                  "Your website is monitored every minute, 24/7. Never miss a downtime event, no matter how brief.",
                color: "from-cyan-500 to-teal-600",
              },
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: "Uptime Analytics",
                description:
                  "Visualize uptime history, latency trends, and performance over time with detailed reports.",
                color: "from-emerald-500 to-green-600",
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: "Tamper-Proof Records",
                description:
                  "Validator results are cryptographically signed. No central party can manipulate your uptime data.",
                color: "from-orange-500 to-red-600",
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Latency Tracking",
                description:
                  "Measure response times from each validator node and identify performance regressions early.",
                color: "from-yellow-500 to-amber-600",
              },
            ].map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Architecture</span>
            <h2 className="mt-3 text-4xl font-black text-white">
              How <span className="gradient-text">It Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Server className="w-6 h-6" />,
                title: "Add Your Website",
                description: "Paste your URL into the dashboard. No DNS changes or agent installs required.",
              },
              {
                step: "02",
                icon: <Cpu className="w-6 h-6" />,
                title: "Validators Check It",
                description: "Independent validator nodes around the world ping your URL every 60 seconds and sign their results.",
              },
              {
                step: "03",
                icon: <Activity className="w-6 h-6" />,
                title: "You Get Notified",
                description: "If a validator detects downtime, you receive an instant alert with latency data and status history.",
              },
            ].map((step, i) => (
              <div key={step.step} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%_-_16px)] w-8 border-t border-dashed border-white/15" />
                )}
                <div className="glass rounded-2xl p-6 border border-white/8 hover:border-violet-500/30 transition-colors duration-300">
                  <div className="text-xs font-black text-violet-500/50 font-mono mb-4">{step.step}</div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/50">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Pricing</span>
            <h2 className="mt-3 text-4xl font-black text-white">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h2>
            <p className="mt-4 text-white/50">
              Start free. Scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              title="Starter"
              price="0"
              description="Perfect for side projects"
              features={["5 monitors", "60s check interval", "Email alerts", "7-day history"]}
            />
            <PricingCard
              title="Pro"
              price="29"
              description="For production applications"
              features={[
                "50 monitors",
                "30s check interval",
                "Email + Slack + Webhook",
                "Unlimited team members",
                "90-day history",
                "API access",
              ]}
              featured
            />
            <PricingCard
              title="Enterprise"
              price="99"
              description="For mission-critical systems"
              features={[
                "Unlimited monitors",
                "15s check interval",
                "Priority support",
                "Custom SLA",
                "1-year history",
                "Dedicated nodes",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-strong rounded-3xl p-12 text-center border border-violet-500/20 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-900/30 to-indigo-900/20" />
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-violet-600/20 blur-[60px]" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Start monitoring <span className="gradient-text">for free</span>
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of developers who trust WebVigil to keep their services online.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-200 shadow-2xl hover:shadow-violet-500/30 text-lg group"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-white">WebVigil</span>
              </div>
              <p className="text-sm text-white/40">
                Decentralized uptime monitoring powered by a global validator network.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "API Docs", "Changelog"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Security"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} WebVigil. All rights reserved.
            </p>
            <p className="text-xs text-white/20">
              Built with Next.js · Secured by Solana cryptography
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="group glass rounded-2xl p-6 border border-white/8 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  description,
  features,
  featured = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? "bg-gradient-to-b from-violet-600 to-indigo-700 border border-violet-400/30 shadow-2xl shadow-violet-500/20"
          : "glass border border-white/8 hover:border-violet-500/20"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-black px-3 py-1 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}
      <div className="mb-6">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <p className={`text-xs mt-1 ${featured ? "text-white/70" : "text-white/40"}`}>{description}</p>
        <div className="mt-4 flex items-end gap-1">
          <span className="text-4xl font-black text-white">${price}</span>
          {price !== "0" && (
            <span className={`text-sm mb-1 ${featured ? "text-white/60" : "text-white/40"}`}>/mo</span>
          )}
          {price === "0" && (
            <span className={`text-sm mb-1 ${featured ? "text-white/60" : "text-white/40"}`}>forever</span>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                featured ? "bg-white/20" : "bg-violet-500/20"
              }`}
            >
              <Check className={`w-2.5 h-2.5 ${featured ? "text-white" : "text-violet-400"}`} />
            </div>
            <span className={`text-sm ${featured ? "text-white/90" : "text-white/60"}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/dashboard"
        className={`w-full py-3 rounded-xl font-semibold text-sm text-center transition-all duration-200 ${
          featured
            ? "bg-white text-violet-700 hover:bg-white/90"
            : "glass border border-white/10 text-white hover:bg-white/8"
        }`}
      >
        {price === "0" ? "Start for Free" : "Get Started"}
      </Link>
    </div>
  );
}