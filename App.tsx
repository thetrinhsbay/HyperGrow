
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import { 
  Download, Send, Phone, MessageCircle, MapPin, 
  Trash2, Edit, Plus, BrainCircuit, Activity, Search,
  Printer, ShieldCheck, Sparkles, Zap, Copy, ThumbsUp, ThumbsDown,
  CheckCircle, AlertTriangle, PlayCircle, Lock, GraduationCap, X, Save, Cloud, 
  Clock, LayoutDashboard, Users, PenTool, Briefcase, Share2, DollarSign, Settings,
  Target, BarChart3, Fingerprint, Calendar, FileCode, Layers, Radio, Network, Bot, Power
} from 'lucide-react';
import { Layout, menuItems as layoutMenuItems } from './components/Layout';
import { NeonButton, NeonCard, NeonInput, AIActionGrid, AIAction } from './components/UIComponents';
import { MenuItemId, Language, Lead, ChatMessage, User, Interaction, SystemLog } from './types';
import { generateFastContent, generateDeepStrategy, searchBusinessLeadsViaPlaces, generateDeepAnalysis, analyzeAndFixCode, analyzeEcosystem } from './services/geminiService';
import { SpiderWebLogic, initialUser } from './services/systemLogic';
import AIOptimizerDashboard from './components/AIOptimizerDashboard';
import InteractionHeatmap from './components/InteractionHeatmap';

