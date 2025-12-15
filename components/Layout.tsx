
import React from 'react';
import { 
  LayoutDashboard, TrendingUp, Search, Users, FileText, 
  PieChart, BrainCircuit, Share2, UserCog, Settings, 
  Menu, X, Sparkles, LogOut, Briefcase, MessageSquare, DollarSign, PenTool, GraduationCap, Phone, Zap
} from 'lucide-react';
import { NeonButton } from './UIComponents';
import { MenuItemId, Language } from '../types';

interface LayoutProps {
  currentMenu: MenuItemId;
  onMenuChange: (id: MenuItemId) => void;
  language: Language;
  onToggleLanguage: () => void;
  children: React.ReactNode;
  onAutoFix: () => void;
  menuVisibility: Record<MenuItemId, boolean>;
}

export const menuItems = [
  { id: MenuItemId.DASHBOARD, icon: LayoutDashboard, labelEn: 'Dashboard & KPI', labelVi: 'Tổng Quan & KPI', color: 'cyan' },
  { id: MenuItemId.LEAD_FINDER, icon: Search, labelEn: 'Lead Hunter', labelVi: 'Tìm Khách Hàng', color: 'lime' }, // Menu 2
  { id: MenuItemId.CRM, icon: Phone, labelEn: 'Smart CRM', labelVi: 'CSKH Thông Minh', color: 'yellow' }, // Menu 3
  { id: MenuItemId.MARKETING, icon: PenTool, labelEn: 'Auto Marketing', labelVi: 'Marketing Tự Động', color: 'purple' }, // Menu 4
  { id: MenuItemId.COACHING, icon: GraduationCap, labelEn: 'Coaching Grow', labelVi: 'Huấn Luyện AI', color: 'magenta' }, // Menu 5
  { id: MenuItemId.PROJECTS, icon: Briefcase, labelEn: 'Project Manager', labelVi: 'Quản Lý Dự Án', color: 'blue' }, // Menu 6
  { id: MenuItemId.AFFILIATES, icon: Share2, labelEn: 'Affiliate System', labelVi: 'Tiếp Thị Liên Kết', color: 'orange' }, // Menu 7
  { id: MenuItemId.CHATBOT, icon: MessageSquare, labelEn: 'Chatbot Assistant', labelVi: 'Trợ Lý Chatbot', color: 'pink' }, // Menu 8
  { id: MenuItemId.FINANCE, icon: DollarSign, labelEn: 'Finance & Report', labelVi: 'Tài Chính & Báo Cáo', color: 'green' }, // Menu 9
  { id: MenuItemId.ANALYTICS, icon: TrendingUp, labelEn: 'Analytics', labelVi: 'Phân Tích Sâu', color: 'cyan' },
  { id: MenuItemId.MINDMAP, icon: BrainCircuit, labelEn: 'Mindmap', labelVi: 'Sơ Đồ Tư Duy', color: 'lime' },
  { id: MenuItemId.SETTINGS, icon: Settings, labelEn: 'System Config', labelVi: 'Cấu Hình', color: 'slate' }, // Menu 10
];

export const Layout: React.FC<LayoutProps> = ({ 
  currentMenu, onMenuChange, language, onToggleLanguage, children, onAutoFix, menuVisibility
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-dark-bg text-white overflow-hidden selection:bg-cyan-500/30">
      
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-slate-900/90 border-r border-slate-700/50 backdrop-blur-xl 
        transition-all duration-300 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)] no-print relative`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-400 animate-pulse" />
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-lg">
                HYPERGROW
              </span>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2 no-scrollbar">
          {menuItems.map((item) => {
            // Check visibility using the prop
            if (!menuVisibility[item.id]) return null;

            const isActive = currentMenu === item.id;
            const Icon = item.icon;
            // Dynamic color class mapping
            const activeClass = isActive 
              ? `bg-slate-800 text-${item.color === 'slate' ? 'white' : item.color}-400 border-${item.color === 'slate' ? 'white' : item.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.3)]` 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent';

            return (
              <button
                key={item.id}
                onClick={() => onMenuChange(item.id as MenuItemId)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-l-4 transition-all duration-200 group ${activeClass}`}
              >
                <Icon size={24} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {isSidebarOpen && (
                  <span className="font-medium whitespace-nowrap">
                    {language === 'en' ? item.labelEn : item.labelVi}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
             <div className="flex flex-col gap-2">
              <button 
                  onClick={onToggleLanguage}
                  className="w-full py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                 {language === 'en' ? '🇻🇳 Switch to VI' : '🇺🇸 Switch to EN'}
              </button>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10 no-print">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white capitalize flex items-center gap-2">
              {menuItems.find(i => i.id === currentMenu)?.icon && React.createElement(menuItems.find(i => i.id === currentMenu)!.icon, { className: "text-cyan-400" })}
              {language === 'en' 
                ? menuItems.find(i => i.id === currentMenu)?.labelEn 
                : menuItems.find(i => i.id === currentMenu)?.labelVi}
            </h2>
            
            {/* Auto Pilot Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs text-cyan-400">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
               </span>
               AI Auto-Pilot Active
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <NeonButton variant="purple" onClick={onAutoFix} className="text-xs">
                <Sparkles size={14} /> {language === 'en' ? 'AI Auto Fix' : 'AI Sửa Lỗi'}
             </NeonButton>
             
             <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
               <img src="https://picsum.photos/40/40" alt="User" className="w-10 h-10 rounded-full border-2 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]" />
               <div className="hidden md:block">
                 <p className="text-sm font-bold text-white">Alex Sales</p>
                 <p className="text-xs text-cyan-400">Rank: Gold</p>
               </div>
             </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-6 relative no-scrollbar bg-gradient-to-br from-slate-900 via-[#111c44] to-slate-900">
          {children}
        </div>
        
      </main>
    </div>
  );
};
