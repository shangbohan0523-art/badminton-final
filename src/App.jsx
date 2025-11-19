import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Calendar, Edit2, X, ChevronRight, UserPlus, Settings, Trash2, Minus, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

// ==============================================
// 👇 请在这里填入你的 Supabase 信息 (保留引号)
// ==============================================
const SUPABASE_URL = 'https://thswfvpzdrhwlgzqpjsv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoc3dmdnB6ZHJod2xnenFwanN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDQ0ODgsImV4cCI6MjA3OTEyMDQ4OH0.LDmLb-YHJxNmVnFyYwSO36SWZ25Ny-kue7BLAb0Gl3o';

// 初始化客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 辅助工具 ---
const COLORS = [
  'from-rose-400 to-red-500', 'from-blue-400 to-indigo-500', 'from-emerald-400 to-green-500',
  'from-amber-400 to-orange-500', 'from-fuchsia-400 to-purple-500', 'from-cyan-400 to-sky-500',
];

const Avatar = ({ name, colorIdx, size = 'md', className = '' }) => {
  const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl' };
  const safeColor = COLORS[(colorIdx || 0) % COLORS.length];
  return (
    <div className={`rounded-full bg-gradient-to-br ${safeColor} flex items-center justify-center text-white font-bold shadow-lg border border-white/20 ${sizes[size]} ${className}`}>
      {name ? name[0].toUpperCase() : '?'}
    </div>
  );
};

