import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Calendar as CalIcon, Edit2, X, ChevronRight, UserPlus, Settings, Trash2, Minus, Plus, Grid, LayoutList, TrendingUp, Shield, Activity, Weight, Zap, Swords, ShieldCheck, Wind, Brain, Play, Star, Info, Sparkles, Save } from 'lucide-react';
import confetti from 'canvas-confetti';

// ==============================================
// 👇 Supabase 配置
// ==============================================
const SUPABASE_URL = 'https://thswfvpzdrhwlgzqpjsv.supabase.co';const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoc3dmdnB6ZHJod2xnenFwanN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDQ0ODgsImV4cCI6MjA3OTEyMDQ4OH0.LDmLb-YHJxNmVnFyYwSO36SWZ25Ny-kue7BLAb0Gl3o';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 专业球星数据库 (新增性别 gender) ---
const PRO_PLAYERS = [
  // --- 男选手 (M) ---
  { name: '林丹', gender: 'M', style: '全能控制/大心脏', desc: '羽毛球历史最伟大的运动员(GOAT)。早期暴力突击，后期控制大师，拥有无与伦比的心理素质。', attrs: { attr_power: 9, attr_speed: 9, attr_endurance: 9, attr_mentality: 10, attr_forehand: 9, attr_backhand: 8, attr_attack: 10, attr_defense: 9 } },
  { name: '李宗伟', gender: 'M', style: '极致速度/突击', desc: '无冕之王，拥有羽坛最顶级的步法和弹跳。他的变速突击和网前技术极具观赏性。', attrs: { attr_power: 7, attr_speed: 10, attr_endurance: 9, attr_mentality: 7, attr_forehand: 9, attr_backhand: 8, attr_attack: 10, attr_defense: 8 } },
  { name: '陶菲克', gender: 'M', style: '反手天才/网前', desc: '印尼羽毛球天才，以极其细腻的网前手感和世界第一的反手杀球闻名。', attrs: { attr_power: 7, attr_speed: 7, attr_endurance: 6, attr_mentality: 8, attr_forehand: 8, attr_backhand: 10, attr_attack: 8, attr_defense: 7 } },
  { name: '谌龙', gender: 'M', style: '防守反击/高墙', desc: '拥有极其稳健的防守能力，被称为“不可逾越的高墙”。擅长通过多拍拉吊消耗对手体力。', attrs: { attr_power: 8, attr_speed: 7, attr_endurance: 10, attr_mentality: 9, attr_forehand: 8, attr_backhand: 8, attr_attack: 7, attr_defense: 10 } },
  { name: '安赛龙', gender: 'M', style: '强力进攻/覆盖', desc: '丹麦巨人，身高臂长带来的超大防守覆盖面积，配合极具威胁的下压进攻。', attrs: { attr_power: 10, attr_speed: 7, attr_endurance: 9, attr_mentality: 9, attr_forehand: 9, attr_backhand: 7, attr_attack: 10, attr_defense: 8 } },
  { name: '桃田贤斗', gender: 'M', style: '体能/拉吊控制', desc: '以不知疲倦的跑动和零失误的网前控制著称。擅长在多拍相持中寻找对手破绽。', attrs: { attr_power: 6, attr_speed: 8, attr_endurance: 10, attr_mentality: 8, attr_forehand: 8, attr_backhand: 7, attr_attack: 6, attr_defense: 10 } },
  { name: '傅海峰', gender: 'M', style: '重炮手/后场', desc: '传奇男双后场，杀球势大力沉，最高时速曾破记录，是“风云组合”的进攻核心。', attrs: { attr_power: 10, attr_speed: 8, attr_endurance: 8, attr_mentality: 9, attr_forehand: 9, attr_backhand: 6, attr_attack: 10, attr_defense: 7 } },
  { name: '亨德拉', gender: 'M', style: '网前雨刷/意识', desc: '印尼男双传奇，网前意识极佳，无需大幅度跑动就能通过软挡和分球掌控比赛节奏。', attrs: { attr_power: 5, attr_speed: 6, attr_endurance: 5, attr_mentality: 10, attr_forehand: 10, attr_backhand: 9, attr_attack: 7, attr_defense: 8 } },
  
  // --- 女选手 (F) ---
  { name: '戴资颖', gender: 'F', style: '假动作/魔术师', desc: '女单技术流巅峰，球风怪异灵动，擅长使用各种假动作欺骗对手重心，极具创造力。', attrs: { attr_power: 6, attr_speed: 8, attr_endurance: 8, attr_mentality: 7, attr_forehand: 10, attr_backhand: 9, attr_attack: 8, attr_defense: 6 } },
  { name: '安洗莹', gender: 'F', style: '天才防守/体能', desc: '韩国天才少女，拥有令人绝望的防守能力和跑动能力，几乎没有失误，被称为“女版桃田”。', attrs: { attr_power: 7, attr_speed: 8, attr_endurance: 10, attr_mentality: 9, attr_forehand: 8, attr_backhand: 8, attr_attack: 7, attr_defense: 10 } },
  { name: '陈雨菲', gender: 'F', style: '大帝/稳健拉吊', desc: '国羽女单领军人物，打法极其稳健，防守反击能力极强，心理素质过硬，也是“大心脏”代表。', attrs: { attr_power: 7, attr_speed: 8, attr_endurance: 9, attr_mentality: 10, attr_forehand: 8, attr_backhand: 8, attr_attack: 7, attr_defense: 9 } },
  { name: '马林', gender: 'F', style: '狮子吼/速度进攻', desc: '西班牙名将，以极快的移动速度和凶狠的进攻著称，比赛中气势逼人，是女子打法男性化的代表。', attrs: { attr_power: 9, attr_speed: 10, attr_endurance: 8, attr_mentality: 9, attr_forehand: 9, attr_backhand: 7, attr_attack: 10, attr_defense: 7 } },
  { name: '山口茜', gender: 'F', style: '小马达/跑不死', desc: '日本名将，虽然身材矮小但跑动能力极强，身体柔韧性极佳，经常救起看似不可能的球。', attrs: { attr_power: 6, attr_speed: 9, attr_endurance: 10, attr_mentality: 8, attr_forehand: 8, attr_backhand: 7, attr_attack: 7, attr_defense: 9 } },
  { name: '张宁', gender: 'F', style: '坚韧/大赛女王', desc: '两届奥运会女单冠军，大器晚成。打法硬朗，多拍相持能力极强，是意志力最坚韧的代表。', attrs: { attr_power: 8, attr_speed: 6, attr_endurance: 10, attr_mentality: 10, attr_forehand: 8, attr_backhand: 8, attr_attack: 8, attr_defense: 8 } },
  { name: '拉查诺', gender: 'F', style: '天才少女/技术流', desc: '泰国天才，拥有教科书般标准的动作和极其细腻的手感，打法轻盈，观赏性极高。', attrs: { attr_power: 6, attr_speed: 7, attr_endurance: 6, attr_mentality: 7, attr_forehand: 10, attr_backhand: 9, attr_attack: 8, attr_defense: 6 } },
  { name: '赵芸蕾', gender: 'F', style: '双打女王/全能', desc: '集奥运会女双、混双冠军于一身。网前封网意识极强，分球合理，是女双历史上的定海神针。', attrs: { attr_power: 7, attr_speed: 9, attr_endurance: 8, attr_mentality: 10, attr_forehand: 9, attr_backhand: 9, attr_attack: 8, attr_defense: 9 } },
];

