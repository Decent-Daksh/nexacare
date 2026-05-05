import { useState } from 'react';
import { Mic, Square, FileText, Stethoscope, Pill, Sparkles, RotateCcw } from 'lucide-react';
import AIBadge from '../components/ui/AIBadge';
import Tabs from '../components/ui/Tabs';
import Badge from '../components/ui/Badge';
import { useCoPilot } from '../hooks/useCoPilot';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SAMPLE = `Patient came in with persistent dry cough for the past 5 days. Reports mild fever and fatigue. No chest pain. Has history of seasonal allergies. On examination throat appears mildly red, chest is clear. Vitals stable.`;

export default function AICoPilot() {
  const [tab, setTab] = useState('soap');
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState(SAMPLE);
  const { soap, diagnosis, prescription, loading, generateSOAP } = useCoPilot();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">AI Co-Pilot <AIBadge/></h1>
        <p className="text-sm text-muted-foreground mt-1">Live consultation transcription with AI-drafted SOAP notes, differential Dx and prescription suggestions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-display font-semibold">Live Transcript</h3>
              <p className="text-xs text-muted-foreground">Auto-captured from in-room mic</p>
            </div>
            <button
              onClick={() => setRecording(!recording)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                recording ? 'bg-[var(--danger)] text-white' : 'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]'
              }`}
            >
              {recording ? <><Square size={14}/>Stop</> : <><Mic size={14}/>Record</>}
            </button>
          </div>
          <div className="p-5">
            {recording && (
              <div className="flex items-center gap-2 text-xs text-[var(--danger)] mb-3">
                <span className="w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse"></span>
                Recording • 02:14
              </div>
            )}
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              className="w-full h-72 bg-surface rounded-lg p-4 text-sm outline-none resize-none border border-border focus:border-[var(--brand)] transition-colors"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => generateSOAP(transcript)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--ai)] text-white rounded-lg text-sm font-medium hover:opacity-90"><Sparkles size={14}/>Generate AI Notes</button>
              <button onClick={() => setTranscript(SAMPLE)} className="px-3 py-2 bg-surface border border-border rounded-lg text-sm hover:bg-surface-alt"><RotateCcw size={14}/></button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden border-l-4 border-l-[var(--ai)]">
          <div className="px-5 pt-4">
            <div className="flex items-center gap-2 mb-3"><AIBadge label="AI Output" /><span className="text-xs text-muted-foreground">Always review before saving</span></div>
            <Tabs
              active={tab}
              onChange={setTab}
              tabs={[
                { value: 'soap', label: 'SOAP Notes' },
                { value: 'dx', label: 'Diagnosis' },
                { value: 'rx', label: 'Prescription' },
              ]}
            />
          </div>
          <div className="p-5 min-h-[420px]">
            {loading && <LoadingSpinner label="AI thinking…"/>}
            {!loading && !soap && (
              <div className="text-center text-sm text-muted-foreground py-16">
                <Sparkles className="mx-auto text-[var(--ai)] mb-3" size={28}/>
                Click <strong>Generate AI Notes</strong> to draft SOAP, diagnosis and prescription.
              </div>
            )}
            {!loading && soap && tab === 'soap' && (
              <div className="space-y-4 text-sm">
                {[
                  { k: 'Subjective', v: soap.subjective, icon: FileText },
                  { k: 'Objective',  v: soap.objective,  icon: Stethoscope },
                  { k: 'Assessment', v: soap.assessment, icon: Sparkles },
                  { k: 'Plan',       v: soap.plan,       icon: Pill },
                ].map(s => (
                  <div key={s.k}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[var(--brand-active)] mb-1">
                      <s.icon size={12}/>{s.k}
                    </div>
                    <div className="text-foreground bg-surface rounded-lg p-3 leading-relaxed">{s.v}</div>
                  </div>
                ))}
              </div>
            )}
            {!loading && diagnosis.length > 0 && tab === 'dx' && (
              <div className="space-y-3">
                {diagnosis.map(d => (
                  <div key={d.code} className="bg-surface rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-mono text-muted-foreground">{d.code}</div>
                        <div className="font-medium text-sm">{d.label}</div>
                      </div>
                      <Badge variant={d.confidence > 0.6 ? 'success' : d.confidence > 0.4 ? 'warning' : 'default'}>
                        {(d.confidence*100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--ai)]" style={{ width: `${d.confidence*100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && prescription.length > 0 && tab === 'rx' && (
              <div className="space-y-2">
                {prescription.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 bg-surface rounded-lg p-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary text-[var(--brand)] flex items-center justify-center"><Pill size={14}/></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{r.drug}</div>
                      <div className="text-xs text-muted-foreground">{r.dose} • {r.frequency} • {r.duration}</div>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-3 px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)]">Save & Print Prescription</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