// --- CONFIG: 48 AI FUNCTIONS (12 Menus * 4 Buttons) ---
const AI_MENU_CONFIG: Record<string, AIAction[]> = {
  [MenuItemId.DASHBOARD]: [
    { id: "d1", label: "AI Tóm tắt chỉ số ngày", desc: "Phân tích dữ liệu 24h qua", icon: Activity },
    { id: "d2", label: "AI Dự báo doanh thu", desc: "Tiên đoán dòng tiền 30 ngày tới", icon: DollarSign },
    { id: "d3", label: "AI Phân tích rủi ro", desc: "Cảnh báo lỗ hổng vận hành", icon: AlertTriangle },
    { id: "d4", label: "AI Tối ưu toàn trang", desc: "Quét & Cải thiện UX/UI Realtime", icon: Sparkles }
  ],
  [MenuItemId.LEAD_FINDER]: [
    { id: "l1", label: "AI Quét Data Sâu", desc: "Tìm khách hàng ẩn danh theo vị trí", icon: Search },
    { id: "l2", label: "AI Lọc Lead Scoring", desc: "Chấm điểm tiềm năng khách hàng", icon: Target },
    { id: "l3", label: "AI Tìm Email/SĐT", desc: "Truy xuất thông tin doanh nghiệp", icon: Fingerprint },
    { id: "l4", label: "AI Phân tích đối thủ", desc: "Spy chiến lược quảng cáo đối thủ", icon: Users }
  ],
  [MenuItemId.CRM]: [
    { id: "c1", label: "AI Ghi âm & Note", desc: "Tự động tóm tắt cuộc gọi VoIP", icon: Phone },
    { id: "c2", label: "AI Kịch bản Chốt sale", desc: "Gợi ý câu thoại theo thời gian thực", icon: MessageCircle },
    { id: "c3", label: "AI Nhắc lịch thông minh", desc: "Tự động xếp lịch chăm sóc lại", icon: Calendar },
    { id: "c4", label: "AI Đọc vị cảm xúc", desc: "Phân tích tâm lý khách hàng qua giọng nói", icon: BrainCircuit }
  ],
  [MenuItemId.MARKETING]: [
    { id: "m1", label: "AI Viết bài chuẩn SEO", desc: "Tự động tạo Content 5 phút/lần", icon: PenTool },
    { id: "m2", label: "AI Tạo ảnh Minh họa", desc: "Generative Art cho bài viết", icon: Layers },
    { id: "m3", label: "AI Giật tít Viral", desc: "Tối ưu CTR tiêu đề quảng cáo", icon: Sparkles },
    { id: "m4", label: "AI Auto Booking", desc: "Lên lịch đăng đa kênh tự động", icon: Calendar }
  ],
  [MenuItemId.COACHING]: [
    { id: "cg1", label: "AI Phân tích Kỹ năng", desc: "Tìm lỗ hổng kiến thức nhân sự", icon: GraduationCap },
    { id: "cg2", label: "AI Lộ trình học tập", desc: "Cá nhân hóa bài giảng coaching", icon: PlayCircle },
    { id: "cg3", label: "AI Chấm điểm KPI", desc: "Đánh giá hiệu suất nhân viên", icon: Activity },
    { id: "cg4", label: "AI Roleplay Simulator", desc: "Mô phỏng tình huống khó với AI", icon: Users }
  ],
  [MenuItemId.PROJECTS]: [
    { id: "p1", label: "AI Chia việc tự động", desc: "Phân bổ nguồn lực tối ưu", icon: Users },
    { id: "p2", label: "AI Dự báo Trễ hạn", desc: "Cảnh báo tiến độ dự án", icon: Clock },
    { id: "p3", label: "AI Tóm tắt cuộc họp", desc: "Chuyển Voice sang Action Plan", icon: FileCode },
    { id: "p4", label: "AI Viết Code Fix lỗi", desc: "Tự động kiểm tra & sửa lỗi Code", icon: ShieldCheck }
  ],
  [MenuItemId.AFFILIATES]: [
    { id: "a1", label: "AI Chống gian lận", desc: "Phát hiện click ảo/đơn ảo", icon: ShieldCheck },
    { id: "a2", label: "AI Tính hoa hồng", desc: "Tự động chia sẻ lợi nhuận", icon: DollarSign },
    { id: "a3", label: "AI Gợi ý Chiến dịch", desc: "Đề xuất mức hoa hồng hấp dẫn", icon: Target },
    { id: "a4", label: "AI Tìm kiếm KOLs", desc: "Khớp nhãn hàng với Influencer", icon: Share2 }
  ],
  [MenuItemId.CHATBOT]: [
    { id: "ch1", label: "AI Train dữ liệu riêng", desc: "Học từ tài liệu doanh nghiệp", icon: FileCode },
    { id: "ch2", label: "AI CSKH 24/7", desc: "Trả lời & điều hướng tự động", icon: MessageCircle },
    { id: "ch3", label: "AI Voice Assistant", desc: "Trợ lý ảo điều khiển bằng giọng nói", icon: Radio },
    { id: "ch4", label: "AI Phân tích Hội thoại", desc: "Đánh giá chất lượng tư vấn", icon: Activity }
  ],
  [MenuItemId.FINANCE]: [
    { id: "r1", label: "AI Xuất PDF Siêu đẹp", desc: "Tạo báo cáo thẩm mỹ cao", icon: Printer },
    { id: "r2", label: "AI Cắt giảm chi phí", desc: "Tìm điểm rò rỉ tài chính", icon: DollarSign },
    { id: "r3", label: "AI Dự báo Dòng tiền", desc: "Cashflow Forecast 12 tháng", icon: BarChart3 },
    { id: "r4", label: "AI So sánh Kỳ trước", desc: "Phân tích tăng trưởng YoYo", icon: Activity }
  ],
  [MenuItemId.SETTINGS]: [
    { id: "s1", label: "AI Auto Fix UI", desc: "Tự sửa lỗi hiển thị màn hình", icon: Sparkles },
    { id: "s2", label: "AI Backup Dữ liệu", desc: "Sao lưu an toàn đa điểm", icon: Save },
    { id: "s3", label: "AI Bảo mật tường lửa", desc: "Ngăn chặn tấn công DDoS", icon: ShieldCheck },
    { id: "s4", label: "AI Tối ưu Database", desc: "Dọn dẹp & Index dữ liệu rác", icon: Settings }
  ],
  [MenuItemId.ANALYTICS]: [
    { id: "an1", label: "AI Deep Trend Analysis", desc: "Phân tích xu hướng thị trường sâu", icon: Activity },
    { id: "an2", label: "AI Predict Churn", desc: "Dự báo khách hàng rời bỏ", icon: Users },
    { id: "an3", label: "AI Customer Segmentation", desc: "Phân khúc khách hàng tự động", icon: Target },
    { id: "an4", label: "AI ROI Calculator", desc: "Tính toán hiệu quả đầu tư", icon: DollarSign }
  ],
  [MenuItemId.MINDMAP]: [
    { id: "mm1", label: "AI Generate Branch", desc: "Tự động tạo nhánh ý tưởng mới", icon: Network },
    { id: "mm2", label: "AI Summarize Map", desc: "Tóm tắt sơ đồ thành văn bản", icon: FileCode },
    { id: "mm3", label: "AI Expand Ideas", desc: "Mở rộng ý tưởng từ từ khóa", icon: Zap },
    { id: "mm4", label: "AI Auto-Structure", desc: "Tự động sắp xếp lại sơ đồ đẹp mắt", icon: Layers }
  ]
};


// --- MODALS ---

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { type: 'call' | 'email' | 'meeting', outcome: 'success' | 'failure' | 'neutral', notes: string }) => void;
  leadName: string;
  type: 'call' | 'email' | 'meeting';
}