const ATTRS = [
  { key: 'attr_power', label: '力量', icon: <Weight size={12}/> },
  { key: 'attr_speed', label: '速度', icon: <Wind size={12}/> },
  { key: 'attr_endurance', label: '耐力', icon: <Zap size={12}/> },
  { key: 'attr_mentality', label: '心态', icon: <Brain size={12}/> },
  { key: 'attr_forehand', label: '正手', icon: <Swords size={12}/> },
  { key: 'attr_backhand', label: '反手', icon: <Swords size={12} className="rotate-180"/> },
  { key: 'attr_attack', label: '进攻', icon: <Swords size={12}/> },
  { key: 'attr_defense', label: '防守', icon: <ShieldCheck size={12}/> },
];

const COLORS = [
  'from-rose-500 to-red-600', 'from-blue-500 to-indigo-600', 'from-emerald-500 to-green-600',
  'from-amber-500 to-orange-600', 'from-fuchsia-500 to-purple-600', 'from-cyan-500 to-sky-600',
];

// --- 辅助组件 ---
const Avatar = ({ name, colorIdx, size = 'md', className = '' }) => {
  const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl', xl: 'w-24 h-24 text-4xl' };
  const safeColor = COLORS[(colorIdx || 0) % COLORS.length];
  return (
    <div className={`rounded-full bg-gradient-to-br ${safeColor} flex items-center justify-center text-white font-bold shadow-md border border-white/10 ${sizes[size]} ${className}`}>
      {name ? name[0].toUpperCase() : '?'}
    </div>
  );
};

// --- 核心逻辑 ---
const checkBadmintonWinner = (sA, sB) => {
  const nA = Number(sA); const nB = Number(sB);
  if (nA === 30) return 'A'; if (nB === 30) return 'B';
  if (nA < 21 && nB < 21) return null;
  if (Math.abs(nA - nB) >= 2) return nA > nB ? 'A' : 'B';
  return null;
};

const calculateRating = (player, winRate) => {
  const attrSum = ATTRS.reduce((acc, curr) => acc + (player[curr.key] || 5), 0);
  const techScore = (attrSum / 8) * 10;
  return Math.round(techScore * 0.7 + (winRate * 100) * 0.3);
};

// 相似球星匹配逻辑 (区分性别)
const findSimilarPro = (player) => {
  let minDiff = Infinity;
  // 根据选手性别筛选目标池，如果没填性别默认按男选手匹配
  const targetGender = player.gender === 'F' ? 'F' : 'M';
  const candidates = PRO_PLAYERS.filter(p => p.gender === targetGender);
  
  // 如果筛选后没有候选人(极端情况), 回退到所有人
  const pool = candidates.length > 0 ? candidates : PRO_PLAYERS;
  let match = pool[0];

  pool.forEach(pro => {
    let diffSum = 0;
    ATTRS.forEach(attr => diffSum += Math.pow((player[attr.key] || 5) - pro.attrs[attr.key], 2));
    const dist = Math.sqrt(diffSum);
    if (dist < minDiff) { minDiff = dist; match = pro; }
  });
  return match;
};

