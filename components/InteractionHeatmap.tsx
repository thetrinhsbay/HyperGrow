
import React from 'react';

// Giả lập dữ liệu hoạt động trong 12 giờ làm việc (8h - 20h)
const activityData = [
  { hour: '08:00', level: 20 }, // Mới đến, cafe
  { hour: '09:00', level: 85 }, // Gọi điện cao điểm
  { hour: '10:00', level: 95 }, // Gọi điện cao điểm
  { hour: '11:00', level: 60 }, // Giảm dần
  { hour: '12:00', level: 10 }, // Ăn trưa (Thấp)
  { hour: '13:00', level: 30 }, // Ngủ trưa dậy
  { hour: '14:00', level: 90 }, // Cày cuốc chiều
  { hour: '15:00', level: 100 }, // Max công suất
  { hour: '16:00', level: 80 },
  { hour: '17:00', level: 50 },
  { hour: '18:00', level: 20 }, // OT nhẹ
  { hour: '19:00', level: 0 },
];

export default function InteractionHeatmap() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-[0_0_20px_rgba(0,255,255,0.1)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-cyan-400 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          AI HEATMAP: Cường độ làm việc
        </h3>
        <span className="text-xs text-gray-500 font-mono">LIVE TRACKING</span>
      </div>

      <div className="flex items-end gap-2 h-40">
        {activityData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
            
            {/* Cột hiển thị nhiệt */}
            <div className="w-full h-full flex items-end relative">
              <div 
                style={{ height: `${item.level}%` }}
                className={`w-full rounded-sm transition-all duration-1000 ease-out relative overflow-hidden
                  ${item.level > 80 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 
                    item.level > 40 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 
                    'bg-gray-700'}
                `}
              >
                 {/* Hiệu ứng quét sóng */}
                 <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:translate-y-full transition-transform duration-1000"></div>
              </div>
            </div>

            {/* Giờ */}
            <span className="text-[9px] text-gray-500 rotate-0 md:rotate-0 font-mono">
              {item.hour.split(':')[0]}h
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-400 border-t border-gray-800 pt-3">
        <div>Total Active: <span className="text-white font-bold">6.5h</span></div>
        <div>Idle Time: <span className="text-red-400 font-bold">1.2h</span></div>
        <div>Focus Score: <span className="text-green-400 font-bold">8.5/10</span></div>
      </div>
    </div>
  );
}