const InteractionModal: React.FC<InteractionModalProps> = ({ isOpen, onClose, onSave, leadName, type }) => {
  const [outcome, setOutcome] = useState<'success' | 'failure' | 'neutral'>('neutral');
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const notesRef = useRef(notes);
  useEffect(() => { notesRef.current = notes; }, [notes]);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('autosave_interaction_notes');
      if (saved) { setNotes(saved); setLastSaved(new Date()); }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const intervalId = setInterval(() => {
      if (notesRef.current) {
        localStorage.setItem('autosave_interaction_notes', notesRef.current);
        setLastSaved(new Date());
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, [isOpen]);

  const handleClose = () => {
    localStorage.removeItem('autosave_interaction_notes');
    setNotes('');
    setLastSaved(null);
    onClose();
  };

  const handleSaveInternal = () => {
    localStorage.removeItem('autosave_interaction_notes');
    onSave({ type, outcome, notes });
    setNotes('');
    setLastSaved(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-cyan-500 rounded-2xl w-full max-w-md p-6 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 capitalize">
            {type === 'call' ? <Phone size={20} className="text-neon-lime"/> : <MessageCircle size={20} className="text-neon-purple"/>}
            Record {type}
          </h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
        </div>
        <div className="space-y-4">
           <div><div className="text-lg font-bold text-white">{leadName}</div></div>
           <div className="grid grid-cols-3 gap-2">
                 <button onClick={() => setOutcome('success')} className={`p-3 rounded-lg border flex flex-col items-center gap-1 ${outcome === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-slate-700 text-slate-500'}`}><ThumbsUp size={18} /><span className="text-xs font-bold">Success</span></button>
                 <button onClick={() => setOutcome('neutral')} className={`p-3 rounded-lg border flex flex-col items-center gap-1 ${outcome === 'neutral' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-slate-700 text-slate-500'}`}><Clock size={18} /><span className="text-xs font-bold">Neutral</span></button>
                 <button onClick={() => setOutcome('failure')} className={`p-3 rounded-lg border flex flex-col items-center gap-1 ${outcome === 'failure' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-slate-700 text-slate-500'}`}><ThumbsDown size={18} /><span className="text-xs font-bold">Failure</span></button>
           </div>
           <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white h-24" placeholder="Notes..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
           {lastSaved && <div className="text-[10px] text-slate-500 text-right flex items-center justify-end gap-1"><Save size={10}/> Auto-saved at {lastSaved.toLocaleTimeString()}</div>}
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
           <NeonButton variant="blue" size="sm" onClick={handleClose}>Cancel</NeonButton>
           <NeonButton variant="cyan" size="sm" onClick={handleSaveInternal}><Save size={16} /> Save</NeonButton>
        </div>
      </div>
    </div>
  );
};

// --- VIEW COMPONENTS ---

// 1. DASHBOARD
const DashboardView = ({ lang, user, logs, interactions, onAI, aiTaskCount }: { lang: Language, user: User, logs: SystemLog[], interactions: Interaction[], onAI: any, aiTaskCount: number }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  
  const handleAIRun = (id: string) => {
    setLoadingAI(id);
    onAI(id, () => setLoadingAI(null));
  };

  const pieData = [
    { name: 'Success', value: interactions.filter(i => i.outcome === 'success').length },
    { name: 'Neutral', value: interactions.filter(i => i.outcome === 'neutral').length },
    { name: 'Failure', value: interactions.filter(i => i.outcome === 'failure').length },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <AIOptimizerDashboard />
      
      <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.DASHBOARD]} onRun={handleAIRun} loadingId={loadingAI} />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <NeonCard className="h-32 border-cyan-500/30 flex flex-col justify-between">
          <h4 className="text-slate-400 text-sm font-semibold uppercase">KPI Score</h4>
          <span className="text-4xl font-extrabold text-neon-lime">{user.score}</span>
        </NeonCard>
        <NeonCard className="h-32 border-purple-500/30 flex flex-col justify-between">
          <h4 className="text-slate-400 text-sm font-semibold uppercase">Wallet</h4>
          <span className="text-4xl font-extrabold text-neon-magenta">${user.wallet}</span>
        </NeonCard>
        <NeonCard className="h-32 border-yellow-500/30 flex flex-col justify-between">
          <h4 className="text-slate-400 text-sm font-semibold uppercase">AI Auto-Tasks</h4>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-neon-cyan">{aiTaskCount}</span>
            <span className="text-xs text-slate-400 mb-2">Completed</span>
          </div>
        </NeonCard>
        <NeonCard className="h-32 border-blue-500/30 flex flex-col justify-between">
          <h4 className="text-slate-400 text-sm font-semibold uppercase">Interactions</h4>
          <span className="text-xl font-bold text-neon-cyan">{interactions.length} Total</span>
        </NeonCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
           <NeonCard title="Interaction Outcome">
              <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">{pieData.map((e, i) => <Cell key={i} fill={['#06b6d4', '#d946ef', '#ef4444'][i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
           </NeonCard>
           <InteractionHeatmap />
        </div>
        <NeonCard title="System Logs">
           <div className="h-[450px] overflow-y-auto space-y-2 text-xs font-mono">{logs.map(log => <div key={log.id} className="p-1 border-b border-slate-800">[{new Date(log.timestamp).toLocaleTimeString()}] {log.action}</div>)}</div>
        </NeonCard>
      </div>
    </div>
  );
};

// 2. LEAD FINDER
const LeadFinderView = ({ lang, logic, onAI }: { lang: Language, logic: SpiderWebLogic, onAI: any }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAIRun = (id: string) => {
    setLoadingAI(id);
    onAI(id, () => setLoadingAI(null));
  };

  const handleSearch = async () => {
    if (!businessType || !location) return;
    setLoading(true);
    // Call real Places API instead of mock
    const results = await searchBusinessLeadsViaPlaces(businessType, location);
    setLeads(results);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.LEAD_FINDER]} onRun={handleAIRun} loadingId={loadingAI} />
      
      <NeonCard title="Lead Search (Google Places API v1)">
        <div className="flex gap-4 mb-4">
           <NeonInput value={businessType} onChange={e => setBusinessType(e.target.value)} placeholder="Business Type (e.g. Coffee Shop)" />
           <NeonInput value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (e.g. Hanoi)" />
           <NeonButton onClick={handleSearch} disabled={loading}>{loading ? 'Searching...' : <Search />}</NeonButton>
        </div>
        <div className="overflow-x-auto">
           {leads.length === 0 && !loading && <div className="p-4 text-center text-slate-500">No leads found. Try a different query.</div>}
           {leads.length > 0 && (
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-800 text-slate-400"><tr><th className="p-2">Name</th><th className="p-2">Phone</th><th className="p-2">Map</th><th className="p-2">Action</th></tr></thead>
                <tbody>
                   {leads.map(l => (
                      <tr key={l.id} className="border-b border-slate-700">
                         <td className="p-2">
                            <div className="font-bold">{l.name}</div>
                            <div className="text-xs text-slate-400">{l.location}</div>
                         </td>
                         <td className="p-2">
                             {l.phone ? <span className="text-green-400">{l.phone}</span> : <span className="text-slate-500 text-xs italic">N/A</span>}
                         </td>
                         <td className="p-2">
                            <a href={l.notes.replace('Google Maps: ', '')} target="_blank" rel="noreferrer" className="text-cyan-400 underline text-xs">View Map</a>
                         </td>
                         <td className="p-2"><NeonButton size="sm" onClick={() => logic.handleNewLead(l)} disabled={!l.phone}>Add to CRM</NeonButton></td>
                      </tr>
                   ))}
                </tbody>
             </table>
           )}
        </div>
      </NeonCard>
    </div>
  );
};