const predictWinRate = (teamAIds, teamBIds, players) => {
  const getTeamPower = (ids) => {
    let total = 0;
    ids.forEach(id => {
      const p = players.find(x => x.id === id);
      if (!p) return;
      const attrSum = ATTRS.reduce((acc, curr) => acc + (p[curr.key] || 5), 0);
      const winRate = p.matches > 0 ? p.wins / p.matches : 0;
      total += attrSum + (winRate * 20); 
    });
    return total;
  };
  const powerA = getTeamPower(teamAIds); const powerB = getTeamPower(teamBIds);
  const total = powerA + powerB;
  if (total === 0) return { a: 50, b: 50 };
  const rateA = Math.round((powerA / total) * 100);
  return { a: rateA, b: 100 - rateA };
};

// --- 雷达图 ---
const RadarChart = ({ data, label, color = '#10B981' }) => {
  const size = 160; const center = size / 2; const radius = 60;
  const angleStep = (Math.PI * 2) / ATTRS.length;
  const points = ATTRS.map((attr, i) => { const value = data[attr.key] || 5; const r = (value / 10) * radius; return `${center + r * Math.cos(i * angleStep - Math.PI / 2)},${center + r * Math.sin(i * angleStep - Math.PI / 2)}`; }).join(' ');
  const levels = [3, 6, 9];
  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {levels.map(l => (<polygon key={l} points={ATTRS.map((_, i) => { const r = (l / 10) * radius; return `${center + r * Math.cos(i * angleStep - Math.PI / 2)},${center + r * Math.sin(i * angleStep - Math.PI / 2)}`; }).join(' ')} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />))}
        {ATTRS.map((_, i) => { const x = center + radius * Math.cos(i * angleStep - Math.PI / 2); const y = center + radius * Math.sin(i * angleStep - Math.PI / 2); return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" /> })}
        <motion.polygon initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.6, scale: 1, points }} transition={{ type: "spring", stiffness: 50 }} fill={color} stroke={color} strokeWidth="2" fillOpacity="0.3" />
        {ATTRS.map((attr, i) => { const rLabel = radius + 15; const x = center + rLabel * Math.cos(i * angleStep - Math.PI / 2); const y = center + rLabel * Math.sin(i * angleStep - Math.PI / 2); return <foreignObject key={i} x={x - 20} y={y - 8} width="40" height="16"><div className="text-[8px] text-white/50 text-center flex justify-center items-center">{attr.label}</div></foreignObject> })}
      </svg>
      {label && <div className="absolute bottom-0 font-bold text-white text-sm">{label}</div>}
    </div>
  );
};

