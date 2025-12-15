
import React, { useState, useEffect } from 'react';
import { Activity, Zap, Cpu, Server, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AIOptimizerDashboard() {
  const [systemHealth, setSystemHealth] = useState(88);
  const [optimizedItems, setOptimizedItems] = useState<string[]>([]);

  // Giả lập quá trình AI quét và tối ưu
  useEffect(() => {
    const timer = setInterval(() => {
      // Random sự kiện tối ưu
      const actions = [
        "Đã nén 1.2GB dữ liệu ảnh thừa...",
        "Tối ưu hóa Token API: Tiết kiệm $4.5...",
        "Phát hiện quy trình chậm tại Team Sale...",
        "Đã dọn dẹp Cache bộ nhớ đệm...",
        "Re-index lại Database khách hàng..."
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      setOptimizedItems(prev => [randomAction, ...prev.slice(0, 4)]);
      setSystemHealth(h => Math.min(100, h + 1)); // Tăng điểm sức khỏe giả lập
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black border border-green-900/50 rounded-2xl p-6 text-green-500 font-mono relative overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.1)]">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-900/20 rounded border border-green-500/30 animate-pulse">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-widest uppercase">AI Optimizer Core</h2>
            <p className="text-xs text-green-700">System Status: ONLINE</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
            {systemHealth}%
          </div>
          <div className="text-xs text-green-400">Efficiency Score</div>
        </div>
      </div>

      {/* Main Visual: Scanner Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Radar Area */}
        <div className="col-span-1 flex items-center justify-center relative h-48 bg-green-900/10 rounded-xl border border-green-900/30">
           {/* Vòng tròn Radar quét */}
           <div className="absolute w-32 h-32 rounded-full border border-green-500/30"></div>
           <div className="absolute w-20 h-20 rounded-full border border-green-500/50"></div>
           <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-[spin_2s_linear_infinite] opacity-50"></div>
           <Activity className="text-white animate-bounce" size={32} />
           <div className="absolute bottom-2 text-[10px] text-green-600">SCANNING DEEP SYSTEM...</div>
        </div>

        {/* Live Terminal Log */}
        <div className="col-span-2 bg-black/50 rounded-xl border border-green-800 p-4 font-mono text-xs h-48 overflow-hidden flex flex-col">
          <div className="border-b border-green-900 pb-2 mb-2 flex justify-between">
            <div className="border-b border-green-900 pb-2 mb-2 flex justify-between">
              <span>&gt;_ROOT_ACCESS_GRANTED</span>
              <span className="animate-pulse">&gt; Live</span>
            </div>
            <span className="animate-pulse">● Live</span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
            {optimizedItems.map((item, idx) => (
              <div key={idx} className="flex gap-2 animate-in slide-in-from-left duration-300">
                <span className="text-green-700">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-green-300">{item}</span>
                <span className="text-white font-bold text-[10px] border border-green-700 px-1 rounded">DONE</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Metrics Footer */}
      <div className="grid grid-cols-4 gap-4 mt-6 z-10 relative">
        {[
          { label: "CPU Saved", val: "34%", icon: <Server size={14}/> },
          { label: "RAM Freed", val: "1.2GB", icon: <Zap size={14}/> },
          { label: "Speed Up", val: "2.5x", icon: <TrendingUp size={14}/> },
          { label: "Err Blocked", val: "12", icon: <AlertTriangle size={14}/> },
        ].map((m, i) => (
          <div key={i} className="bg-green-900/10 border border-green-800 p-3 rounded flex flex-col items-center hover:bg-green-900/30 transition-colors cursor-pointer group">
            <div className="text-green-600 mb-1 group-hover:text-white transition-colors">{m.icon}</div>
            <div className="text-lg font-bold text-white">{m.val}</div>
            <div className="text-[9px] text-green-500 uppercase">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Background Matrix Effect (Fake) */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Matrix_code.svg/1200px-Matrix_code.svg.png')] bg-cover"></div>
    </div>
  );
}