// 3. CRM
const CRMView = ({ lang, leads, logic, interactions, onAI }: { lang: Language, leads: Lead[], logic: SpiderWebLogic, interactions: Interaction[], onAI: any }) => {
   const [loadingAI, setLoadingAI] = useState<string | null>(null);
   const [showModal, setShowModal] = useState(false);
   const [activeLead, setActiveLead] = useState<Lead|null>(null);
   const [type, setType] = useState<'call'|'email'>('call');

   const handleAIRun = (id: string) => {
    setLoadingAI(id);
    onAI(id, () => setLoadingAI(null));
   };

   const openModal = (lead: Lead, t: 'call'|'email') => { setActiveLead(lead); setType(t); setShowModal(true); };

   return (
      <div className="space-y-6">
         <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.CRM]} onRun={handleAIRun} loadingId={loadingAI} />
         <InteractionModal isOpen={showModal} onClose={() => setShowModal(false)} leadName={activeLead?.name || ''} type={type} onSave={(d) => { if(activeLead) logic.handleInteraction({...d, id: Date.now().toString(), leadId: activeLead.id, userId: 'u1', timestamp: Date.now(), aiSentiment: 50} as Interaction); setShowModal(false); }} />
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leads.length === 0 ? <div className="col-span-3 text-center text-slate-500 p-10 border border-dashed border-slate-700 rounded">No leads in CRM. Use "Lead Hunter" to find and add leads.</div> : 
             leads.map(lead => {
               const leadInteractions = interactions.filter(i => i.leadId === lead.id).slice(0, 3);
               return (
                  <NeonCard key={lead.id} className="relative">
                     <h4 className="font-bold">{lead.name}</h4>
                     <p className="text-sm text-slate-400">{lead.phone || 'No Phone'}</p>
                     
                     {/* Interaction History Mini */}
                     <div className="my-3 space-y-1">
                        {leadInteractions.map(i => (
                           <div key={i.id} className={`text-[10px] p-1 rounded flex justify-between ${i.outcome === 'success' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                              <span>{i.type}</span>
                              <span>{i.outcome}</span>
                           </div>
                        ))}
                     </div>

                     <div className="flex gap-2 mt-4">
                        <NeonButton size="sm" variant="lime" onClick={() => openModal(lead, 'call')} disabled={!lead.phone}>Call</NeonButton>
                        <NeonButton size="sm" variant="purple" onClick={() => openModal(lead, 'email')}>SMS</NeonButton>
                     </div>
                  </NeonCard>
               );
            })}
         </div>
      </div>
   );
};

// 4. MARKETING
const MarketingView = ({ onAI }: { onAI: any }) => {
   const [loadingAI, setLoadingAI] = useState<string | null>(null);
   const handleAIRun = (id: string) => { setLoadingAI(id); onAI(id, () => setLoadingAI(null)); };
   return (
      <div className="space-y-6">
         <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.MARKETING]} onRun={handleAIRun} loadingId={loadingAI} />
         <NeonCard title="Auto Marketing Campaigns">
            <div className="p-10 text-center text-slate-500 border border-dashed border-slate-700 rounded-lg">
               <PenTool size={48} className="mx-auto mb-4 opacity-50"/>
               <p>Active Campaigns: 0</p>
               <p className="text-sm">Use the AI buttons above to generate new viral content.</p>
            </div>
         </NeonCard>
      </div>
   );
};

// 5. COACHING
const CoachingView = ({ lang, user, logic, onAI }: { lang: Language, user: User, logic: SpiderWebLogic, onAI: any }) => {
   const [loadingAI, setLoadingAI] = useState<string | null>(null);
   const handleAIRun = (id: string) => { setLoadingAI(id); onAI(id, () => setLoadingAI(null)); };

   return (
      <div className="space-y-6">
         <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.COACHING]} onRun={handleAIRun} loadingId={loadingAI} />
         {user.pendingTraining.length > 0 ? (
            <div className="space-y-4">
               <h4 className="text-red-400 font-bold flex gap-2"><AlertTriangle /> Mandatory Training</h4>
               {user.pendingTraining.map(t => (
                  <NeonCard key={t} className="flex justify-between items-center border-red-500/50">
                     <span>{t}</span>
                     <NeonButton size="sm" onClick={() => logic.completeTraining(t)}>Start Lesson</NeonButton>
                  </NeonCard>
               ))}
            </div>
         ) : <div className="text-green-400 p-8 border border-green-500/30 rounded bg-green-900/10 text-center">All Systems Go! No pending training.</div>}
      </div>
   );
};

// 6. PROJECTS
const ProjectsView = ({ onAI }: { onAI: any }) => {
   const [loadingAI, setLoadingAI] = useState<string | null>(null);
   const handleAIRun = (id: string) => { setLoadingAI(id); onAI(id, () => setLoadingAI(null)); };
   return (
      <div className="space-y-6">
         <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.PROJECTS]} onRun={handleAIRun} loadingId={loadingAI} />
         <NeonCard title="Active Projects">
            <div className="space-y-4">
               <div className="p-4 bg-slate-800 rounded border-l-4 border-blue-500">
                  <h4 className="font-bold">Website Redesign</h4>
                  <div className="w-full bg-slate-700 h-2 rounded mt-2"><div className="bg-blue-500 h-2 rounded w-3/4"></div></div>
                  <p className="text-xs text-right mt-1">75% Complete</p>
               </div>
               <div className="p-4 bg-slate-800 rounded border-l-4 border-orange-500">
                  <h4 className="font-bold">Q3 Marketing Strategy</h4>
                  <div className="w-full bg-slate-700 h-2 rounded mt-2"><div className="bg-orange-500 h-2 rounded w-1/4"></div></div>
                  <p className="text-xs text-right mt-1">25% Complete</p>
               </div>
            </div>
         </NeonCard>
      </div>
   );
};

// 7. AFFILIATES
const AffiliatesView = ({ onAI }: { onAI: any }) => {
   const [loadingAI, setLoadingAI] = useState<string | null>(null);
   const handleAIRun = (id: string) => { setLoadingAI(id); onAI(id, () => setLoadingAI(null)); };
   return (
      <div className="space-y-6">
         <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.AFFILIATES]} onRun={handleAIRun} loadingId={loadingAI} />
         <div className="grid grid-cols-2 gap-4">
            <NeonCard title="Affiliate Links"><p className="text-2xl font-bold text-orange-400">12 Active</p></NeonCard>
            <NeonCard title="Pending Payouts"><p className="text-2xl font-bold text-green-400">$1,250.00</p></NeonCard>
         </div>
      </div>
   );
};

// 8. CHATBOT (AI Coach / Assistant)
const AICoachView = ({ lang, onAI }: { lang: Language, onAI: any }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const handleAIRun = (id: string) => { setLoadingAI(id); onAI(id, () => setLoadingAI(null)); };
  // ... (Chat UI logic) ...
  return (
     <div className="space-y-6">
        <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.CHATBOT]} onRun={handleAIRun} loadingId={loadingAI} />
        <NeonCard className="h-96 flex items-center justify-center text-slate-500">
           Chatbot Interface (See App.tsx logic for chat implementation)
        </NeonCard>
     </div>
  );
};

// 9. FINANCE
const FinanceView = ({ user, onAI }: { user: User, onAI: any }) => {
   const [loadingAI, setLoadingAI] = useState<string | null>(null);
   const handleAIRun = (id: string) => { setLoadingAI(id); onAI(id, () => setLoadingAI(null)); };
   return (
      <div className="space-y-6">
         <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.FINANCE]} onRun={handleAIRun} loadingId={loadingAI} />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeonCard title="Revenue Stream">
               <ResponsiveContainer width="100%" height={200}><AreaChart data={[{n:'Jan', v:4000},{n:'Feb', v:3000},{n:'Mar', v:5000}]}><Area type="monotone" dataKey="v" stroke="#84cc16" fill="#84cc16" /></AreaChart></ResponsiveContainer>
            </NeonCard>
            <NeonCard title="Expenses">
               <ResponsiveContainer width="100%" height={200}><BarChart data={[{n:'Ops', v:2000},{n:'Ads', v:1500},{n:'Sal', v:3000}]}><Bar dataKey="v" fill="#ef4444" /></BarChart></ResponsiveContainer>
            </NeonCard>
         </div>
      </div>
   );
};

// 10. SETTINGS
const SettingsView = ({ onAI, menuVisibility, onToggleMenu }: { onAI: any, menuVisibility: Record<MenuItemId, boolean>, onToggleMenu: (id: MenuItemId) => void }) => {
   const [loadingAI, setLoadingAI] = useState<string | null>(null);
   const handleAIRun = (id: string) => { setLoadingAI(id); onAI(id, () => setLoadingAI(null)); };
   return (
      <div className="space-y-6">
         <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.SETTINGS]} onRun={handleAIRun} loadingId={loadingAI} />
         
         <NeonCard title="Admin: Module Management">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {layoutMenuItems.map((item) => {
                 const isLocked = item.id === MenuItemId.DASHBOARD || item.id === MenuItemId.SETTINGS;
                 return (
                   <div key={item.id} className={`p-4 rounded-xl border flex items-center justify-between ${menuVisibility[item.id] ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
                      <div className="flex items-center gap-2">
                        {React.createElement(item.icon, { size: 18, className: menuVisibility[item.id] ? `text-${item.color}-400` : 'text-slate-500' })}
                        <span className={menuVisibility[item.id] ? 'text-white' : 'text-slate-500'}>{item.labelEn}</span>
                      </div>
                      <button 
                        onClick={() => !isLocked && onToggleMenu(item.id)}
                        disabled={isLocked}
                        className={`w-10 h-5 rounded-full flex items-center transition-all ${menuVisibility[item.id] ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'} ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer px-1'}`}
                      >
                         <div className="w-3 h-3 rounded-full bg-white shadow-sm"></div>
                      </button>
                   </div>
                 );
              })}
            </div>
         </NeonCard>

         <NeonCard title="System Health">
            <div className="space-y-2">
               <div className="flex justify-between"><span className="text-slate-400">Database Status</span><span className="text-green-400">Healthy</span></div>
               <div className="flex justify-between"><span className="text-slate-400">API Latency</span><span className="text-cyan-400">120ms</span></div>
               <div className="flex justify-between"><span className="text-slate-400">Last Backup</span><span className="text-slate-200">2 hours ago</span></div>
            </div>
         </NeonCard>
      </div>
   );
};

// 11. ANALYTICS (New)
const AnalyticsView = ({ onAI }: { onAI: any }) => {
   const [loadingAI, setLoadingAI] = useState<string | null>(null);
   const handleAIRun = (id: string) => { setLoadingAI(id); onAI(id, () => setLoadingAI(null)); };
   return (
      <div className="space-y-6">
         <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.ANALYTICS]} onRun={handleAIRun} loadingId={loadingAI} />
         <div className="grid grid-cols-2 gap-4">
            <NeonCard title="Customer Churn Rate">
               <div className="text-4xl font-bold text-red-500">2.4%</div>
               <div className="text-xs text-slate-400">Down 0.5% from last month</div>
            </NeonCard>
            <NeonCard title="Customer Lifetime Value">
               <div className="text-4xl font-bold text-green-500">$1,240</div>
               <div className="text-xs text-slate-400">Up 12% YoY</div>
            </NeonCard>
         </div>
         <NeonCard title="Deep Market Trends">
            <div className="h-64 flex items-center justify-center text-slate-500">
               <ResponsiveContainer width="100%" height="100%"><ScatterChart><XAxis type="number" dataKey="x" name="stature" /><YAxis type="number" dataKey="y" name="weight" /><Tooltip cursor={{ strokeDasharray: '3 3' }} /><Scatter name="A school" data={[{x:100,y:200}, {x:120,y:100}, {x:170,y:300}, {x:140,y:250}, {x:150,y:400}, {x:110,y:280}]} fill="#8884d8" /></ScatterChart></ResponsiveContainer>
            </div>
         </NeonCard>
      </div>
   );
};

