import os

target_path = 'src/components/GliDeepDive.tsx'
with open(target_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# line 2163 is index 2162 (0-indexed)
# line 2669 is index 2668 (0-indexed)
start_idx = 2162
end_idx = 2668

# Verify start and end line content to be absolutely sure
print("START LINE IN FILE:", lines[start_idx].strip())
print("END LINE IN FILE:", lines[end_idx].strip())

if 'gliTab === \'overview\' && (' in lines[start_idx] and 'ween items-center' in lines[end_idx]:
    replacement = """          {gliTab === 'overview' && (
            <>
              {/* B. SUB-INDEX MATRICES SUMMARY */}
              <div className="bg-[#0D121F] p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      GLI 7 大子维度综合评估矩阵 (Core 7-Dimensional Diagnostic Grid)
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1">
                      大模型多维对账引擎对品牌在可见度、推荐率、认知纠偏及竞争对比等场景的量化指标汇总：
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAdjustWeightsOpen(true);
                      triggerLocalToast("⚙️ 正在打开权重调整面板...");
                    }}
                    className="px-2.5 py-1 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-md text-[10px] font-bold transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3" />
                    调整权重参数
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px] font-mono">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 font-bold bg-slate-950/20 text-[10px]">
                        <th className="p-2.5">子维度 (Sub-index)</th>
                        <th className="p-2.5">当前得分 (Score)</th>
                        <th className="p-2.5">较基线变化 (Delta)</th>
                        <th className="p-2.5">优化优先级 (Priority)</th>
                        <th className="p-2.5">对账状态 (Status)</th>
                        <th className="p-2.5 text-right">快捷操作 (Action)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {subIndices.map((sub) => {
                        let priorityClass = 'bg-slate-800 text-slate-400';
                        if (sub.priority === '高' || sub.priority === '优先优化') {
                          priorityClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/15';
                        } else if (sub.priority === '中') {
                          priorityClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/15';
                        } else if (sub.priority === '良好') {
                          priorityClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15';
                        }

                        return (
                          <tr key={sub.key} className="hover:bg-slate-950/40 transition-colors">
                            <td className="p-2.5">
                              <span className="text-white font-black">{sub.label}</span>
                              <span className="text-[9px] text-slate-500 block">{sub.key.toUpperCase()} 指数</span>
                            </td>
                            <td className="p-2.5 text-slate-200 font-black">{sub.score} 分</td>
                            <td className="p-2.5">
                              <span className={`font-black ${sub.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {sub.delta >= 0 ? '+' : ''}{sub.delta}
                              </span>
                            </td>
                            <td className="p-2.5">
                              <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${priorityClass}`}>
                                {sub.priority}
                              </span>
                            </td>
                            <td className="p-2.5">
                              <span className="text-slate-400">{sub.problemsCount > 0 ? `⚠️ ${sub.problemsCount}个挂账问题` : '✓ 运行正常'}</span>
                            </td>
                            <td className="p-2.5 text-right">
                              <button
                                onClick={() => {
                                  setGliTab(sub.key as any);
                                  triggerLocalToast(`🔍 正在深钻：${sub.label}`);
                                }}
                                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded hover:text-white transition-all text-[9.5px]"
                              >
                                深钻对账 →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* C. WATERFALL CONTRIBUTION ANALYSIS & MULTI-MODEL PERFORMANCE */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Weighted Contribution Bar Chart */}
                <div className="md:col-span-7 bg-[#0D121F] p-5 rounded-2xl border border-white/5 space-y-4">
                  <div className="border-b border-white/5 pb-2.5 flex justify-between items-center">
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold block">子指数权重贡献图</span>
                      <span className="text-[9px] text-slate-500">本周期各子维度对最终 GLI {finalGli.toFixed(1)} 分的净贡献及方向</span>
                    </div>
                    <span className="text-[9.5px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">对账解析</span>
                  </div>

                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: '可见度 (VLI)', 净增得分: 6.2, fill: '#10b981' },
                          { name: '推荐意愿 (RLI)', 净增得分: 4.8, fill: '#34d399' },
                          { name: '曝光频次 (ILI)', 净增得分: 3.1, fill: '#60a5fa' },
                          { name: '认知纠偏 (CLI)', 净增得分: 2.8, fill: '#818cf8' },
                          { name: '权威证据 (ALI)', 净增得分: 4.2, fill: '#a78bfa' },
                          { name: '竞争防御 (DLI)', 净增得分: -1.6, fill: '#f87171' },
                          { name: '风险控制 (RCI)', 净增得分: 0.3, fill: '#fbbf24' },
                        ]}
                        margin={{ top: 10, right: 15, left: -25, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a3042" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={9} />
                        <YAxis stroke="#6b7280" fontSize={10} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: '#090d15', borderColor: 'rgba(255,255,255,0.1)' }}
                          formatter={(val: number) => [`对最终分贡献: ${val} 分`]}
                        />
                        <Bar dataKey="净增得分" radius={[4, 4, 0, 0]}>
                          {
                            [
                              { fill: '#10b981' },
                              { fill: '#34d399' },
                              { fill: '#60a5fa' },
                              { fill: '#818cf8' },
                              { fill: '#a78bfa' },
                              { fill: '#f87171' },
                              { fill: '#fbbf24' },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-white/5 text-[9.5px] text-slate-400 leading-normal font-sans">
                    💡 计算公式：最终 <b>GLI ({finalGli.toFixed(1)}分)</b> ＝ 加权子维度得分之和。当前 <b>可见度(VLI)</b> 贡献了 <b>{(6.2 * scaleGli).toFixed(1)} 分</b>，而 <b>竞争优势(DLI)</b> 贡献了 <b>{(-1.6 * scaleGli).toFixed(1)} 分</b> 产生负向扯后腿效应，是下一步需要通过资产对标填补的缺口。
                  </div>
                </div>

                {/* Model Coverage & Health Card */}
                <div className="md:col-span-5 bg-[#0D121F] p-5 rounded-2xl border border-white/5 space-y-4">
                  <div className="border-b border-white/5 pb-2.5">
                    <span className="text-[11px] text-slate-400 font-bold block">全网大模型多端覆盖率 (Coverage Rate)</span>
                    <span className="text-[9px] text-slate-500">主流模型对部署资产事实的物理吸附采纳度</span>
                  </div>

                  <div className="space-y-3 font-mono text-[11px]">
                    {[
                      { name: 'Kimi (月之暗面)', value: 92, progress: 'w-[92%]', color: 'bg-teal-500', note: '首选高置信度推荐' },
                      { name: '豆包 (字节跳动)', value: 85, progress: 'w-[85%]', color: 'bg-emerald-500', note: '高曝光，极速吸附' },
                      { name: 'DeepSeek-R1', value: 89, progress: 'w-[89%]', color: 'bg-indigo-500', note: '深度推理物理论证' },
                      { name: '通义千问 (阿里)', value: 78, progress: 'w-[78%]', color: 'bg-blue-500', note: '基本事实覆盖无碍' },
                      { name: '腾讯元宝 (腾讯)', value: 81, progress: 'w-[81%]', color: 'bg-sky-500', note: '高频引用真实文献' }
                    ].map((model, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-300 font-semibold">{model.name}</span>
                          <span className="text-white font-black">{model.value}% 吸附率</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                          <div className={`h-full ${model.color} ${model.progress} rounded-full`} />
                        </div>
                        <div className="text-[8.5px] text-slate-500 text-right">{model.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {gliTab === 'overview' && (
            <div className="bg-[#0D121F] p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">"""
    
    lines[start_idx:end_idx+1] = [replacement + "\n"]
    with open(target_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("SUCCESSFULLY REPLACED BLOCK!")
else:
    print("MATCH FAILED! Start/End line contents do not match expected keywords!")
