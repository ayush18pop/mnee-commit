"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Book, Code, Shield, Coins, Users, Clock, Check, Zap, Scale, AlertTriangle, GitBranch, Database, Bot, Globe, Terminal, FileCode, Settings, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";

const sections = [
  { id: "overview", title: "Overview", icon: Book },
  { id: "discord", title: "Discord Integration", icon: Bot },
  { id: "concepts", title: "Core Concepts", icon: GitBranch },
  { id: "contract", title: "Smart Contract", icon: FileCode },
  { id: "lifecycle", title: "Commitment Lifecycle", icon: Clock },
  { id: "economics", title: "Economic Model", icon: Scale },
  { id: "security", title: "Security Model", icon: Shield },
  { id: "deployment", title: "Deployment Guide", icon: Terminal },
  { id: "testing", title: "Testing", icon: Settings },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = React.useState("overview");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -60% 0%" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#020202]">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[#666666] hover:text-[#a0a0a0] transition-colors mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            
            <h1 className="text-5xl lg:text-6xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
              Commit <span className="italic text-[#c9a227]">Protocol</span>
            </h1>
            <p className="text-[#888888] text-xl max-w-3xl mb-2">
              Optimistic Agentic Settlement for On-Chain Work Commitments with Discord Integration
            </p>
            <p className="text-[#666666] text-lg max-w-3xl">
              Complete Technical Specification v2.0
            </p>
            
            {/* Version badge */}
            <div className="flex items-center gap-4 mt-6">
              <span className="px-3 py-1 bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.2)] rounded-sm text-[#c9a227] text-xs font-mono">
                WHITEPAPER
              </span>
              <span className="text-[#444444] text-xs">
                Last updated: January 2026
              </span>
            </div>
          </motion.div>

          <div className="flex gap-12">
            {/* Sidebar Navigation */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block w-56 flex-shrink-0"
            >
              <nav className="sticky top-32 space-y-1">
                <p className="text-[8px] text-[#444444] uppercase tracking-[0.3em] mb-4 pl-3">
                  Table of Contents
                </p>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center gap-2 py-2 px-3 rounded-sm text-sm transition-all duration-300 ${
                      activeSection === section.id
                        ? "text-[#c9a227] bg-[rgba(201,162,39,0.08)]"
                        : "text-[#666666] hover:text-[#a0a0a0]"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </a>
                ))}
              </nav>
            </motion.aside>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 max-w-4xl"
            >
              {/* ==================== OVERVIEW ==================== */}
              <section id="overview" className="mb-24">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-6">
                  Overview
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      What is Commit Protocol?
                    </h3>
                    <p className="text-[#888888] leading-relaxed mb-4">
                      Commit Protocol is a <span className="text-[#e8e8e8]">trustless escrow system</span> for work commitments that combines:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { icon: Coins, text: "Smart contract escrow (MNEE ERC-20 on Ethereum)" },
                        { icon: Bot, text: "Discord server integration (prepaid balance)" },
                        { icon: Zap, text: "AI-powered verification (automated review)" },
                        { icon: Clock, text: "Optimistic settlement (auto-release via cron)" },
                        { icon: Scale, text: "Dynamic economic security (reputation-based)" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-[#888888] bg-[#0a0a0a] p-3 rounded-sm border border-[rgba(255,255,255,0.04)]">
                          <item.icon className="w-4 h-4 text-[#c9a227] mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Token Info */}
                  <Card variant="warm" padding="lg">
                    <CardContent>
                      <h4 className="text-lg font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                        MNEE Token
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        {[
                          { label: "Token", value: "MNEE" },
                          { label: "Network", value: "Ethereum" },
                          { label: "Standard", value: "ERC-20" },
                          { label: "Decimals", value: "18" },
                        ].map((item) => (
                          <div key={item.label}>
                            <p className="text-[8px] text-[#444444] uppercase tracking-[0.2em] mb-1">{item.label}</p>
                            <p className="text-[#e8e8e8] font-mono text-sm">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between bg-[#020202] p-3 rounded-sm">
                        <code className="text-xs font-mono text-[#888888]">0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF</code>
                        <a href="https://etherscan.io/token/0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" target="_blank" rel="noopener noreferrer" className="text-[#c9a227]">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-[10px] text-[#444444] mt-2">Testing: Fork mainnet using Anvil (no testnet available)</p>
                    </CardContent>
                  </Card>

                  {/* Problem / Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card variant="minimal" padding="lg">
                      <CardContent>
                        <h4 className="text-lg font-[family-name:var(--font-display)] text-[#ef4444] mb-4">
                          Problem Statement
                        </h4>
                        <div className="space-y-2 text-sm text-[#888888]">
                          {[
                            "Manual payment releases (slow, requires multisig)",
                            "Separate payment wallets per user (complex UX)",
                            "Subjective \"done\" definitions (endless disputes)",
                            "Fixed dispute costs (wrong scale for tasks)",
                            "No reputation tracking (same treatment for all)",
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-[#ef4444]">✗</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card variant="warm" padding="lg">
                      <CardContent>
                        <h4 className="text-lg font-[family-name:var(--font-display)] text-[#22c55e] mb-4">
                          Solution
                        </h4>
                        <div className="space-y-2 text-sm text-[#888888]">
                          {[
                            "Discord server registration (15 MNEE)",
                            "Prepaid balance (one MNEE pool per server)",
                            "Secure relayer pattern (bot verifies roles)",
                            "Automatic settlement via cron job",
                            "AI verification defines objective criteria",
                            "Dynamic stakes scale with value & reputation",
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-[#22c55e]">✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* ==================== DISCORD INTEGRATION ==================== */}
              <section id="discord" className="mb-24">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-6">
                  Discord Integration
                </h2>
                
                <div className="space-y-8">
                  {/* Registration Flow */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Registration Flow
                    </h3>
                    <Card variant="glass" padding="lg">
                      <CardContent>
                        <div className="space-y-4 font-mono text-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-[#5865F2]">Admin</span>
                            <ArrowRight className="w-4 h-4 text-[#444444]" />
                            <span className="text-[#888888]">/register-server</span>
                            <ArrowRight className="w-4 h-4 text-[#444444]" />
                            <span className="text-[#c9a227]">Bot</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[#c9a227]">Bot</span>
                            <ArrowRight className="w-4 h-4 text-[#444444]" />
                            <span className="text-[#888888]">Please approve 15 MNEE</span>
                            <ArrowRight className="w-4 h-4 text-[#444444]" />
                            <span className="text-[#5865F2]">Admin</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[#5865F2]">Admin</span>
                            <ArrowRight className="w-4 h-4 text-[#444444]" />
                            <span className="text-[#888888]">registerServer(guildId, adminId)</span>
                            <ArrowRight className="w-4 h-4 text-[#444444]" />
                            <span className="text-[#22c55e]">Contract</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[#22c55e]">Contract</span>
                            <ArrowRight className="w-4 h-4 text-[#444444]" />
                            <span className="text-[#888888]">Transfer 15 MNEE → Store data → Emit event</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[#c9a227]">Bot</span>
                            <ArrowRight className="w-4 h-4 text-[#444444]" />
                            <span className="text-[#22c55e]">✓ Registered! Deposit MNEE to start</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Balance Management */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Balance Management
                    </h3>
                    <p className="text-[#888888] mb-4">
                      Each Discord server has a prepaid MNEE balance tracked on-chain:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[rgba(255,255,255,0.08)]">
                            <th className="text-left py-3 px-4 text-[#666666] font-normal">Field</th>
                            <th className="text-left py-3 px-4 text-[#666666] font-normal">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[rgba(255,255,255,0.04)]">
                            <td className="py-3 px-4 font-mono text-[#c9a227]">totalDeposited</td>
                            <td className="py-3 px-4 text-[#888888]">Lifetime MNEE deposited (never decreases)</td>
                          </tr>
                          <tr className="border-b border-[rgba(255,255,255,0.04)]">
                            <td className="py-3 px-4 font-mono text-[#c9a227]">totalSpent</td>
                            <td className="py-3 px-4 text-[#888888]">Lifetime MNEE spent on commitments</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-mono text-[#c9a227]">availableBalance</td>
                            <td className="py-3 px-4 text-[#888888]">Current spendable balance</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-[#666666] mt-3 font-mono">
                      Invariant: availableBalance = totalDeposited - totalSpent
                    </p>
                  </div>

                  {/* Role-Based Access */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Role-Based Access Control
                    </h3>
                    <p className="text-[#888888] mb-4">
                      The protocol uses <span className="text-[#e8e8e8]">Discord roles</span> verified off-chain by the bot:
                    </p>
                    <div className="space-y-3">
                      {[
                        { role: "Server Admin", id: "adminDiscordId", desc: "Registered during server registration. Can deposit/withdraw MNEE balance.", color: "#ef4444" },
                        { role: "commit-creator", id: "Discord role", desc: "Configured in Discord server settings. Can create commitments using server balance. Bot verifies role before contract call.", color: "#c9a227" },
                        { role: "Contributors", id: "Any user", desc: "Any Discord user with linked wallet. Can submit work and receive payments.", color: "#22c55e" },
                      ].map((item) => (
                        <Card key={item.role} variant="minimal" padding="md">
                          <CardContent className="flex items-start gap-4">
                            <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: item.color }} />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-sm text-[#e8e8e8]">{item.role}</span>
                                <span className="text-[10px] text-[#444444] bg-[#0a0a0a] px-2 py-0.5 rounded-sm">{item.id}</span>
                              </div>
                              <p className="text-sm text-[#666666]">{item.desc}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ==================== CORE CONCEPTS ==================== */}
              <section id="concepts" className="mb-24">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-6">
                  Core Concepts
                </h2>
                
                <div className="space-y-8">
                  <p className="text-[#888888] leading-relaxed">
                    The protocol is built on four foundational principles:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Prepaid Escrow", desc: "Servers fund a balance upfront. Commitments deduct from this pool, eliminating per-transaction approvals.", icon: Coins },
                      { title: "Optimistic Settlement", desc: "Work is assumed valid unless disputed. Auto-settles after deadline + dispute window.", icon: Clock },
                      { title: "Relayer Pattern", desc: "Bot wallet is the sole caller. Verifies Discord permissions off-chain, executes on-chain.", icon: Shield },
                      { title: "Dynamic Stakes", desc: "Dispute costs scale with task value and participant reputation. Fair for all sizes.", icon: Scale },
                    ].map((item) => (
                      <Card key={item.title} variant="warm" padding="lg">
                        <CardContent>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-sm bg-[rgba(201,162,39,0.15)] flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-[#c9a227]" />
                            </div>
                            <h4 className="font-[family-name:var(--font-display)] text-[#e8e8e8]">{item.title}</h4>
                          </div>
                          <p className="text-sm text-[#888888]">{item.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>

              {/* ==================== SMART CONTRACT ==================== */}
              <section id="contract" className="mb-24">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-6">
                  Smart Contract Specification
                </h2>
                
                <div className="space-y-8">
                  {/* Data Structures */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Data Structures
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card variant="glass" padding="md">
                        <CardContent>
                          <h4 className="font-mono text-sm text-[#c9a227] mb-3">ServerData</h4>
                          <div className="space-y-1 text-xs font-mono text-[#888888]">
                            <p>uint256 <span className="text-[#666666]">guildId</span></p>
                            <p>uint256 <span className="text-[#666666]">adminDiscordId</span></p>
                            <p>bool <span className="text-[#666666]">isActive</span></p>
                            <p>uint256 <span className="text-[#666666]">registeredAt</span></p>
                            <p>uint256 <span className="text-[#666666]">totalDeposited</span></p>
                            <p>uint256 <span className="text-[#666666]">totalSpent</span></p>
                            <p>uint256 <span className="text-[#666666]">availableBalance</span></p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card variant="glass" padding="md">
                        <CardContent>
                          <h4 className="font-mono text-sm text-[#c9a227] mb-3">CommitmentData</h4>
                          <div className="space-y-1 text-xs font-mono text-[#888888]">
                            <p>address <span className="text-[#666666]">creator</span> <span className="text-[#444444]">// relayer</span></p>
                            <p>address <span className="text-[#666666]">contributor</span></p>
                            <p>address <span className="text-[#666666]">token</span></p>
                            <p>uint256 <span className="text-[#666666]">amount</span></p>
                            <p>uint256 <span className="text-[#666666]">deadline</span></p>
                            <p>uint256 <span className="text-[#666666]">disputeWindow</span></p>
                            <p>string <span className="text-[#666666]">specCid</span></p>
                            <p>string <span className="text-[#666666]">evidenceCid</span></p>
                            <p>State <span className="text-[#666666]">state</span></p>
                            <p>uint256 <span className="text-[#666666]">createdAt</span></p>
                            <p>uint256 <span className="text-[#666666]">submittedAt</span></p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Core Interface */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Core Interface
                    </h3>
                    <Card variant="minimal" padding="lg">
                      <CardContent>
                        <p className="text-[8px] text-[#444444] uppercase tracking-[0.2em] mb-4">SERVER MANAGEMENT</p>
                        <div className="space-y-2 font-mono text-xs text-[#888888] mb-6">
                          <p><span className="text-[#c9a227]">registerServer</span>(uint256 _guildId, uint256 _adminDiscordId)</p>
                          <p><span className="text-[#c9a227]">depositToServer</span>(uint256 _guildId, uint256 _amount)</p>
                          <p><span className="text-[#c9a227]">withdrawFromServer</span>(uint256 _guildId, address _to, uint256 _amount)</p>
                        </div>

                        <p className="text-[8px] text-[#444444] uppercase tracking-[0.2em] mb-4">COMMITMENT LIFECYCLE</p>
                        <div className="space-y-2 font-mono text-xs text-[#888888] mb-6">
                          <p><span className="text-[#c9a227]">createCommitment</span>(guildId, contributor, token, amount, deadline, disputeWindow, specCid)</p>
                          <p><span className="text-[#c9a227]">submitWork</span>(uint256 _guildId, uint256 _commitId, string _evidenceCid)</p>
                          <p><span className="text-[#c9a227]">openDispute</span>(uint256 _guildId, uint256 _commitId)</p>
                        </div>

                        <p className="text-[8px] text-[#444444] uppercase tracking-[0.2em] mb-4">SETTLEMENT (RELAYER ONLY)</p>
                        <div className="space-y-2 font-mono text-xs text-[#888888] mb-6">
                          <p><span className="text-[#c9a227]">settle</span>(uint256 _commitId)</p>
                          <p><span className="text-[#c9a227]">batchSettle</span>(uint256[] _commitIds)</p>
                        </div>

                        <p className="text-[8px] text-[#444444] uppercase tracking-[0.2em] mb-4">ARBITRATION</p>
                        <div className="space-y-2 font-mono text-xs text-[#888888]">
                          <p><span className="text-[#c9a227]">resolveDispute</span>(uint256 _commitId, bool _favorContributor)</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Events */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Key Events
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "ServerRegistered(guildId, adminDiscordId)",
                        "ServerDeposited(guildId, amount, newBalance)",
                        "ServerWithdrew(guildId, to, amount)",
                        "CommitmentCreated(commitId, creator, contributor, ...)",
                        "WorkSubmitted(commitId, evidenceCid, timestamp)",
                        "CommitmentSettled(commitId, recipient, amount)",
                      ].map((event) => (
                        <div key={event} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-sm px-3 py-2">
                          <code className="text-xs font-mono text-[#888888]">{event}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ==================== LIFECYCLE ==================== */}
              <section id="lifecycle" className="mb-24">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-6">
                  Commitment Lifecycle
                </h2>
                
                <div className="space-y-8">
                  {/* State Machine */}
                  <Card variant="warm" padding="lg">
                    <CardContent>
                      <p className="text-[8px] text-[#444444] uppercase tracking-[0.2em] mb-4">State Machine</p>
                      <div className="font-mono text-sm text-[#888888] space-y-2">
                        <p><span className="text-[#666666]">[*]</span> → <span className="text-[#c9a227]">FUNDED</span> <span className="text-[#444444]">createCommitment()</span></p>
                        <p><span className="text-[#c9a227]">FUNDED</span> → <span className="text-[#c9a227]">SUBMITTED</span> <span className="text-[#444444]">submitWork()</span></p>
                        <p><span className="text-[#c9a227]">SUBMITTED</span> → <span className="text-[#ef4444]">DISPUTED</span> <span className="text-[#444444]">openDispute() [within window]</span></p>
                        <p><span className="text-[#c9a227]">SUBMITTED</span> → <span className="text-[#22c55e]">SETTLED</span> <span className="text-[#444444]">batchSettle() [after window]</span></p>
                        <p><span className="text-[#ef4444]">DISPUTED</span> → <span className="text-[#22c55e]">SETTLED</span> <span className="text-[#444444]">resolveDispute(CONTRIBUTOR)</span></p>
                        <p><span className="text-[#ef4444]">DISPUTED</span> → <span className="text-[#888888]">REFUNDED</span> <span className="text-[#444444]">resolveDispute(CREATOR)</span></p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* State Definitions */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      State Definitions
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[rgba(255,255,255,0.08)]">
                            <th className="text-left py-3 px-4 text-[#666666] font-normal">State</th>
                            <th className="text-left py-3 px-4 text-[#666666] font-normal">Description</th>
                            <th className="text-left py-3 px-4 text-[#666666] font-normal">Trigger</th>
                          </tr>
                        </thead>
                        <tbody className="text-[#888888]">
                          <tr className="border-b border-[rgba(255,255,255,0.04)]">
                            <td className="py-3 px-4 font-mono text-[#c9a227]">FUNDED</td>
                            <td className="py-3 px-4">MNEE deducted from server balance, commitment created</td>
                            <td className="py-3 px-4 font-mono text-xs">Relayer (via bot)</td>
                          </tr>
                          <tr className="border-b border-[rgba(255,255,255,0.04)]">
                            <td className="py-3 px-4 font-mono text-[#c9a227]">SUBMITTED</td>
                            <td className="py-3 px-4">Contributor submitted work + evidence CID</td>
                            <td className="py-3 px-4 font-mono text-xs">Relayer (via bot)</td>
                          </tr>
                          <tr className="border-b border-[rgba(255,255,255,0.04)]">
                            <td className="py-3 px-4 font-mono text-[#ef4444]">DISPUTED</td>
                            <td className="py-3 px-4">Creator opened dispute with required stake</td>
                            <td className="py-3 px-4 font-mono text-xs">Relayer (via bot)</td>
                          </tr>
                          <tr className="border-b border-[rgba(255,255,255,0.04)]">
                            <td className="py-3 px-4 font-mono text-[#22c55e]">SETTLED</td>
                            <td className="py-3 px-4">Funds released to contributor</td>
                            <td className="py-3 px-4 font-mono text-xs">Cron job</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-mono text-[#888888]">REFUNDED</td>
                            <td className="py-3 px-4">Funds returned to server balance</td>
                            <td className="py-3 px-4 font-mono text-xs">Arbitrator</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-[#666666] mt-3">
                      Note: CREATED state is unused — commitments are FUNDED immediately upon creation.
                    </p>
                  </div>
                </div>
              </section>

              {/* ==================== ECONOMICS ==================== */}
              <section id="economics" className="mb-24">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-6">
                  Economic Model
                </h2>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card variant="warm" padding="lg">
                      <CardContent>
                        <h4 className="text-lg font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                          Fee Structure
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#888888]">Server Registration</span>
                            <span className="text-[#e8e8e8] font-mono">15 MNEE</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#888888]">Commitment Creation</span>
                            <span className="text-[#e8e8e8] font-mono">Free*</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#888888]">Work Submission</span>
                            <span className="text-[#e8e8e8] font-mono">Free</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#888888]">Settlement</span>
                            <span className="text-[#e8e8e8] font-mono">Free</span>
                          </div>
                          <p className="text-[10px] text-[#444444] pt-2 border-t border-[rgba(255,255,255,0.04)]">
                            *Deducted from pre-funded server balance
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card variant="warm" padding="lg">
                      <CardContent>
                        <h4 className="text-lg font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                          Dispute Stakes
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#888888]">Base Stake</span>
                            <span className="text-[#e8e8e8] font-mono">10% of amount</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#888888]">Minimum Stake</span>
                            <span className="text-[#e8e8e8] font-mono">1 MNEE</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#888888]">Stake Recipient</span>
                            <span className="text-[#e8e8e8] font-mono">Winner</span>
                          </div>
                          <p className="text-[10px] text-[#444444] pt-2 border-t border-[rgba(255,255,255,0.04)]">
                            Loser forfeits stake to winning party
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* ==================== SECURITY ==================== */}
              <section id="security" className="mb-24">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-6">
                  Security Model
                </h2>
                
                <div className="space-y-8">
                  {/* Security Flow */}
                  <Card variant="glass" padding="lg">
                    <CardContent>
                      <p className="text-[8px] text-[#444444] uppercase tracking-[0.2em] mb-4">Data Flow</p>
                      <div className="font-mono text-sm space-y-2">
                        <p><span className="text-[#5865F2]">User</span> → <span className="text-[#444444]">/command</span> → <span className="text-[#c9a227]">Bot</span></p>
                        <p><span className="text-[#c9a227]">Bot</span> → <span className="text-[#444444]">Check Role</span> → <span className="text-[#5865F2]">Discord API</span></p>
                        <p><span className="text-[#5865F2]">Discord</span> → <span className="text-[#444444]">Role OK</span> → <span className="text-[#c9a227]">Bot</span></p>
                        <p><span className="text-[#c9a227]">Bot</span> → <span className="text-[#444444]">Sign TX</span> → <span className="text-[#888888]">Relayer Wallet</span></p>
                        <p><span className="text-[#888888]">Relayer</span> → <span className="text-[#444444]">Call</span> → <span className="text-[#22c55e]">Smart Contract</span></p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Assumptions */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Trust Assumptions
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: Shield, title: "Bot private key is secure", desc: "The relayer wallet key is the root of trust. It's the only way to call contract." },
                        { icon: Users, title: "Discord API correctly reports roles", desc: "We trust Discord to accurately report user identities and role memberships." },
                        { icon: Code, title: "Contract trusts relayer", desc: "All calls from the relayer address are treated as pre-verified for permissions." },
                      ].map((item) => (
                        <Card key={item.title} variant="minimal" padding="md">
                          <CardContent className="flex items-start gap-4">
                            <item.icon className="w-5 h-5 text-[#c9a227] mt-0.5" />
                            <div>
                              <p className="text-[#e8e8e8] text-sm">{item.title}</p>
                              <p className="text-[#666666] text-xs">{item.desc}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Security Guarantees */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Security Guarantees
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Only registered servers can create commitments",
                        "Only relayer wallet can call protected functions",
                        "Server balance prevents overspending",
                        "No on-chain role storage (reduced gas costs)",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-[#888888]">
                          <Check className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ==================== DEPLOYMENT ==================== */}
              <section id="deployment" className="mb-24">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-6">
                  Deployment Guide
                </h2>
                
                <div className="space-y-8">
                  {/* Prerequisites */}
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Prerequisites
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        "Foundry installed",
                        "Ethereum RPC URL",
                        "MNEE tokens",
                        "Private key",
                      ].map((item) => (
                        <div key={item} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-sm px-3 py-2 text-center">
                          <span className="text-xs text-[#888888]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Local Deployment */}
                  <Card variant="glass" padding="lg">
                    <CardContent>
                      <h4 className="font-mono text-sm text-[#c9a227] mb-4">Local Deployment (Anvil Fork)</h4>
                      <div className="space-y-2 font-mono text-xs text-[#888888] bg-[#020202] p-4 rounded-sm overflow-x-auto">
                        <p><span className="text-[#666666]"># Start Anvil with mainnet fork</span></p>
                        <p>./scripts/start-anvil.sh</p>
                        <p></p>
                        <p><span className="text-[#666666]"># Fund test wallet with MNEE</span></p>
                        <p>./scripts/fund-test-wallet.sh 10000 0xf39F...266</p>
                        <p></p>
                        <p><span className="text-[#666666]"># Deploy contract</span></p>
                        <p>forge script script/DeployLocal.s.sol:DeployLocal \</p>
                        <p>  --rpc-url http://localhost:8545 --broadcast</p>
                        <p></p>
                        <p><span className="text-[#666666]"># Set relayer (bot wallet)</span></p>
                        <p>cast send $CONTRACT &quot;setRelayer(address)&quot; $BOT_WALLET \</p>
                        <p>  --rpc-url http://localhost:8545 --private-key $KEY</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mainnet Deployment */}
                  <Card variant="warm" padding="lg">
                    <CardContent>
                      <h4 className="font-mono text-sm text-[#c9a227] mb-4">Mainnet Deployment</h4>
                      <div className="space-y-2 font-mono text-xs text-[#888888] bg-[#020202] p-4 rounded-sm overflow-x-auto">
                        <p><span className="text-[#666666]"># Configure .env</span></p>
                        <p>ETH_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/KEY</p>
                        <p>PRIVATE_KEY=0x...</p>
                        <p>ARBITRATOR_ADDRESS=0x...</p>
                        <p></p>
                        <p><span className="text-[#666666]"># Deploy and verify</span></p>
                        <p>forge script script/Deploy.s.sol:DeployMainnet \</p>
                        <p>  --rpc-url $ETH_MAINNET_RPC_URL \</p>
                        <p>  --broadcast --verify \</p>
                        <p>  --etherscan-api-key $ETHERSCAN_API_KEY</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* ==================== TESTING ==================== */}
              <section id="testing" className="mb-20">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-6">
                  Testing
                </h2>
                
                <div className="space-y-8">
                  <Card variant="glass" padding="lg">
                    <CardContent>
                      <div className="space-y-2 font-mono text-xs text-[#888888] bg-[#020202] p-4 rounded-sm mb-4">
                        <p><span className="text-[#666666]"># Run all tests</span></p>
                        <p>forge test -vv</p>
                        <p></p>
                        <p><span className="text-[#666666]"># Specific test</span></p>
                        <p>forge test --match-test testRegisterServer -vvvv</p>
                        <p></p>
                        <p><span className="text-[#666666]"># Gas report</span></p>
                        <p>forge test --gas-report</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#e8e8e8] mb-4">
                      Test Coverage
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Server registration (15 MNEE fee)",
                        "Balance deposit/withdrawal",
                        "Commitment creation with deduction",
                        "Insufficient balance protection",
                        "Relayer access control",
                        "Batch settlement",
                        "Admin functions",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-[#888888]">
                          <Check className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="pt-8 border-t border-[rgba(255,255,255,0.04)]">
                    <p className="text-[8px] text-[#444444] uppercase tracking-[0.2em] mb-3">Built With</p>
                    <div className="flex flex-wrap gap-2">
                      {["Solidity", "TypeScript", "Node.js", "Discord.js", "MongoDB", "Foundry", "OpenZeppelin"].map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-sm text-xs text-[#888888]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-8 flex gap-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#1a1a1a] border border-[rgba(201,162,39,0.2)] text-[#e8e8e8] hover:border-[rgba(201,162,39,0.4)] hover:text-white transition-all duration-500"
                    >
                      <Code className="w-4 h-4" />
                      GitHub
                      <ExternalLink className="w-3 h-3 text-[#666666]" />
                    </a>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.3)] text-[#c9a227] hover:bg-[rgba(201,162,39,0.2)] transition-all duration-500"
                    >
                      Register Your DAO
                    </Link>
                  </div>
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