// --- 主应用 ---
export default function App() {
  const [view, setView] = useState('lobby');
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [matchData, setMatchData] = useState({ teamA: [], teamB: [], scoreA: 0, scoreB: 0 });
  const [matchPointTeam, setMatchPointTeam] = useState(null);
  
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [rankTab, setRankTab] = useState('player');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDateMatches, setSelectedDateMatches] = useState([]);
  const [isManageMode, setIsManageMode] = useState(false);
  const [playerModal, setPlayerModal] = useState({ show: false, type: 'add', data: null });
  const [matchEditModal, setMatchEditModal] = useState({ show: false, data: null });
  const [proModal, setProModal] = useState({ show: false, data: null });

  useEffect(() => {
    fetchData();
    const sub = supabase.channel('public:badminton').on('postgres_changes', { event: '*', schema: 'public', table: '*' }, fetchData).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const fetchData = async () => {
    const { data: pData } = await supabase.from('players').select('*').order('created_at');
    const { data: mData } = await supabase.from('matches').select('*').order('created_at', { ascending: false });
    if (pData) setPlayers(pData);
    if (mData) setMatches(mData);
    setLoading(false);
  };

  const stats = useMemo(() => {
    const pStats = {}; const tStats = {};
    players.forEach(p => { pStats[p.id] = { ...p, wins: 0, matches: 0, score: 0 }; });
    matches.forEach(m => {
      const winners = m.winner === 'A' ? m.team_a_ids : m.team_b_ids;
      [...m.team_a_ids, ...m.team_b_ids].forEach(pid => { if (pStats[pid]) { pStats[pid].matches++; if (winners.includes(pid)) { pStats[pid].wins++; pStats[pid].score += 3; } else { pStats[pid].score += 1; } } });
    });
    Object.values(pStats).forEach(p => {
      const tName = p.team_name || '自由人';
      if (!tStats[tName]) tStats[tName] = { name: tName, score: 0, wins: 0, matches: 0, count: 0 };
      tStats[tName].score += p.score; tStats[tName].wins += p.wins; tStats[tName].matches += p.matches; tStats[tName].count++;
      p.rating = calculateRating(p, p.matches > 0 ? p.wins / p.matches : 0);
      p.similarPro = findSimilarPro(p);
    });
    const rStats = JSON.parse(JSON.stringify(pStats));
    const recent = matches.slice(0, 5);
    Object.values(rStats).forEach(p => { p.score = 0; p.wins = 0; p.matches = 0; });
    recent.forEach(m => { const winners = m.winner === 'A' ? m.team_a_ids : m.team_b_ids; [...m.team_a_ids, ...m.team_b_ids].forEach(pid => { if(rStats[pid]) { rStats[pid].matches++; if(winners.includes(pid)) rStats[pid].score+=3; else rStats[pid].score+=1; } }) });
    return { player: Object.values(pStats).sort((a, b) => b.score - a.score), team: Object.values(tStats).sort((a, b) => b.score - a.score), rising: Object.values(rStats).filter(p => p.matches > 0).sort((a, b) => b.score - a.score) };
  }, [players, matches]);

  const getRadarData = () => {
    if (selectedPlayers.length === 0) return null;
    if (selectedPlayers.length === 1) {
      const p = stats.player.find(p => p.id === selectedPlayers[0]);
      return { data: p, label: p.name, sub: `风格：${p.similarPro?.name}`, color: '#10B981', isPro: false };
    }
    const selectedObjs = players.filter(p => selectedPlayers.includes(p.id));
    const avgData = {}; ATTRS.forEach(attr => { avgData[attr.key] = selectedObjs.reduce((acc, curr) => acc + (curr[attr.key] || 5), 0) / selectedObjs.length; });
    return { data: avgData, label: selectedPlayers.length === 2 ? "双打组合" : "团队均值", sub: "综合能力模型", color: '#FBBF24', isPro: false };
  };

  const calendarGrid = useMemo(() => {
    const year = calendarDate.getFullYear(); const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); const firstDay = new Date(year, month, 1).getDay();
    const matchDays = new Set(); matches.forEach(m => { const d = new Date(m.created_at); if (d.getFullYear() === year && d.getMonth() === month) matchDays.add(d.getDate()); });
    return { daysInMonth, firstDay, matchDays, year, month };
  }, [calendarDate, matches]);

  const startMatch = () => {
    if (selectedPlayers.length !== 2 && selectedPlayers.length !== 4) return;
    const mid = Math.ceil(selectedPlayers.length / 2);
    setMatchData({ teamA: selectedPlayers.slice(0, mid), teamB: selectedPlayers.slice(mid), scoreA: 0, scoreB: 0 });
    setView('match');
  };

  const updateScore = (team, delta) => {
    setMatchData(prev => {
      const key = team === 'A' ? 'scoreA' : 'scoreB'; const newScore = Math.max(0, Number(prev[key]) + delta);
      const ns = { ...prev, [key]: newScore }; const w = checkBadmintonWinner(ns.scoreA, ns.scoreB);
      const nextA = checkBadmintonWinner(Number(ns.scoreA) + 1, ns.scoreB); const nextB = checkBadmintonWinner(ns.scoreA, Number(ns.scoreB) + 1);
      if (nextA === 'A') setMatchPointTeam('A'); else if (nextB === 'B') setMatchPointTeam('B'); else setMatchPointTeam(null);
      if (w) handleFinishMatch(w, ns);
      return ns;
    });
  };

  const handleDirectScoreChange = (team, val) => {
    const numVal = parseInt(val) || 0;
    setMatchData(prev => ({ ...prev, [team === 'A' ? 'scoreA' : 'scoreB']: numVal }));
  };

  const checkWinOnBlur = () => {
    const w = checkBadmintonWinner(matchData.scoreA, matchData.scoreB);
    if (w) handleFinishMatch(w, matchData);
    else {
      const nextA = checkBadmintonWinner(Number(matchData.scoreA) + 1, matchData.scoreB);
      const nextB = checkBadmintonWinner(matchData.scoreA, Number(matchData.scoreB) + 1);
      if (nextA === 'A') setMatchPointTeam('A'); else if (nextB === 'B') setMatchPointTeam('B'); else setMatchPointTeam(null);
    }
  };

  const handleFinishMatch = async (winner, finalState) => {
    if(view !== 'match') return;
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 }, colors: ['#34D399', '#FBBF24', '#FFFFFF'] });
    await supabase.from('matches').insert([{ team_a_ids: finalState.teamA, team_b_ids: finalState.teamB, score_a: finalState.scoreA, score_b: finalState.scoreB, winner }]);
    fetchData(); setTimeout(() => { setView('calendar'); setSelectedPlayers([]); setMatchPointTeam(null); }, 2000);
  };

  const handlePlayerSave = async (e) => {
    e.preventDefault(); const form = new FormData(e.target); const payload = {};
    ['pname','pteam','gender','height','weight'].forEach(k => payload[k==='pname'?'name':k==='pteam'?'team_name':k] = form.get(k));
    ATTRS.forEach(a => payload[a.key] = form.get(a.key));
    if (playerModal.type === 'add') await supabase.from('players').insert([{ ...payload, avatar_idx: Math.floor(Math.random() * COLORS.length) }]);
    else await supabase.from('players').update(payload).eq('id', playerModal.data.id);
    setPlayerModal({ show: false, type: 'add', data: null }); fetchData();
  };

  const handleQuickSetScore = (sA, sB) => {
    const newState = { ...matchData, scoreA: Number(sA), scoreB: Number(sB) };
    setMatchData(newState); setIsEditingScore(false);
    const winner = checkBadmintonWinner(newState.scoreA, newState.scoreB);
    if (winner) setTimeout(() => handleFinishMatch(winner, newState), 500);
  };
  const handleUpdateMatchHistory = async () => { const { id, scoreA, scoreB } = matchEditModal.data; let winner = checkBadmintonWinner(scoreA, scoreB); if (!winner) winner = Number(scoreA) > Number(scoreB) ? 'A' : 'B'; await supabase.from('matches').update({ score_a: Number(scoreA), score_b: Number(scoreB), winner }).eq('id', id); setMatchEditModal({ show: false, data: null }); fetchData(); };
  const handleDeleteMatch = async (id) => { if(window.confirm('确定删除记录？')) { await supabase.from('matches').delete().eq('id', id); fetchData(); } };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
      {view !== 'match' && (
        <header className="relative z-20 px-6 pt-8 pb-2 flex justify-between items-center bg-slate-950/80 backdrop-blur border-b border-white/5">
          <h1 onClick={()=>setView('lobby')} className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 cursor-pointer">SMASH.</h1>
        </header>
      )}
      <main className={`relative z-10 mx-auto h-full min-h-[90vh] px-4 pt-6 transition-all ${view === 'match' ? 'max-w-3xl' : 'max-w-7xl'}`}>
        {view === 'lobby' && (() => {
          const radar = getRadarData();
          return (
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400"><Users size={24}/> 选手名单</h2><div className="flex gap-3"><button onClick={() => setIsManageMode(!isManageMode)} className={`p-2 rounded-full transition-colors ${isManageMode ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60'}`}><Settings size={20} /></button><button onClick={() => setPlayerModal({ show: true, type: 'add' })} className="bg-white/10 p-2 rounded-full text-emerald-400"><UserPlus size={20} /></button></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stats.player.map(p => {
                    const isSel = selectedPlayers.includes(p.id);
                    return (
                      <div key={p.id} className="relative group">
                        <motion.button whileTap={{ scale: 0.98 }} onClick={() => !isManageMode && (isSel ? setSelectedPlayers(prev => prev.filter(id=>id!==p.id)) : selectedPlayers.length < 4 && setSelectedPlayers(prev=>[...prev, p.id]))} className={`w-full p-3 rounded-2xl border flex items-center gap-3 transition-all shadow-md ${isSel ? 'bg-emerald-500/10 border-emerald-400 ring-1 ring-emerald-400/50' : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/60'} ${isManageMode ? 'opacity-60' : ''}`}>
                          <Avatar name={p.name} colorIdx={p.avatar_idx} size="sm"/>
                          <div className="text-left flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1"><span className="font-bold text-white truncate">{p.name}</span><span className="text-[10px] font-black bg-yellow-500/20 text-yellow-400 px-1 rounded">{p.rating}</span></div>
                            <div className="text-xs text-white/40 flex items-center gap-2"><span>{p.team_name}</span>{p.similarPro && <span onClick={(e)=>{e.stopPropagation(); setProModal({show:true, data:p.similarPro})}} className="text-emerald-400/70 bg-emerald-500/5 px-1 rounded flex items-center gap-0.5 hover:bg-emerald-500/20 cursor-pointer z-20"><Star size={8}/> {p.similarPro.name}</span>}</div>
                          </div>
                          {isSel && !isManageMode && <div className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center"><Grid size={12} className="text-slate-900" /></div>}
                        </motion.button>
                        {isManageMode && (<div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-900/80 backdrop-blur-sm rounded-2xl z-10"><button onClick={() => setPlayerModal({ show: true, type: 'edit', data: p })} className="p-2 bg-blue-500 rounded-full shadow-xl"><Edit2 size={16} /></button><button onClick={async()=>{if(window.confirm('删?')) {await supabase.from('players').delete().eq('id', p.id); fetchData();}}} className="p-2 bg-red-500 rounded-full shadow-xl"><Trash2 size={16} /></button></div>)}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="hidden lg:flex w-96 flex-col bg-slate-800/30 border border-white/5 rounded-3xl p-6 items-center justify-center relative">
                 <h3 className="absolute top-6 left-6 font-bold text-white/40 flex items-center gap-2"><Activity size={18}/> 战术分析</h3>
                 {radar ? (<motion.div key={selectedPlayers.join(',')} initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="flex flex-col items-center"><RadarChart data={radar.data} label="" color={radar.color} /><div className="mt-6 text-center"><div className="text-2xl font-black text-white mb-1">{radar.label}</div><div className="text-sm text-white/40 px-4 mb-2">{radar.sub}</div></div></motion.div>) : (<div className="text-white/20 text-center"><Swords size={48} className="mx-auto mb-4 opacity-20"/><div>请选择选手<br/>查看能力分析</div></div>)}
              </div>
            </div>
          );
        })()}
        
        {view === 'rank' && (
          <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-400"><Trophy size={24}/> 排行榜</h2>
               <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10 w-64"><TabBtn active={rankTab==='player'} onClick={()=>setRankTab('player')} icon={<Users size={14}/>} label="个人" /><TabBtn active={rankTab==='team'} onClick={()=>setRankTab('team')} icon={<Shield size={14}/>} label="队伍" /><TabBtn active={rankTab==='rising'} onClick={()=>setRankTab('rising')} icon={<TrendingUp size={14}/>} label="飙升" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rankTab === 'player' && stats.player.map((p, i) => (
                <div key={p.id} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800 transition-colors">
                  <div className={`w-8 text-center font-black text-xl ${i<3?'text-yellow-400':'text-white/20'}`}>{i+1}</div>
                  <Avatar name={p.name} colorIdx={p.avatar_idx} />
                  <div className="flex-1 min-w-0"><div className="font-bold text-white truncate">{p.name}</div><div className="text-xs text-white/40 flex gap-2 items-center"><span>{p.wins}胜</span>{p.similarPro && <span onClick={(e)=>{e.stopPropagation(); setProModal({show:true, data:p.similarPro})}} className="bg-white/5 px-1 rounded cursor-pointer hover:text-emerald-400">像{p.similarPro.name}</span>}</div></div>
                  <div className="text-right"><div className="text-emerald-400 font-black text-xl">{p.score}</div><div className="text-[10px] text-white/30">积分</div></div>
                </div>
              ))}
              {rankTab === 'team' && stats.team.map((t, i) => (<div key={t.name} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4"><div className={`w-8 text-center font-black text-xl ${i<3?'text-yellow-400':'text-white/20'}`}>{i+1}</div><div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold">{t.name[0]}</div><div className="flex-1"><div className="font-bold text-white">{t.name}</div><div className="text-xs text-white/40">{t.matches}场比赛</div></div><div className="text-right"><div className="text-emerald-400 font-black text-xl">{t.score}</div><div className="text-[10px] text-white/30">总分</div></div></div>))}
              {rankTab === 'rising' && stats.rising.map((p, i) => (<div key={p.id} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4"><div className="text-emerald-400 font-bold text-xl w-8">+{p.score}</div><Avatar name={p.name} colorIdx={p.avatar_idx} /><div className="flex-1"><div className="font-bold text-white">{p.name}</div><div className="text-xs text-white/40">近5场状态</div></div><TrendingUp className="text-red-400" size={20} /></div>))}
            </div>
          </div>
        )}

        {view === 'calendar' && (() => {
          const { daysInMonth, firstDay, matchDays, year, month } = calendarGrid;
          return (
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
              <div className="flex-1 overflow-y-auto order-2 lg:order-1"><h2 className="text-xl font-bold flex items-center gap-2 text-purple-400 mb-4"><LayoutList size={24}/> 对局详情</h2>{selectedDateMatches.length > 0 ? (<div className="space-y-3">{selectedDateMatches.map(m => (<div key={m.id} className="bg-slate-800/50 border border-white/5 rounded-xl p-4 flex items-center justify-between"><div className="flex flex-col items-start w-1/3"><div className="flex -space-x-2 mb-1">{m.team_a_ids.map(id=><Avatar key={id} name={stats.player.find(p=>p.id===id)?.name} size="xs"/>)}</div><span className={`text-xs font-bold ${m.winner==='A'?'text-emerald-400':'text-white/30'}`}>Team A</span></div><div className="text-xl font-mono font-bold">{m.score_a}:{m.score_b}</div><div className="flex flex-col items-end w-1/3"><div className="flex -space-x-2 mb-1">{m.team_b_ids.map(id=><Avatar key={id} name={stats.player.find(p=>p.id===id)?.name} size="xs"/>)}</div><span className={`text-xs font-bold ${m.winner==='B'?'text-emerald-400':'text-white/30'}`}>Team B</span></div></div>))}</div>) : (<div className="text-white/20 text-center py-10 border border-dashed border-white/10 rounded-2xl">点击右侧日期<br/>查看当日比赛</div>)}</div>
              <div className="w-full lg:w-96 order-1 lg:order-2"><div className="bg-slate-800/40 border border-white/5 rounded-3xl p-6"><div className="flex justify-between items-center mb-6"><button onClick={()=>setCalendarDate(new Date(year, month-1, 1))} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight className="rotate-180" size={20}/></button><div className="font-bold text-lg">{year}年 {month+1}月</div><button onClick={()=>setCalendarDate(new Date(year, month+1, 1))} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight size={20}/></button></div><div className="grid grid-cols-7 gap-2">{['日','一','二','三','四','五','六'].map(d=><div key={d} className="text-xs text-white/30 text-center py-2">{d}</div>)}{Array(firstDay).fill(null).map((_,i)=><div key={`e-${i}`}/>)}{Array(daysInMonth).fill(null).map((_, i) => { const day = i + 1; const hasMatch = matchDays.has(day); return (<button key={day} onClick={() => setSelectedDateMatches(matches.filter(m => { const d = new Date(m.created_at); return d.getDate()===day && d.getMonth()===month && d.getFullYear()===year; }))} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all hover:bg-white/5 ${hasMatch ? 'bg-emerald-500/10 border-emerald-500/50 border' : 'bg-transparent'}`}><span className="text-white/80">{day}</span>{hasMatch && <div className="w-1.5 h-1.5 rounded-full mt-1 bg-emerald-400" />}</button>) })}</div></div></div>
            </div>
          );
        })()}

        {view === 'match' && (() => {
          const prediction = predictWinRate(matchData.teamA, matchData.teamB, stats.player);
          return (
            <div className="h-full flex flex-col max-w-md mx-auto pb-10">
              <div className="flex justify-between items-center mb-4"><button onClick={()=>setView('lobby')} className="p-3 bg-white/5 rounded-full text-white/60 hover:text-white"><X size={20}/></button>{matchPointTeam && <span className="text-red-500 text-xs font-black animate-pulse tracking-widest">⚠️ 赛点</span>}<button onClick={()=>setIsEditingScore(true)} className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full"><Edit2 size={20}/></button></div>
              <div className="mb-6 px-2"><div className="flex justify-between text-[10px] font-bold text-white/40 mb-1 uppercase tracking-wider"><span>AI Win Prediction</span><span>{prediction.a}% VS {prediction.b}%</span></div><div className="h-2 bg-slate-800 rounded-full overflow-hidden flex"><div style={{width: `${prediction.a}%`}} className="h-full bg-emerald-500 transition-all duration-1000"></div><div style={{width: `${prediction.b}%`}} className="h-full bg-blue-500 transition-all duration-1000"></div></div></div>
              <div className="flex-1 flex flex-col gap-6 justify-center">
                <ScoreCard team="A" players={matchData.teamA.map(id=>stats.player.find(p=>p.id===id)||{name:'?',colorIdx:0})} score={matchData.scoreA} color="bg-emerald-500" onPlus={()=>handleUpdateScore('A',1)} onMinus={()=>handleUpdateScore('A',-1)} onScoreChange={(val)=>handleDirectScoreChange('A', val)} checkWin={checkWinOnBlur} />
                <div className="text-center font-black text-2xl text-white/20 italic">VS</div>
                <ScoreCard team="B" players={matchData.teamB.map(id=>stats.player.find(p=>p.id===id)||{name:'?',colorIdx:0})} score={matchData.scoreB} color="bg-blue-500" onPlus={()=>handleUpdateScore('B',1)} onMinus={()=>handleUpdateScore('B',-1)} onScoreChange={(val)=>handleDirectScoreChange('B', val)} checkWin={checkWinOnBlur} />
              </div>
            </div>
          );
        })()}
      </main>

      {view !== 'match' && (<div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4"><nav className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl ring-1 ring-white/5"><NavBtn icon={<Users size={20} />} label="大厅" active={view === 'lobby'} onClick={() => setView('lobby')} /><NavBtn icon={<Trophy size={20} />} label="排行" active={view === 'rank'} onClick={() => setView('rank')} /><NavBtn icon={<CalIcon size={20} />} label="赛程" active={view === 'calendar'} onClick={() => setView('calendar')} /></nav><AnimatePresence>{(selectedPlayers.length === 2 || selectedPlayers.length === 4) && (<motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} onClick={startMatch} className="bg-emerald-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-110 transition-all border-4 border-slate-950"><Play fill="currentColor" size={24} /></motion.button>)}</AnimatePresence></div>)}
      
      {/* 模态框们 */}
      <Modal isOpen={playerModal.show}><form onSubmit={handlePlayerSave} className="space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide"><h3 className="text-xl font-bold text-center sticky top-0 bg-slate-900 pb-2 z-10">{playerModal.type === 'add' ? '创建选手' : '选手档案'}</h3><div className="grid grid-cols-2 gap-4"><div className="col-span-2"><label className="text-xs text-white/40 block mb-1">昵称</label><input name="pname" defaultValue={playerModal.data?.name} className="w-full bg-black/30 rounded-lg p-3 border border-white/10 outline-none focus:border-emerald-400" required /></div><div className="col-span-2"><label className="text-xs text-white/40 block mb-1">队伍</label><input name="pteam" defaultValue={playerModal.data?.team_name} className="w-full bg-black/30 rounded-lg p-3 border border-white/10 outline-none focus:border-emerald-400" /></div>
      <div className="col-span-2"><label className="text-xs text-white/40 block mb-1">性别</label><select name="gender" defaultValue={playerModal.data?.gender||'M'} className="w-full bg-black/30 rounded-lg p-3 border border-white/10 outline-none focus:border-emerald-400"><option value="M">男</option><option value="F">女</option></select></div>
      {ATTRS.map(attr => (<div key={attr.key} className="col-span-2 md:col-span-1"><div className="flex justify-between mb-1"><label className="text-xs text-white/60 flex items-center gap-1">{attr.icon} {attr.label}</label><span className="text-xs font-mono text-emerald-400 font-bold">0-10</span></div><input name={attr.key} type="range" min="0" max="10" defaultValue={playerModal.data?.[attr.key]||5} className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"/></div>))}</div><div className="flex gap-3 pt-4 sticky bottom-0 bg-slate-900 pt-2"><button type="button" onClick={()=>setPlayerModal({show:false, type:'add', data:null})} className="flex-1 py-3 bg-white/5 rounded-xl">取消</button><button type="submit" className="flex-1 py-3 bg-emerald-500 rounded-xl font-bold">保存</button></div></form></Modal>
      <Modal isOpen={isEditingScore || matchEditModal.show}><div className="space-y-6"><h3 className="text-xl font-bold text-center text-white">修正比分</h3><div className="flex justify-center items-center gap-6"><div className="text-center"><div className="text-xs text-emerald-400 mb-2 font-bold">TEAM A</div><input id="qsA" type="number" defaultValue={isEditingScore ? matchData.scoreA : matchEditModal.data?.scoreA} className="w-24 h-20 text-4xl text-center bg-black/30 text-white rounded-2xl border border-white/10 focus:border-emerald-400 outline-none font-mono" /></div><span className="text-2xl font-black text-white/20">:</span><div className="text-center"><div className="text-xs text-blue-400 mb-2 font-bold">TEAM B</div><input id="qsB" type="number" defaultValue={isEditingScore ? matchData.scoreB : matchEditModal.data?.scoreB} className="w-24 h-20 text-4xl text-center bg-black/30 text-white rounded-2xl border border-white/10 focus:border-blue-400 outline-none font-mono" /></div></div><div className="flex gap-3"><button onClick={() => { setIsEditingScore(false); setMatchEditModal({ show: false, data: null }); }} className="flex-1 py-3 bg-white/5 rounded-xl text-white/60">取消</button><button onClick={() => { const sA = document.getElementById('qsA').value; const sB = document.getElementById('qsB').value; if (isEditingScore) handleQuickSetScore(sA, sB); else handleUpdateMatchHistory(); }} className="flex-1 py-3 bg-emerald-500 rounded-xl text-white font-bold">确认</button></div></div></Modal>
      <Modal isOpen={proModal.show}>{proModal.data && (<div className="text-center space-y-6"><div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto flex items-center justify-center text-3xl font-black shadow-xl border-4 border-slate-900">{proModal.data.name[0]}</div><div><h3 className="text-2xl font-black text-white mb-1">{proModal.data.name}</h3><div className="text-emerald-400 font-bold text-sm uppercase tracking-wider">{proModal.data.style}</div></div><div className="bg-white/5 rounded-2xl p-4 text-sm text-white/70 leading-relaxed text-left border border-white/5 shadow-inner"><Sparkles size={16} className="inline-block mr-1 text-yellow-400"/> {proModal.data.desc}</div><div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5"><RadarChart data={proModal.data.attrs} label="传奇属性面板" color="#FBBF24" /></div><button onClick={()=>setProModal({show:false, data:null})} className="w-full py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20">关闭</button></div>)}</Modal>
    </div>
  );
}

// --- 子组件 ---
const ScoreCard = ({ team, players, score, color, onPlus, onMinus, onScoreChange, checkWin }) => (
  <div className={`flex-1 relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 p-5 shadow-2xl transition-transform active:scale-[0.99]`}>
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} blur-[80px] opacity-30`} />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start"><div className="flex -space-x-3">{players.map(p => <Avatar key={p.id} name={p.name} colorIdx={p.avatar_idx} size="md" className="border-slate-900 ring-4 ring-slate-900" />)}</div><span className="text-xs font-black opacity-20 tracking-widest text-white">TEAM {team}</span></div>
      <div className="flex items-end justify-between mt-4">
        <button onClick={onMinus} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/30 hover:bg-white/10 hover:text-white transition-colors"><Minus size={24}/></button>
        <input type="number" value={score} onChange={(e)=>onScoreChange(e.target.value)} onBlur={checkWin} onKeyDown={(e)=>{if(e.key==='Enter')checkWin()}} className="w-32 text-[5rem] leading-none font-black tracking-tighter drop-shadow-2xl font-mono text-center bg-transparent outline-none appearance-none text-white z-20" />
        <button onClick={onPlus} className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform text-white`}><Plus size={36} strokeWidth={3} /></button>
      </div>
    </div>
  </div>
);

const NavBtn = ({ icon, label, active, onClick }) => (<button onClick={onClick} className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${active ? 'bg-white/10 text-white font-bold shadow-inner' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5'}`}>{icon} {active && <span className="text-xs">{label}</span>}</button>);
const TabBtn = ({ active, onClick, icon, label }) => (<button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${active ? 'bg-emerald-500 text-white shadow-lg' : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}>{icon} {label}</button>);
const Modal = ({ isOpen, children }) => (<AnimatePresence>{isOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center px-4"><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" /><motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative w-full max-w-md bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">{children}</motion.div></div>)}</AnimatePresence>);