// --- 主程序 ---
export default function App() {
  const [view, setView] = useState('lobby');
  const [loading, setLoading] = useState(true);
  
  // 数据状态
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  
  // 交互状态
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [matchData, setMatchData] = useState({ teamA: [], teamB: [], scoreA: 0, scoreB: 0 });
  const [isMatchPoint, setIsMatchPoint] = useState(false);
  const [isEditingScore, setIsEditingScore] = useState(false);

  // 管理状态
  const [isManageMode, setIsManageMode] = useState(false);
  const [playerModal, setPlayerModal] = useState({ show: false, type: 'add', data: null });
  const [matchEditModal, setMatchEditModal] = useState({ show: false, data: null });

  // --- 1. 加载数据 ---
  useEffect(() => {
    fetchData();
    // 实时订阅
    const subscription = supabase
      .channel('public:badminton')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, fetchData)
      .subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchData = async () => {
    try {
      const { data: pData } = await supabase.from('players').select('*').order('created_at');
      const { data: mData } = await supabase.from('matches').select('*').order('created_at', { ascending: false });
      if (pData) setPlayers(pData);
      if (mData) setMatches(mData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. 计算积分 ---
  const playerStats = useMemo(() => {
    const stats = {};
    players.forEach(p => { stats[p.id] = { ...p, wins: 0, matches: 0, score: 0 }; });
    matches.forEach(m => {
      const allPlayers = [...(m.team_a_ids || []), ...(m.team_b_ids || [])];
      const winners = m.winner === 'A' ? m.team_a_ids : m.team_b_ids;
      allPlayers.forEach(pid => {
        if (stats[pid]) {
          stats[pid].matches += 1;
          if (winners.includes(pid)) {
            stats[pid].wins += 1;
            stats[pid].score += 3;
          } else {
            stats[pid].score += 1;
          }
        }
      });
    });
    return Object.values(stats).sort((a, b) => b.score - a.score || (b.wins/b.matches) - (a.wins/a.matches));
  }, [players, matches]);

  // --- 3. 操作逻辑 ---
  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.pname.value.trim();
    const team = form.pteam.value.trim();
    if (!name) return;
    const payload = { name, team_name: team || '自由人' };

    if (playerModal.type === 'add') {
      await supabase.from('players').insert([{ ...payload, avatar_idx: Math.floor(Math.random() * COLORS.length) }]);
    } else {
      await supabase.from('players').update(payload).eq('id', playerModal.data.id);
    }
    setPlayerModal({ show: false, type: 'add', data: null });
    fetchData();
  };

  const handleDeletePlayer = async (id) => {
    if (window.confirm('确定删除？')) {
      await supabase.from('players').delete().eq('id', id);
      fetchData();
    }
  };

  const startMatch = () => {
    const mid = Math.ceil(selectedPlayers.length / 2);
    setMatchData({ teamA: selectedPlayers.slice(0, mid), teamB: selectedPlayers.slice(mid), scoreA: 0, scoreB: 0 });
    setView('match');
  };

  const handleFinishMatch = async (winner) => {
    if(view !== 'match') return;
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#34D399', '#FBBF24', '#FFFFFF'] });
    await supabase.from('matches').insert([{
      team_a_ids: matchData.teamA, team_b_ids: matchData.teamB, score_a: matchData.scoreA, score_b: matchData.scoreB, winner
    }]);
    fetchData();
    setTimeout(() => { setView('history'); setSelectedPlayers([]); setIsMatchPoint(false); }, 2000);
  };

  const handleUpdateMatch = async () => {
    const { id, scoreA, scoreB } = matchEditModal.data;
    const winner = Number(scoreB) > Number(scoreA) ? 'B' : 'A';
    await supabase.from('matches').update({ score_a: Number(scoreA), score_b: Number(scoreB), winner }).eq('id', id);
    setMatchEditModal({ show: false, data: null });
    fetchData();
  };

  const handleDeleteMatch = async (id) => {
    if (window.confirm('确定删除这条记录？')) {
      await supabase.from('matches').delete().eq('id', id);
      fetchData();
    }
  };

  const updateScore = (team, delta) => {
    setMatchData(prev => {
      const key = team === 'A' ? 'scoreA' : 'scoreB';
      const newScore = Math.max(0, prev[key] + delta);
      const opponentScore = team === 'A' ? prev.scoreB : prev.scoreA;
      if (newScore >= 20 || opponentScore >= 20) setIsMatchPoint(true);
      else setIsMatchPoint(false);
      if ((newScore >= 21 && newScore - opponentScore >= 2) || newScore === 30) handleFinishMatch(team);
      return { ...prev, [key]: newScore };
    });
  };

  const getP = (id) => players.find(p => p.id === id) || { name: '?', colorIdx: 0 };

  // --- 渲染部分 ---
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans relative overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-900 pointer-events-none"></div>

      {/* 顶部标题 */}
      {view !== 'match' && (
        <header className="relative z-20 px-6 pt-8 pb-2 flex justify-between items-center bg-slate-900/50 backdrop-blur sticky top-0">
          <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-200">SMASH.</h1>
        </header>
      )}

      <main className="relative z-10 max-w-md mx-auto h-full min-h-screen pb-24 px-4 pt-4">
        {/* 1. 选人界面 */}
        {view === 'lobby' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-emerald-400" size={20} /> 选手列表</h2>
              <div className="flex gap-3">
                <button onClick={() => setIsManageMode(!isManageMode)} className={`p-2 rounded-full ${isManageMode ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60'}`}><Settings size={18} /></button>
                <button onClick={() => setPlayerModal({ show: true, type: 'add' })} className="bg-white/10 p-2 rounded-full text-emerald-400"><UserPlus size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {players.map(p => {
                const isSel = selectedPlayers.includes(p.id);
                return (
                  <div key={p.id} className="relative group">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => { if (!isManageMode) isSel ? setSelectedPlayers(prev => prev.filter(id => id !== p.id)) : selectedPlayers.length < 4 && setSelectedPlayers(prev => [...prev, p.id]) }} 
                      className={`w-full p-3 rounded-2xl border flex items-center gap-3 transition-all ${isSel ? 'bg-emerald-500/20 border-emerald-400' : 'bg-white/5 border-white/5'} ${isManageMode ? 'opacity-50' : 'opacity-100'}`}>
                      <Avatar name={p.name} colorIdx={p.avatar_idx} />
                      <div className="text-left overflow-hidden min-w-0">
                        <div className="font-medium truncate">{p.name}</div>
                        <div className="text-xs text-white/40 truncate">{p.team_name}</div>
                      </div>
                      {isSel && !isManageMode && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34D399]" />}
                    </motion.button>
                    {isManageMode && (
                      <div className="absolute inset-0 flex items-center justify-center gap-2 z-10">
                        <button onClick={() => setPlayerModal({ show: true, type: 'edit', data: p })} className="p-2 bg-blue-500 rounded-full shadow-lg"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeletePlayer(p.id)} className="p-2 bg-red-500 rounded-full shadow-lg"><Trash2 size={16} /></button>
                      </div>
                    )}
                  </div>
                )
              })}
              {players.length === 0 && !loading && <div className="col-span-2 text-center text-white/30 py-10">点击右上角添加选手</div>}
            </div>
            {/* 开始按钮 */}
            <AnimatePresence>
              {(selectedPlayers.length === 2 || selectedPlayers.length === 4) && !isManageMode && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-24 left-0 right-0 flex justify-center z-50 pointer-events-none">
                  <button onClick={startMatch} className="pointer-events-auto bg-emerald-500 text-white font-bold py-3 px-10 rounded-full shadow-2xl flex items-center gap-2 hover:bg-emerald-400 transition-colors">
                    开始比赛 <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 2. 积分榜 */}
        {view === 'rank' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="text-yellow-400" size={20} /> 积分榜</h2>
            {playerStats.map((p, i) => (
              <div key={p.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                <div className={`w-6 text-center font-bold ${i < 3 ? 'text-yellow-400' : 'text-white/30'}`}>{i + 1}</div>
                <Avatar name={p.name} colorIdx={p.avatar_idx} size="sm" />
                <div className="flex-1">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-white/40">{p.team_name} · {p.wins}胜/{p.matches}场</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-xl">{p.score}</div>
                  <div className="text-[10px] text-white/30">积分</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* 3. 历史记录 */}
        {view === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-purple-400" size={20} /> 比赛记录</h2>
            {matches.map(m => (
              <div key={m.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex justify-between items-center mb-3 text-xs text-white/30">
                  <span>{new Date(m.created_at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex gap-3">
                    <button onClick={() => setMatchEditModal({ show: true, data: { id: m.id, scoreA: m.score_a, scoreB: m.score_b } })} className="hover:text-white"><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteMatch(m.id)} className="hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  {/* Team A */}
                  <div className={`flex flex-col items-start ${m.winner === 'A' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="flex -space-x-2 mb-1">{m.team_a_ids.map(id => <Avatar key={id} name={getP(id).name} colorIdx={getP(id).avatar_idx} size="xs" className="border-slate-800" />)}</div>
                    <span className={`text-xs font-bold ${m.winner === 'A' ? 'text-emerald-400' : ''}`}>{m.winner === 'A' ? 'WIN' : 'LOSE'}</span>
                  </div>
                  {/* Score */}
                  <div className="text-xl font-mono font-bold bg-black/20 px-3 py-1 rounded">{m.score_a} : {m.score_b}</div>
                  {/* Team B */}
                  <div className={`flex flex-col items-end ${m.winner === 'B' ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="flex -space-x-2 mb-1">{m.team_b_ids.map(id => <Avatar key={id} name={getP(id).name} colorIdx={getP(id).avatar_idx} size="xs" className="border-slate-800" />)}</div>
                    <span className={`text-xs font-bold ${m.winner === 'B' ? 'text-emerald-400' : ''}`}>{m.winner === 'B' ? 'WIN' : 'LOSE'}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* 4. 比赛界面 */}
        {view === 'match' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => setView('lobby')} className="p-2 text-white/40 hover:text-white"><X /></button>
              {isMatchPoint && <span className="text-red-500 font-bold animate-pulse">MATCH POINT</span>}
              <button onClick={() => setIsEditingScore(true)} className="p-2 text-emerald-400 bg-emerald-500/10 rounded-full"><Edit2 size={18} /></button>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <ScoreCard team="A" players={matchData.teamA.map(getP)} score={matchData.scoreA} color="bg-emerald-500" onPlus={() => updateScore('A', 1)} onMinus={() => updateScore('A', -1)} />
              <div className="text-center text-white/20 font-bold">VS</div>
              <ScoreCard team="B" players={matchData.teamB.map(getP)} score={matchData.scoreB} color="bg-blue-500" onPlus={() => updateScore('B', 1)} onMinus={() => updateScore('B', -1)} />
            </div>
          </div>
        )}
      </main>

      {/* 底部导航 (Dock) */}
      {view !== 'match' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <nav className="flex items-center gap-1 bg-slate-800/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl">
            <NavBtn icon={<Users size={20} />} active={view === 'lobby'} onClick={() => { setView('lobby'); setIsManageMode(false); }} />
            <NavBtn icon={<Trophy size={20} />} active={view === 'rank'} onClick={() => setView('rank')} />
            <NavBtn icon={<Calendar size={20} />} active={view === 'history'} onClick={() => setView('history')} />
          </nav>
        </div>
      )}

      {/* 弹窗：添加/编辑选手 */}
      <AnimatePresence>
        {playerModal.show && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <form onSubmit={handlePlayerSubmit} className="bg-slate-800 border border-white/10 p-6 rounded-2xl w-full max-w-xs space-y-4">
              <h3 className="text-lg font-bold">{playerModal.type === 'add' ? '添加选手' : '编辑选手'}</h3>
              <input name="pname" defaultValue={playerModal.data?.name} placeholder="名字 (必填)" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-400" autoFocus />
              <input name="pteam" defaultValue={playerModal.data?.team_name} placeholder="队伍 (选填)" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-400" />
              <div className="flex gap-2"><button type="button" onClick={() => setPlayerModal({ show: false, type: 'add', data: null })} className="flex-1 py-3 bg-white/10 rounded-lg">取消</button><button type="submit" className="flex-1 py-3 bg-emerald-500 rounded-lg font-bold">保存</button></div>
            </form>
          </div>
        )}
      </AnimatePresence>

      {/* 弹窗：修改比分 */}
      <AnimatePresence>
        {(isEditingScore || matchEditModal.show) && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-slate-800 border border-white/10 p-6 rounded-2xl w-full max-w-xs space-y-4">
              <h3 className="text-lg font-bold text-center">修改比分</h3>
              <div className="flex justify-center gap-4">
                <input id="sA" type="number" defaultValue={isEditingScore ? matchData.scoreA : matchEditModal.data?.scoreA} className="w-20 h-16 text-3xl text-center bg-black/20 rounded-xl border border-white/10 focus:border-emerald-400 outline-none" />
                <input id="sB" type="number" defaultValue={isEditingScore ? matchData.scoreB : matchEditModal.data?.scoreB} className="w-20 h-16 text-3xl text-center bg-black/20 rounded-xl border border-white/10 focus:border-blue-400 outline-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setIsEditingScore(false); setMatchEditModal({ show: false, data: null }); }} className="flex-1 py-3 bg-white/10 rounded-lg">取消</button>
                <button onClick={() => {
                  const sA = document.getElementById('sA').value;
                  const sB = document.getElementById('sB').value;
                  if (isEditingScore) {
                    setMatchData(p => ({ ...p, scoreA: Number(sA), scoreB: Number(sB) }));
                    setIsEditingScore(false);
                  } else {
                    setMatchEditModal(p => ({ ...p, data: { ...p.data, scoreA: sA, scoreB: sB } }));
                    setTimeout(handleUpdateMatch, 0); // 触发更新
                  }
                }} className="flex-1 py-3 bg-emerald-500 rounded-lg font-bold">确认</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- 子组件 ---
const NavBtn = ({ icon, active, onClick }) => (
  <button onClick={onClick} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>{icon}</button>
);

const ScoreCard = ({ team, players, score, color, onPlus, onMinus }) => (
  <div className={`flex-1 relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-4 shadow-lg`}>
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} blur-[60px] opacity-20`} />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between"><div className="flex -space-x-2">{players.map(p => <Avatar key={p.id} name={p.name} colorIdx={p.avatar_idx} size="sm" className="border-slate-900" />)}</div><span className="text-xs font-bold opacity-30">TEAM {team}</span></div>
      <div className="flex items-center justify-between mt-2">
        <button onClick={onMinus} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/30"><Minus /></button>
        <span className="text-6xl font-black tracking-tighter">{score}</span>
        <button onClick={onPlus} className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg active:scale-95`}><Plus size={32} /></button>
      </div>
    </div>
  </div>
);