// 12. MINDMAP (New)
const MindmapView = ({ onAI }: { onAI: any }) => {
   const [loadingAI, setLoadingAI] = useState<string | null>(null);
   const handleAIRun = (id: string) => { setLoadingAI(id); onAI(id, () => setLoadingAI(null)); };
   return (
      <div className="space-y-6">
         <AIActionGrid actions={AI_MENU_CONFIG[MenuItemId.MINDMAP]} onRun={handleAIRun} loadingId={loadingAI} />
         <NeonCard className="h-[500px] flex items-center justify-center border-dashed border-2 border-slate-700 bg-slate-900/30">
             <div className="text-center">
                <Network size={64} className="mx-auto mb-4 text-cyan-500 opacity-50"/>
                <h3 className="text-xl font-bold text-slate-300">Mindmap Canvas</h3>
                <p className="text-slate-500">Use AI buttons to auto-generate structure.</p>
             </div>
         </NeonCard>
      </div>
   );
};


// --- MAIN APP ---

const App: React.FC = () => {
  const [currentMenu, setCurrentMenu] = useState<MenuItemId>(MenuItemId.DASHBOARD);
  const [lang, setLang] = useState<Language>('vi'); 
  const [fixReport, setFixReport] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'info' | 'success'} | null>(null);

  // --- MENU VISIBILITY STATE (ADMIN) ---
  const [menuVisibility, setMenuVisibility] = useState<Record<MenuItemId, boolean>>({
     [MenuItemId.DASHBOARD]: true,
     [MenuItemId.LEAD_FINDER]: true,
     [MenuItemId.CRM]: true,
     [MenuItemId.MARKETING]: true,
     [MenuItemId.COACHING]: true,
     [MenuItemId.PROJECTS]: true,
     [MenuItemId.AFFILIATES]: true,
     [MenuItemId.CHATBOT]: true,
     [MenuItemId.FINANCE]: true,
     [MenuItemId.ANALYTICS]: true,
     [MenuItemId.MINDMAP]: true,
     [MenuItemId.SETTINGS]: true,
     [MenuItemId.MEMBERS]: true, // if applicable
     [MenuItemId.CONTENT_AI]: true // if applicable
  });

  const handleToggleMenu = (id: MenuItemId) => {
     if (id === MenuItemId.DASHBOARD || id === MenuItemId.SETTINGS) return; // Locked
     setMenuVisibility(prev => ({...prev, [id]: !prev[id]}));
  };

  const [appState, setAppState] = useState({
    user: initialUser,
    leads: [] as Lead[],
    interactions: [] as Interaction[],
    logs: [] as SystemLog[],
  });

  const logic = useMemo(() => new SpiderWebLogic(setAppState), []);

  // Generic AI Action Handler (Simulates Thinking & Connects to Logic)
  const handleGenericAIAction = (actionId: string, callback: () => void, isAuto = false) => {
    // Find action details for logging
    let actionTitle = "Unknown Task";
    let menuIdForLog = MenuItemId.DASHBOARD;
    let found = false;

    Object.entries(AI_MENU_CONFIG).forEach(([menuId, actions]) => {
       const act = actions.find(a => a.id === actionId);
       if (act) {
          actionTitle = act.label;
          menuIdForLog = menuId as MenuItemId;
          found = true;
       }
    });

    if (!found && actionId === "auto_fix_global") {
       actionTitle = "Global System Auto-Fix";
       menuIdForLog = MenuItemId.SETTINGS;
    }

    if (isAuto) {
       logic.logAIAction(menuIdForLog, `[AUTO-PILOT] ${actionTitle}`);
       setToast({ msg: `🤖 AI Auto-Pilot: ${actionTitle}`, type: 'info' });
    } else {
       logic.logAIAction(menuIdForLog, actionTitle);
       setTimeout(() => {
          setToast({ msg: `✅ Completed: ${actionTitle}`, type: 'success' });
          callback();
       }, 1500);
    }
  };

  // --- AI AUTO-PILOT SIMULATION ENGINE ---
  useEffect(() => {
    // Runs every 15 seconds to simulate an AI workforce
    const interval = setInterval(() => {
      // 1. Pick a random menu
      const menuKeys = Object.keys(AI_MENU_CONFIG);
      const randomMenuKey = menuKeys[Math.floor(Math.random() * menuKeys.length)];
      
      // 2. Pick a random action
      const actions = AI_MENU_CONFIG[randomMenuKey];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];

      // 3. Execute
      console.log("🤖 Auto-Pilot Running:", randomAction.label);
      handleGenericAIAction(randomAction.id, () => {}, true);

    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Toast Auto-Hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const renderContent = () => {
    switch (currentMenu) {
      case MenuItemId.DASHBOARD: return <DashboardView lang={lang} user={appState.user} logs={appState.logs} interactions={appState.interactions} onAI={handleGenericAIAction} aiTaskCount={appState.user.aiTasksCompleted || 0} />;
      case MenuItemId.LEAD_FINDER: return <LeadFinderView lang={lang} logic={logic} onAI={handleGenericAIAction} />;
      case MenuItemId.CRM: return <CRMView lang={lang} leads={appState.leads} logic={logic} interactions={appState.interactions} onAI={handleGenericAIAction} />;
      case MenuItemId.MARKETING: return <MarketingView onAI={handleGenericAIAction} />;
      case MenuItemId.COACHING: return <CoachingView lang={lang} user={appState.user} logic={logic} onAI={handleGenericAIAction} />;
      case MenuItemId.PROJECTS: return <ProjectsView onAI={handleGenericAIAction} />;
      case MenuItemId.AFFILIATES: return <AffiliatesView onAI={handleGenericAIAction} />;
      case MenuItemId.CHATBOT: return <AICoachView lang={lang} onAI={handleGenericAIAction} />;
      case MenuItemId.FINANCE: return <FinanceView user={appState.user} onAI={handleGenericAIAction} />;
      case MenuItemId.SETTINGS: return <SettingsView onAI={handleGenericAIAction} menuVisibility={menuVisibility} onToggleMenu={handleToggleMenu} />;
      case MenuItemId.ANALYTICS: return <AnalyticsView onAI={handleGenericAIAction} />;
      case MenuItemId.MINDMAP: return <MindmapView onAI={handleGenericAIAction} />;
      default: return <div className="p-10 text-center">Module Under Construction</div>;
    }
  };

  return (
    <Layout 
      currentMenu={currentMenu} 
      onMenuChange={setCurrentMenu}
      language={lang}
      onToggleLanguage={() => setLang(prev => prev === 'en' ? 'vi' : 'en')}
      onAutoFix={() => handleGenericAIAction("auto_fix_global", () => {})}
      menuVisibility={menuVisibility}
    >
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
             {currentMenu.replace('_', ' ').toUpperCase()}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
             {lang === 'en' ? 'AI-Powered Spider Web System' : 'Hệ Thống Mạng Nhện AI'}
          </p>
        </div>
        <div className="flex gap-2">
           <NeonButton variant="orange" onClick={() => window.print()}>
              <Printer size={16} /> PDF
           </NeonButton>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 p-4 rounded-xl border backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-bounce
          ${toast.type === 'info' ? 'bg-slate-900/90 border-cyan-500 text-cyan-400' : 'bg-green-900/90 border-green-500 text-white'}
        `}>
           <div className="flex items-center gap-2 font-bold">
              {toast.type === 'info' ? <Bot size={20}/> : <CheckCircle size={20}/>}
              {toast.msg}
           </div>
        </div>
      )}

      {renderContent()}
    </Layout>
  );
};

export default App;
