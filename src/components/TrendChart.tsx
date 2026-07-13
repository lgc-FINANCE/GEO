import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const data = [
  { name: 'W1', GESI: 65, GLI: 2 },
  { name: 'W2', GESI: 68, GLI: 4 },
  { name: 'W3', GESI: 72, GLI: 8 },
  { name: 'W4', GESI: 71, GLI: 7 },
  { name: 'W5', GESI: 78, GLI: 11 },
  { name: 'W6', GESI: 82, GLI: 14 },
  { name: 'W7', GESI: 86, GLI: 12 },
];

export function TrendChart({ period }: { period: string }) {
  return (
    <div className="bg-[#131825] border border-white/5 rounded-xl p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-medium text-slate-300 font-mono">指数变化趋势</h3>
          <p className="text-[10px] text-slate-500 mt-1">GESI 总健康度 vs GLI 优化效果 （基于近 7 期）</p>
        </div>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGESI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGLI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748B' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748B' }}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F131D', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#E2E8F0' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            <Area 
              type="monotone" 
              dataKey="GESI" 
              stroke="#10B981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorGESI)" 
              name="GESI 总分"
            />
            <Area 
              type="monotone" 
              dataKey="GLI" 
              stroke="#6366F1" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorGLI)" 
              name="GLI 提升分"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
