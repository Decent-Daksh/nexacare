import { Megaphone, Send, Users, MessageCircle, Mail, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCRM } from '../hooks/useCRM';
import { useAuth } from '../lib/auth'; // Added for role check[cite: 1]
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

const channelIcon = { WhatsApp: MessageCircle, SMS: Send, Email: Mail };

export default function CRMOutreach() {
  const { role } = useAuth(); // Access the current user role[cite: 1]
  const { campaigns, recallQueue, npsData, loading, error, refetch } = useCRM();
  
  if (loading) return <LoadingSpinner/>;
  if (error) return <ErrorState message={error} onRetry={refetch}/>;

  const totalSent = campaigns.reduce((s,c) => s + c.sent, 0);
  const totalBooked = campaigns.reduce((s,c) => s + c.booked, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">CRM & Outreach</h1>
        <p className="text-sm text-muted-foreground mt-1">WhatsApp/SMS/Email campaigns, recall queues and NPS pulse.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Megaphone} label="Active Campaigns" value={campaigns.filter(c=>c.status==='Active').length} accent="brand"/>
        <StatCard icon={Send}      label="Messages Sent"    value={totalSent.toLocaleString('en-IN')} accent="info"/>
        <StatCard icon={Users}     label="Bookings Driven"  value={totalBooked} delta="+22%" accent="brand"/>
        <StatCard icon={Clock}     label="Recalls Pending"  value={recallQueue.length} accent="warn"/>
      </div>

      <div>
        <h3 className="font-display font-semibold mb-3">Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map(c => {
            const Icon = channelIcon[c.channel] || Send;
            const conv = c.sent ? Math.round((c.booked / c.sent) * 100) : 0;
            return (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4 card-lift">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary text-[var(--brand)] flex items-center justify-center"><Icon size={16}/></div>
                    <div>
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.channel} • {c.audience} recipients</div>
                    </div>
                  </div>
                  <Badge variant={c.status === 'Active' ? 'success' : c.status === 'Draft' ? 'default' : 'info'}>{c.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-surface rounded-lg p-2"><div className="font-semibold text-base">{c.sent}</div><div className="text-muted-foreground">Sent</div></div>
                  <div className="bg-surface rounded-lg p-2"><div className="font-semibold text-base">{c.opened}</div><div className="text-muted-foreground">Opened</div></div>
                  <div className="bg-surface rounded-lg p-2"><div className="font-semibold text-base">{c.booked}</div><div className="text-muted-foreground">Booked</div></div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--brand)]" style={{ width: `${conv}%` }}></div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">{conv}% conv.</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border"><h3 className="font-display font-semibold">Recall queue</h3></div>
          <div className="divide-y divide-border">
            {recallQueue.map(r => (
              <div key={r.patientId} className="p-4 flex items-center gap-3">
                {/* Condition: Hide Avatar when role is manager[cite: 1] */}
                {role !== 'manager' && <Avatar name={r.patientName} size={36}/>}
                <div className="flex-1">
                  {/* Condition: Mask patient name when role is manager[cite: 1] */}
                  <div className="font-medium text-sm">
                    {role === 'manager' ? '——' : r.patientName}
                  </div>
                  <div className="text-xs text-muted-foreground">{r.reason} • due in {r.dueIn}</div>
                </div>
                <Badge variant={r.priority === 'High' ? 'danger' : r.priority === 'Medium' ? 'warning' : 'info'}>{r.priority}</Badge>
                <button className="text-xs px-3 py-1.5 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)]">Send</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-semibold mb-2">NPS Distribution</h3>
          <p className="text-xs text-muted-foreground mb-3">Last 30 days • 248 responses</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={npsData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {npsData.map((d, i) => <Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {npsData.map(n => (
              <div key={n.rating} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{background: n.color}}></span>{n.rating}</div>
                <div className="font-mono font-semibold">{n.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}