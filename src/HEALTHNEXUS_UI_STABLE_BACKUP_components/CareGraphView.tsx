import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Brain,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  Filter,
  GitBranch,
  Heart,
  Info,
  Pill,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import { CareGraphEdge, CareGraphNode, Patient } from '../types';

interface CareGraphViewProps {
  patient: Patient;
  graphData: { nodes: CareGraphNode[]; edges: CareGraphEdge[] };
}

export const CareGraphView: React.FC<CareGraphViewProps> = ({
  patient,
  graphData,
}) => {
  const [selectedNode, setSelectedNode] = useState<CareGraphNode>(graphData.nodes[0]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const nodeTypeConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
    patient: { label: 'Patient Core', bg: 'bg-[#168A6A]', text: 'text-white', border: 'border-[#168A6A]', icon: User },
    condition: { label: 'Condition', bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', border: 'border-[#F59E0B]/40', icon: Heart },
    medication: { label: 'Medication', bg: 'bg-[#E8F7F1]', text: 'text-[#168A6A]', border: 'border-[#168A6A]/30', icon: Pill },
    lab: { label: 'Lab Biomarker', bg: 'bg-[#FEE2E2]', text: 'text-[#DC5A5A]', border: 'border-[#DC5A5A]/30', icon: FileSpreadsheet },
    symptom: { label: 'Symptom', bg: 'bg-[#EAF4FB]', text: 'text-[#3B82C4]', border: 'border-[#3B82C4]/30', icon: Activity },
    mental: { label: 'Mental Well-Being', bg: 'bg-[#F3E8FF]', text: 'text-[#9333EA]', border: 'border-[#9333EA]/30', icon: Brain },
    risk: { label: 'Risk Factor', bg: 'bg-[#FEE2E2]', text: 'text-[#DC5A5A]', border: 'border-[#DC5A5A]/40', icon: AlertCircle },
    recommendation: { label: 'Recommendation', bg: 'bg-[#E8F7F1]', text: 'text-[#168A6A]', border: 'border-[#168A6A]/40', icon: Sparkles },
  };

  const filteredNodes =
    activeFilter === 'all'
      ? graphData.nodes
      : graphData.nodes.filter((n) => n.type === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5EAEA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-[#168A6A]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#16302A]">
              CAREGRAPH &bull; Multi-Node Health Journey Map
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Interactive relational network mapping how Patient History, Medications, Labs, Symptoms, and Mental Stress connect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-[#E8F7F1] text-[#168A6A] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{graphData.nodes.length} Connected Nodes</span>
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E5EAEA] shadow-xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#64748B] mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Nodes:</span>
        </span>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-[#168A6A] text-white shadow-xs'
              : 'bg-[#F8FAFA] text-[#64748B] hover:bg-[#E8F7F1]'
          }`}
        >
          All Nodes ({graphData.nodes.length})
        </button>
        {Object.entries(nodeTypeConfig).map(([type, cfg]) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === type
                ? 'bg-[#168A6A] text-white shadow-xs'
                : 'bg-[#F8FAFA] text-[#64748B] hover:bg-[#E8F7F1]'
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Node Canvas & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Graph Canvas Grid */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs min-h-[460px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5EAEA]">
              <span className="text-xs font-bold text-[#16302A]">Interactive Node Topology</span>
              <span className="text-xs text-[#64748B]">Click any node to inspect relationship pathway</span>
            </div>

            {/* Grid of Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {filteredNodes.map((node) => {
                const config = nodeTypeConfig[node.type] || nodeTypeConfig.patient;
                const Icon = config.icon;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                      isSelected
                        ? 'ring-2 ring-[#168A6A] shadow-md scale-[1.02] bg-[#E8F7F1]/20'
                        : 'bg-[#F8FAFA] border-[#E5EAEA] hover:border-[#168A6A]/50 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${config.bg} ${config.text}`}>
                          {config.label}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#168A6A]" />
                      </div>
                      <h4 className="font-bold text-xs text-[#16302A] leading-snug">{node.label}</h4>
                    </div>

                    <p className="text-[10px] text-[#64748B] mt-2 line-clamp-2">{node.details}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5EAEA] flex items-center justify-between text-xs text-[#64748B]">
            <span>Showing connected topology for <strong>{patient.name}</strong></span>
            <span className="text-[#168A6A] font-semibold">Graph is dynamically synchronized</span>
          </div>
        </div>

        {/* Selected Node Details & Connected Edges */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E5EAEA] shadow-xs space-y-5 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#E5EAEA]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                  Selected Node Inspector
                </span>
                <h3 className="font-bold text-base text-[#16302A]">{selectedNode.label}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F7F1] text-[#168A6A]">
                  Type: {selectedNode.type.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Clinical Details & Rationale
                </span>
                <p className="text-xs text-[#16302A] font-medium leading-relaxed bg-[#F8FAFA] p-3 rounded-xl border border-[#E5EAEA]">
                  {selectedNode.details}
                </p>
              </div>

              {/* Connected Relationships */}
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                  Connected Edge Relationships
                </span>
                <div className="space-y-2">
                  {graphData.edges
                    .filter((e) => e.from === selectedNode.id || e.to === selectedNode.id)
                    .map((edge, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#F8FAFA] border border-[#E5EAEA] text-xs text-[#16302A] flex items-center justify-between"
                      >
                        <span className="font-semibold text-[#64748B]">
                          {edge.from === selectedNode.id ? 'Outbound' : 'Inbound'} &rarr;
                        </span>
                        <span className="font-mono font-bold text-[11px] text-[#168A6A]">
                          {edge.relationship.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#64748B] text-xs">
              Select any node in the graph to inspect its clinical connections.
            </div>
          )}

          <div className="p-3 rounded-xl bg-[#E8F7F1]/50 border border-[#168A6A]/20 text-[11px] text-[#16302A]">
            <strong>Whole Health Insight:</strong> The graph visualizes how mental stress nodes directly trigger sympathovagal drive on the hypertension condition node.
          </div>
        </div>
      </div>
    </div>
  );
};
