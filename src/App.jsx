import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Calendar as CalIcon, Edit2, X, ChevronRight, ChevronLeft, UserPlus, Settings, Trash2, Minus, Plus, Grid, LayoutList, TrendingUp, Shield, Activity, Weight, Zap, Swords, ShieldCheck, Wind, Brain, Play, Star, Sparkles, Download, Wallet, Scale, Medal, Swords as FightIcon, Info, CheckCircle, Filter, Quote } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

// ==============================================
// ⚠️ Config: Supabase Keys
// ==============================================
const SUPABASE_URL = 'https://thswfvpzdrhwlgzqpjsv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoc3dmdnB6ZHJod2xnenFwanN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDQ0ODgsImV4cCI6MjA3OTEyMDQ4OH0.LDmLb-YHJxNmVnFyYwSO36SWZ25Ny-kue7BLAb0Gl3o';

const supabase = SUPABASE_URL.startsWith('http') ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// --- 样式注入 ---
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    * { -webkit-tap-highlight-color: transparent; user-select: none; }
    input, select { user-select: text; }
    /* 确保背景铺满且无回弹白边 */
    html, body { background-color: #020617; margin: 0; padding: 0; height: 100%; overflow: hidden; }
  `}</style>
);

// --- 静态配置 (保持不变) ---
const PRO_PLAYERS = [
  { name: '林丹', gender: 'M', style: '全能控制 / 变速突击', attrs: { attr_power: 9, attr_speed: 9, attr_endurance: 9, attr_mentality: 10, attr_forehand: 9, attr_backhand: 8, attr_attack: 10, attr_defense: 9 }, honors: ['两届奥运会男单冠军', '五届世锦赛男单冠军'], description: 'GOAT。变速突击打法统治赛场。', quote: '只有坚持到最后的人，才能看到对手倒下。' },
  { name: '李宗伟', gender: 'M', style: '极致速度 / 弹簧腿', attrs: { attr_power: 7, attr_speed: 10, attr_endurance: 9, attr_mentality: 7, attr_forehand: 9, attr_backhand: 8, attr_attack: 10, attr_defense: 8 }, honors: ['三届奥运会男单银牌', '保持世界排名第一周数纪录'], description: '以鬼魅般的步伐和极致的突击速度著称。', quote: '败者为王，永不言弃。' },
  { name: '陶菲克', gender: 'M', style: '反手天才 / 网前魔术', attrs: { attr_power: 7, attr_speed: 7, attr_endurance: 6, attr_mentality: 8, attr_forehand: 8, attr_backhand: 10, attr_attack: 8, attr_defense: 7 }, honors: ['奥运会男单冠军', '世锦赛男单冠军'], description: '羽坛反手天花板，打球潇洒写意。', quote: '天赋是上天给的，但风格是自己创造的。' },
  { name: '安赛龙', gender: 'M', style: '立体进攻 / 铁壁防守', attrs: { attr_power: 10, attr_speed: 7, attr_endurance: 9, attr_mentality: 9, attr_forehand: 9, attr_backhand: 7, attr_attack: 10, attr_defense: 8 }, honors: ['奥运会男单冠军', '世锦赛男单冠军'], description: '拥有绝对的身高优势和极具威胁的下压进攻。', quote: '每一次杀球都是对胜利的渴望。' },
  { name: '傅海峰', gender: 'M', style: '麒麟臂 / 重炮手', attrs: { attr_power: 10, attr_speed: 8, attr_endurance: 8, attr_mentality: 9, attr_forehand: 9, attr_backhand: 6, attr_attack: 10, attr_defense: 7 }, honors: ['四届世锦赛男双冠军', '两届奥运会男双冠军'], description: '左手重炮，后场进攻能力处于人类巅峰。', quote: '唯有进攻，才能掌握命运。' },
  { name: '戴资颖', gender: 'F', style: '假动作大师 / 魔术师', attrs: { attr_power: 6, attr_speed: 8, attr_endurance: 8, attr_mentality: 7, attr_forehand: 10, attr_backhand: 9, attr_attack: 8, attr_defense: 6 }, honors: ['亚运会女单金牌', '全英赛冠军'], description: '羽坛魔术师，假动作极多，球路诡谲莫测。', quote: '快乐打球，享受比赛。' },
  { name: '安洗莹', gender: 'F', style: '天才防守 / 磨王', attrs: { attr_power: 7, attr_speed: 8, attr_endurance: 10, attr_mentality: 9, attr_forehand: 8, attr_backhand: 8, attr_attack: 7, attr_defense: 10 }, honors: ['世锦赛女单冠军', '亚运会双冠王'], description: '拥有令人绝望的防守能力和跑动耐力。', quote: '只要球没落地，比赛就没有结束。' },
  { name: '陈雨菲', gender: 'F', style: '大帝稳健 / 拉吊突击', attrs: { attr_power: 7, attr_speed: 8, attr_endurance: 9, attr_mentality: 10, attr_forehand: 8, attr_backhand: 8, attr_attack: 7, attr_defense: 9 }, honors: ['奥运会女单冠军', '苏迪曼杯主力'], description: '技术全面，失误极少，打法极其稳健。', quote: '稳住心态，就能赢下一切。' },
  { name: '马林', gender: 'F', style: '狮子吼 / 极速进攻', attrs: { attr_power: 9, attr_speed: 10, attr_endurance: 8, attr_mentality: 9, attr_forehand: 9, attr_backhand: 7, attr_attack: 10, attr_defense: 7 }, honors: ['奥运会女单冠军', '三届世锦赛女单冠军'], description: '以极快的速度和凶悍的进攻著称。', quote: '在场上，我就是女王。' },
];

const ATTRS = [
  { key: 'attr_power', label: '力量', icon: <Weight size={10}/> },
  { key: 'attr_speed', label: '速度', icon: <Wind size={10}/> },
  { key: 'attr_endurance', label: '耐力', icon: <Zap size={10}/> },
  { key: 'attr_mentality', label: '心态', icon: <Brain size={10}/> },
  { key: 'attr_forehand', label: '正手', icon: <Swords size={10}/> },
  { key: 'attr_backhand', label: '反手', icon: <Swords size={10} className="rotate-180"/> },
  { key: 'attr_attack', label: '进攻', icon: <Swords size={10}/> },
  { key: 'attr_defense', label: '防守', icon: <ShieldCheck size={10}/> },
];

const COLORS = ['from-rose-500 to-red-600', 'from-blue-500 to-indigo-600', 'from-emerald-500 to-green-600', 'from-amber-500 to-orange-600', 'from-fuchsia-500 to-purple-600', 'from-cyan-500 to-sky-600'];

// --- 核心函数 (保持不变) ---
const checkBadmintonWinCondition = (sA, sB) => {
  const nA = Number(sA), nB = Number(sB);
  if (nA === 30) return 'A'; if (nB === 30) return 'B';
  if ((nA >= 21 || nB >= 21) && Math.abs(nA - nB) >= 2) return nA > nB ? 'A' : 'B';
  return null;
};

const calculatePower = (player) => {
  if (!player) return 0;
  const attrSum = ATTRS.reduce((acc, curr) => acc + (player[curr.key] || 5), 0);
  const winRate = player.matches > 0 ? player.wins / player.matches : 0;
  return Math.round((attrSum / 8) * 10 * 0.7 + (winRate * 100) * 0.3);
};

const calculateHandicapValue = (powerA, powerB) => {
  const diff = Math.abs(powerA - powerB);
  const points = Math.floor(diff / 10);
  if (points === 0) return null;
  return { team: powerA > powerB ? 'A' : 'B', points };
};

const findSimilarPro = (player) => {
  let minDiff = Infinity; let match = PRO_PLAYERS[0];
  const targetGender = player.gender === 'F' ? 'F' : 'M';
  const candidates = PRO_PLAYERS.filter(p => p.gender === targetGender);
  (candidates.length > 0 ? candidates : PRO_PLAYERS).forEach(pro => {
    let diffSum = 0; ATTRS.forEach(attr => diffSum += Math.pow((player[attr.key] || 5) - pro.attrs[attr.key], 2));
    const dist = Math.sqrt(diffSum); if (dist < minDiff) { minDiff = dist; match = pro; }
  });
  return match;
};

// --- 组件 (保持不变) ---
const Avatar = ({ name, colorIdx, size = 'md', className = '' }) => {
  const sizes = { xs: 'w-8 h-8 text-[10px]', sm: 'w-10 h-10 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-xl', xl: 'w-20 h-20 text-2xl' };
  return (
    <div className={`rounded-full bg-gradient-to-br ${COLORS[(colorIdx||0)%COLORS.length]} flex items-center justify-center text-white font-bold shadow-md border border-white/10 ${sizes[size]} ${className} shrink-0`}>
      {name ? name[0].toUpperCase() : '?'}
    </div>
  );
};

const RecentForm = ({ results }) => {
  if (!results || results.length === 0) return null;
  return (
    <div className="flex items-center gap-0.5 mt-1.5">
      {results.slice(-5).map((res, i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${res === 'W' ? 'bg-emerald-400' : 'bg-rose-500/50'}`} />
      ))}
    </div>
  );
};

const RadarChart = ({ data, label, color = '#10B981' }) => {
  const size = 160; const center = size / 2; const radius = 60;
  const angleStep = (Math.PI * 2) / ATTRS.length;
  const levels = [3, 6, 9];
  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <svg width={size} height={size} className="overflow-visible">
        {levels.map(l => (<polygon key={l} points={ATTRS.map((_, i) => { const r = (l / 10) * radius; return `${center + r * Math.cos(i * angleStep - Math.PI / 2)},${center + r * Math.sin(i * angleStep - Math.PI / 2)}`; }).join(' ')} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />))}
        {ATTRS.map((_, i) => { const x = center + radius * Math.cos(i * angleStep - Math.PI / 2); const y = center + radius * Math.sin(i * angleStep - Math.PI / 2); return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" /> })}
        <motion.polygon initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.6, scale: 1, points: ATTRS.map((attr, i) => { const value = data[attr.key] || 5; const r = (value / 10) * radius; return `${center + r * Math.cos(i * angleStep - Math.PI / 2)},${center + r * Math.sin(i * angleStep - Math.PI / 2)}`; }).join(' ') }} transition={{ type: "spring", stiffness: 50 }} fill={color} stroke={color} strokeWidth="2" fillOpacity="0.3" />
        {ATTRS.map((attr, i) => { const rLabel = radius + 18; const x = center + rLabel * Math.cos(i * angleStep - Math.PI / 2); const y = center + rLabel * Math.sin(i * angleStep - Math.PI / 2); return <foreignObject key={i} x={x - 25} y={y - 10} width="50" height="20"><div className="text-[10px] text-white/60 text-center flex justify-center items-center">{attr.label}</div></foreignObject> })}
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
  const [expenses, setExpenses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [matchData, setMatchData] = useState({ teamA: [], teamB: [], scoreA: 0, scoreB: 0 });
  const [matchPointTeam, setMatchPointTeam] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [growthInfo, setGrowthInfo] = useState(null);
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const [lobbyTab, setLobbyTab] = useState('player');
  const [rankTab, setRankTab] = useState('player');
  const [currentSeasonId, setCurrentSeasonId] = useState('all');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDateMatches, setSelectedDateMatches] = useState([]);
  const [playerModal, setPlayerModal] = useState({ show: false, type: 'add', data: null });
  const [matchEditModal, setMatchEditModal] = useState({ show: false, data: null });
  const [radarModal, setRadarModal] = useState({ show: false, data: null });
  const [expenseModal, setExpenseModal] = useState(false);
  const [seasonModal, setSeasonModal] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchData();
    const sub = supabase.channel('public:badminton').on('postgres_changes', { event: '*', schema: 'public', table: '*' }, fetchData).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const fetchData = async () => {
    if (!supabase) return;
    const { data: p } = await supabase.from('players').select('*').order('created_at');
    const { data: m } = await supabase.from('matches').select('*').order('created_at', { ascending: false });
    const { data: e } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
    const { data: s } = await supabase.from('seasons').select('*').order('start_date', { ascending: false });
    if (p) setPlayers(p); if (m) setMatches(m); if (e) setExpenses(e); if (s) setSeasons(s);
    setLoading(false);
  };

  const stats = useMemo(() => {
    const pStats = {}; const pairStats = {};
    let filteredMatches = matches;
    if (currentSeasonId !== 'all') {
      const season = seasons.find(s => s.id === currentSeasonId);
      if (season) {
        const start = new Date(season.start_date).getTime(); const end = new Date(season.end_date).getTime() + 86400000;
        filteredMatches = matches.filter(m => { const t = new Date(m.created_at).getTime(); return t >= start && t < end; });
      }
    }
    players.forEach(p => { pStats[p.id] = { ...p, wins: 0, matches: 0, score: 0, history: [], recent: [] }; });
    const getTP = (ids) => ids.reduce((sum, id) => sum + calculatePower(players.find(p=>p.id===id)), 0);
    const sortedMatches = [...filteredMatches].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    sortedMatches.forEach(m => {
      const isWinA = m.winner === 'A'; const winners = isWinA ? m.team_a_ids : m.team_b_ids;
      const pA = getTP(m.team_a_ids); const pB = getTP(m.team_b_ids);
      const handicap = calculateHandicapValue(pA, pB);
      const scoreDiff = Math.abs(m.score_a - m.score_b);
      let winPoints = 2;
      if (handicap && ((isWinA && handicap.team === 'A' && scoreDiff > handicap.points) || (!isWinA && handicap.team === 'B' && scoreDiff > handicap.points))) winPoints = 3;

      [...m.team_a_ids, ...m.team_b_ids].forEach(pid => {
        if (pStats[pid]) {
          pStats[pid].matches++;
          if (winners.includes(pid)) { pStats[pid].wins++; pStats[pid].score += winPoints; pStats[pid].recent.push('W'); } 
          else { pStats[pid].recent.push('L'); }
          pStats[pid].history.push(calculatePower(pStats[pid]));
        }
      });

      if (m.team_a_ids.length === 2) {
         const pairId = [...m.team_a_ids].sort().join('-');
         if (!pairStats[pairId]) pairStats[pairId] = { id: pairId, ids: m.team_a_ids, wins: 0, matches: 0, score: 0, recent: [] };
         pairStats[pairId].matches++;
         if (isWinA) { pairStats[pairId].wins++; pairStats[pairId].score += winPoints; pairStats[pairId].recent.push('W'); } else { pairStats[pairId].recent.push('L'); }
      }
      if (m.team_b_ids.length === 2) {
         const pairId = [...m.team_b_ids].sort().join('-');
         if (!pairStats[pairId]) pairStats[pairId] = { id: pairId, ids: m.team_b_ids, wins: 0, matches: 0, score: 0, recent: [] };
         pairStats[pairId].matches++;
         if (!isWinA) { pairStats[pairId].wins++; pairStats[pairId].score += winPoints; pairStats[pairId].recent.push('W'); } else { pairStats[pairId].recent.push('L'); }
      }
    });

    const tStats = {};
    Object.values(pStats).forEach(p => {
      p.rating = calculatePower(p); p.similarPro = findSimilarPro(p); p.history = p.history.slice(-10); p.recent = p.recent.slice(-10);
      const tName = p.team_name || '自由人';
      if (!tStats[tName]) tStats[tName] = { name: tName, score: 0, wins: 0, matches: 0, count: 0 };
      tStats[tName].score += p.score; tStats[tName].wins += p.wins; tStats[tName].matches += p.matches; tStats[tName].count++;
    });

    const pairList = Object.values(pairStats).map(pair => {
      const p1 = pStats[pair.ids[0]]; const p2 = pStats[pair.ids[1]];
      const name = (p1 && p2) ? `${p1.name} & ${p2.name}` : '未知组合';
      const avgRating = (p1 && p2) ? (p1.rating + p2.rating) / 2 : 0;
      const attrs = {}; ATTRS.forEach(a => { const v1 = p1 ? (p1[a.key] || 5) : 5; const v2 = p2 ? (p2[a.key] || 5) : 5; attrs[a.key] = (v1 + v2) / 2; });
      return { ...pair, name, rating: Math.round(avgRating), recent: pair.recent.slice(-10), p1, p2, ...attrs };
    });

    const rStats = JSON.parse(JSON.stringify(pStats)); const recentMatch = filteredMatches.slice(0, 5);
    Object.values(rStats).forEach(p => { p.score = 0; p.matches = 0; });
    recentMatch.forEach(m => { const winners = m.winner === 'A' ? m.team_a_ids : m.team_b_ids; [...m.team_a_ids, ...m.team_b_ids].forEach(pid => { if(rStats[pid]) { rStats[pid].matches++; if(winners.includes(pid)) rStats[pid].score+=3; else rStats[pid].score+=1; } }) });

    return { 
      player: Object.values(pStats).sort((a, b) => b.score - a.score), 
      pair: pairList.sort((a, b) => b.score - a.score), 
      team: Object.values(tStats).sort((a, b) => b.score - a.score), 
      rising: Object.values(rStats).filter(p => p.matches > 0).sort((a, b) => b.score - a.score),
      raw: Object.values(pStats)
    };
  }, [players, matches, currentSeasonId, seasons]);

  const getH2H = () => {
    if (selectedPlayers.length !== 2) return null;
    const [id1, id2] = selectedPlayers;
    const commonMatches = matches.filter(m => (m.team_a_ids.includes(id1) && m.team_b_ids.includes(id2)) || (m.team_a_ids.includes(id2) && m.team_b_ids.includes(id1)));
    let p1Wins = 0; commonMatches.forEach(m => { const p1IsA = m.team_a_ids.includes(id1); if ((p1IsA && m.winner === 'A') || (!p1IsA && m.winner === 'B')) p1Wins++; });
    return { total: commonMatches.length, p1Wins, p2Wins: commonMatches.length - p1Wins };
  };

  const autoBalanceTeams = () => {
    if (selectedPlayers.length !== 4) return;
    const p = selectedPlayers.map(id => stats.raw.find(x => x.id === id)).filter(Boolean);
    if (p.length < 4) return;
    const combs = [{ a: [p[0], p[1]], b: [p[2], p[3]] }, { a: [p[0], p[2]], b: [p[1], p[3]] }, { a: [p[0], p[3]], b: [p[1], p[2]] }];
    let best = combs[0]; let minDiff = Infinity;
    combs.forEach(c => { const diff = Math.abs((c.a[0].rating + c.a[1].rating) - (c.b[0].rating + c.b[1].rating)); if (diff < minDiff) { minDiff = diff; best = c; } });
    setMatchData({ teamA: best.a.map(x => x.id), teamB: best.b.map(x => x.id), scoreA: 0, scoreB: 0 }); setView('match');
  };

  const startMatch = () => { const mid = Math.ceil(selectedPlayers.length / 2); setMatchData({ teamA: selectedPlayers.slice(0, mid), teamB: selectedPlayers.slice(mid), scoreA: 0, scoreB: 0 }); setView('match'); };
  const handleUpdateScore = (team, delta) => {
    const key = team === 'A' ? 'scoreA' : 'scoreB'; const newScore = Math.max(0, Number(matchData[key]) + delta);
    const ns = { ...matchData, [key]: newScore };
    const w = checkBadmintonWinCondition(ns.scoreA, ns.scoreB);
    const nextA = checkBadmintonWinCondition(Number(ns.scoreA) + 1, ns.scoreB); const nextB = checkBadmintonWinCondition(ns.scoreA, Number(ns.scoreB) + 1);
    setMatchData(ns);
    if (nextA === 'A') setMatchPointTeam('A'); else if (nextB === 'B') setMatchPointTeam('B'); else setMatchPointTeam(null);
    if (w && delta > 0) finishGame(w, ns); 
  };
  const handleDirectScoreChange = (team, val) => { setMatchData(prev => ({ ...prev, [team === 'A' ? 'scoreA' : 'scoreB']: parseInt(val)||0 })); };
  const manualFinishGame = () => { const w = checkBadmintonWinCondition(matchData.scoreA, matchData.scoreB); if (w) finishGame(w, matchData); };
  const updatePlayerGrowth = async (winnerIds, loserIds) => {
    const getAvgRating = (ids) => ids.reduce((sum, id) => sum + calculatePower(stats.raw.find(p=>p.id===id)), 0) / ids.length;
    const winRating = getAvgRating(winnerIds); const loseRating = getAvgRating(loserIds);
    if (winRating < loseRating) {
       const updates = []; const grownPlayers = [];
       for (const pid of winnerIds) {
         const player = players.find(p => p.id === pid); if (!player) continue;
         const randomAttr = ATTRS[Math.floor(Math.random() * ATTRS.length)];
         const currentVal = player[randomAttr.key] || 5;
         if (currentVal < 10) { updates.push(supabase.from('players').update({ [randomAttr.key]: currentVal + 1 }).eq('id', pid)); grownPlayers.push({ name: player.name, attr: randomAttr.label }); }
       }
       if (updates.length > 0) { await Promise.all(updates); setGrowthInfo(grownPlayers); }
    }
  };
  const finishGame = async (winner, finalState) => {
    if (gameResult) return;
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#34D399', '#FBBF24', '#FFFFFF'] });
    await supabase.from('matches').insert([{ team_a_ids: finalState.teamA, team_b_ids: finalState.teamB, score_a: finalState.scoreA, score_b: finalState.scoreB, winner }]);
    const winners = winner === 'A' ? finalState.teamA : finalState.teamB; const losers = winner === 'A' ? finalState.teamB : finalState.teamA;
    await updatePlayerGrowth(winners, losers);
    setGameResult({ ...finalState, winner }); fetchData();
  };
  
  const downloadShareCard = () => { const el = document.getElementById('share-card'); html2canvas(el, { backgroundColor: '#0f172a' }).then(canvas => { const link = document.createElement('a'); link.download = `SMASH_${Date.now()}.png`; link.href = canvas.toDataURL(); link.click(); }); };
  const handlePlayerSave = async (e) => { e.preventDefault(); const form = new FormData(e.target); const payload = {}; ['pname','pteam','gender','height','weight'].forEach(k => payload[k==='pname'?'name':k==='pteam'?'team_name':k] = form.get(k)); ATTRS.forEach(a => payload[a.key] = form.get(a.key)); if (playerModal.type === 'add') await supabase.from('players').insert([{ ...payload, avatar_idx: Math.floor(Math.random() * COLORS.length) }]); else await supabase.from('players').update(payload).eq('id', playerModal.data.id); setPlayerModal({ show: false, type: 'add', data: null }); fetchData(); };
  const handleQuickSetScore = (sA, sB) => { const ns = { ...matchData, scoreA: Number(sA), scoreB: Number(sB) }; const w = checkBadmintonWinCondition(ns.scoreA, ns.scoreB); if (w) { setMatchData(ns); setIsEditingScore(false); } else { alert("比分未达到获胜条件"); } };
  const handleUpdateMatchHistory = async () => { const { id, scoreA, scoreB } = matchEditModal.data; let w = checkBadmintonWinCondition(scoreA, scoreB); if (!w) w = Number(scoreA) > Number(scoreB) ? 'A' : 'B'; await supabase.from('matches').update({ score_a: Number(scoreA), score_b: Number(scoreB), winner: w }).eq('id', id); setMatchEditModal({ show: false, data: null }); fetchData(); };
  const handleDeleteMatch = async (id) => { if(window.confirm('确定删除？')) { await supabase.from('matches').delete().eq('id', id); fetchData(); setMatchEditModal({show: false, data: null}); } };
  const handleDeletePlayer = async (id) => { if(window.confirm('确定删除该选手？删除后历史数据可能会异常。')) { await supabase.from('players').delete().eq('id', id); fetchData(); setPlayerModal({show:false, type:'add', data:null}); } };
  const handleSeasonSave = async (e) => { e.preventDefault(); const form = new FormData(e.target); await supabase.from('seasons').insert([{ name: form.get('sname'), start_date: form.get('sstart'), end_date: form.get('send') }]); setSeasonModal(false); fetchData(); };

  const prediction = useMemo(() => {
     if(view!=='match') return null;
     const getPower = (ids) => ids.reduce((sum, id) => sum + calculatePower(stats.raw.find(p=>p.id===id)), 0);
     const pA = getPower(matchData.teamA); const pB = getPower(matchData.teamB);
     const total = pA + pB || 1;
     const handicap = calculateHandicapValue(pA, pB);
     return { rateA: Math.round(pA/total*100), rateB: Math.round(pB/total*100), handicap };
  }, [view, matchData, stats]);

  const calendarGrid = useMemo(() => {
    const year = calendarDate.getFullYear(); const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); const firstDay = new Date(year, month, 1).getDay();
    const matchDays = new Set(); matches.forEach(m => { const d = new Date(m.created_at); if (d.getFullYear() === year && d.getMonth() === month) matchDays.add(d.getDate()); });
    return { daysInMonth, firstDay, matchDays, year, month };
  }, [calendarDate, matches]);

  if (!supabase) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-8 text-center">Supabase not configured</div>
  }

  return (
    <>
      <GlobalStyles />
      
      {/* 
        ROOT CONTAINER:
        1. 去掉了 max-w 限制，直接 w-full 铺满屏幕 
        2. 使用 h-[100dvh] 确保在移动端高度正确
      */}
      <div className="h-[100dvh] w-full bg-slate-950 flex flex-col overflow-hidden text-white font-sans">
        
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none z-0" />
        
        {/* Header */}
        {view !== 'match' && (
          <header className="relative z-20 px-5 pt-12 pb-4 flex justify-between items-center bg-slate-950/90 backdrop-blur-md border-b border-white/5 shrink-0">
            <h1 onClick={()=>setView('lobby')} className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 cursor-pointer select-none">SMASH.</h1>
            <button onClick={()=>setExpenseModal(true)} className="bg-white/5 p-2.5 rounded-full hover:bg-white/10 active:scale-95 transition-transform"><Wallet size={20} className="text-emerald-400"/></button>
          </header>
        )}

        {/* 
           MAIN CONTENT:
           1. flex-1: 自动占据剩余高度
           2. w-full: 宽度铺满
           3. max-w-xl mx-auto: 在大屏幕上限制内容宽度居中，但在手机上（<xl）会铺满
        */}
        <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar w-full">
           <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-32 flex flex-col gap-4">
             
            {/* 1. 大厅 */}
            {view === 'lobby' && (
              <>
                <div className="flex justify-between items-center">
                     <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
                        <button onClick={()=>setLobbyTab('player')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${lobbyTab==='player'?'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20':'text-slate-400 hover:text-white'}`}>选手</button>
                        <button onClick={()=>setLobbyTab('pair')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${lobbyTab==='pair'?'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20':'text-slate-400 hover:text-white'}`}>组合</button>
                     </div>
                     <div className="flex gap-3">
                        <button onClick={() => setIsManageMode(!isManageMode)} className={`p-2.5 rounded-full transition-colors ${isManageMode ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/60 border border-white/5'}`}><Settings size={20} /></button>
                        <button onClick={() => setPlayerModal({ show: true, type: 'add' })} className="bg-white/5 border border-white/5 p-2.5 rounded-full text-emerald-400"><UserPlus size={20} /></button>
                     </div>
                </div>
                
                <AnimatePresence>{selectedPlayers.length === 2 && lobbyTab === 'player' && (() => { const h2h = getH2H(); if (h2h && h2h.total > 0) { const p1 = stats.raw.find(p=>p.id===selectedPlayers[0]); const p2 = stats.raw.find(p=>p.id===selectedPlayers[1]); return (<motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 border border-white/10 rounded-2xl p-3 flex items-center justify-between overflow-hidden shadow-lg"><div className="flex items-center gap-2"><Avatar name={p1.name} colorIdx={p1.avatar_idx} size="xs"/><span className="font-bold">{h2h.p1Wins}</span></div><div className="text-xs font-bold text-white/50 flex flex-col items-center gap-1"><FightIcon size={14}/><span>{h2h.total} 场</span></div><div className="flex items-center gap-2"><span className="font-bold">{h2h.p2Wins}</span><Avatar name={p2.name} colorIdx={p2.avatar_idx} size="xs"/></div></motion.div>) } })()}</AnimatePresence>

                {lobbyTab === 'player' ? (
                  <div className="grid grid-cols-1 gap-3">
                    {stats.player.map(p => {
                      const isSel = selectedPlayers.includes(p.id);
                      return (
                        <div key={p.id} className="relative group" onClick={() => !isManageMode && (isSel ? setSelectedPlayers(prev => prev.filter(id=>id!==p.id)) : selectedPlayers.length < 4 && setSelectedPlayers(prev=>[...prev, p.id]))}>
                          <div className={`w-full p-3 pr-4 rounded-2xl border flex items-center gap-4 transition-all shadow-lg active:scale-[0.98] duration-200 ${isSel ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30' : 'bg-slate-800/40 border-white/5'} ${isManageMode ? 'opacity-60' : ''}`}>
                            <Avatar name={p.name} colorIdx={p.avatar_idx} size="md"/>
                            <div className="text-left flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-white truncate text-base">{p.name}</span>
                                <span className="text-[10px] font-black bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">{p.rating}</span>
                              </div>
                              <div className="text-xs text-white/40 flex items-center gap-2 truncate">
                                <span className="truncate max-w-[100px]">{p.team_name}</span>
                                {p.similarPro && <span className="text-emerald-400/80 bg-emerald-500/10 px-1.5 rounded flex items-center gap-0.5 text-[10px] shrink-0"><Star size={9}/> {p.similarPro.name}</span>}
                              </div>
                              <RecentForm results={p.recent} />
                            </div>
                            <button onClick={(e)=>{e.stopPropagation(); setRadarModal({show:true, data:p})}} className="p-2.5 bg-white/5 text-emerald-400/80 hover:bg-emerald-500 hover:text-white rounded-full z-20 transition-colors border border-white/5 shrink-0"><Info size={18}/></button>
                            {isSel && !isManageMode && <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
                          </div>
                          {isManageMode && (
                            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-slate-900/90 backdrop-blur-sm rounded-2xl z-30 animate-in fade-in duration-200">
                              <button onClick={(e) => {e.stopPropagation(); setPlayerModal({ show: true, type: 'edit', data: p })}} className="p-3 bg-blue-600 rounded-full shadow-xl hover:scale-110 transition-transform text-white"><Edit2 size={20} /></button>
                              <button onClick={(e) => {e.stopPropagation(); handleDeletePlayer(p.id)}} className="p-3 bg-red-600 rounded-full shadow-xl hover:scale-110 transition-transform text-white"><Trash2 size={20} /></button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                     {stats.pair.length > 0 ? stats.pair.map(pair => (
                        <div key={pair.id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 pr-4 flex items-center gap-4 relative group active:scale-[0.98] transition-transform" onClick={()=>setRadarModal({show:true, data:pair, isPair:true})}>
                           <div className="flex -space-x-3 shrink-0"><Avatar name={pair.p1?.name} colorIdx={pair.p1?.avatar_idx} size="xs"/><Avatar name={pair.p2?.name} colorIdx={pair.p2?.avatar_idx} size="xs"/></div>
                           <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-white truncate">{pair.name}</div>
                              <div className="text-xs text-white/40">{pair.matches} 场</div>
                              <RecentForm results={pair.recent} />
                           </div>
                           <div className="text-right shrink-0"><div className="text-emerald-400 font-black text-lg">{pair.rating}</div></div>
                        </div>
                     )) : <div className="col-span-full text-center text-white/30 py-10">暂无固定组合数据</div>}
                  </div>
                )}
              </>
            )}

            {view === 'rank' && (
              <>
                <div className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border border-emerald-500/20 p-4 rounded-2xl flex items-start gap-3 shadow-lg"><Info size={18} className="text-emerald-400 mt-0.5 shrink-0"/><div className="text-xs text-white/80 space-y-1"><p className="font-bold text-emerald-400 mb-1">📜 积分规则说明</p><p>• 胜方 <span className="font-bold text-white">+2分</span>，负方 +0分。</p><p>• 若胜方 <span className="text-yellow-400">赢分 &gt; 建议让分</span>，额外 <span className="font-bold text-white">+1分</span>。</p><p>• 组合榜仅统计双打场次。</p></div></div>
                <div className="flex flex-col gap-4">
                   <div className="flex justify-between items-center">
                     <h2 className="text-lg font-bold flex items-center gap-2 text-yellow-400"><Trophy size={20}/> 排行榜</h2>
                     <div className="flex items-center gap-2"><select className="bg-slate-900 border border-white/10 rounded-lg text-xs p-2 outline-none text-white/80 max-w-[120px]" value={currentSeasonId} onChange={(e)=>setCurrentSeasonId(e.target.value)}><option value="all">全部赛季</option>{seasons.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select><button onClick={()=>setSeasonModal(true)} className="p-2 bg-white/5 border border-white/10 rounded-lg"><Plus size={14}/></button></div>
                   </div>
                   <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar"><TabBtn active={rankTab==='player'} onClick={()=>setRankTab('player')} icon={<Users size={14}/>} label="个人" /><TabBtn active={rankTab==='team'} onClick={()=>setRankTab('team')} icon={<Shield size={14}/>} label="队伍" /><TabBtn active={rankTab==='pair'} onClick={()=>setRankTab('pair')} icon={<Users size={14}/>} label="组合" /><TabBtn active={rankTab==='rising'} onClick={()=>setRankTab('rising')} icon={<TrendingUp size={14}/>} label="飙升" /></div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {rankTab === 'player' && stats.player.map((p, i) => (<div key={p.id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 pr-4 flex items-center gap-4 active:scale-[0.99] transition-transform" onClick={()=>setRadarModal({show:true, data:p})}><div className={`w-6 text-center font-black text-lg ${i<3?'text-yellow-400':'text-white/20'}`}>{i+1}</div><Avatar name={p.name} colorIdx={p.avatar_idx} size="sm" /><div className="flex-1 min-w-0"><div className="font-bold text-white truncate">{p.name}</div><RecentForm results={p.recent} /></div><div className="text-right"><div className="text-emerald-400 font-black text-lg">{p.score}</div><div className="text-[10px] text-white/30">PTS</div></div></div>))}
                  {rankTab === 'team' && stats.team.map((t, i) => (<div key={t.name} className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 pr-4 flex items-center gap-4"><div className={`w-6 text-center font-black text-lg ${i<3?'text-yellow-400':'text-white/20'}`}>{i+1}</div><div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-sm">{t.name[0]}</div><div className="flex-1"><div className="font-bold text-white">{t.name}</div><div className="text-xs text-white/40">{t.matches}场</div></div><div className="text-right"><div className="text-emerald-400 font-black text-lg">{t.score}</div><div className="text-[10px] text-white/30">总分</div></div></div>))}
                  {rankTab === 'pair' && stats.pair.map((t, i) => (<div key={t.id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 pr-4 flex items-center gap-4 active:scale-[0.99] transition-transform" onClick={()=>setRadarModal({show:true, data:t, isPair:true})}><div className={`w-6 text-center font-black text-lg ${i<3?'text-yellow-400':'text-white/20'}`}>{i+1}</div><div className="flex -space-x-2"><Avatar name={t.p1?.name} colorIdx={t.p1?.avatar_idx} size="xs"/><Avatar name={t.p2?.name} colorIdx={t.p2?.avatar_idx} size="xs"/></div><div className="flex-1 min-w-0"><div className="font-bold text-white text-sm truncate">{t.name}</div><RecentForm results={t.recent} /></div><div className="text-right"><div className="text-emerald-400 font-black text-lg">{t.score}</div><div className="text-[10px] text-white/30">PTS</div></div></div>))}
                  {rankTab === 'rising' && stats.rising.map((p, i) => (<div key={p.id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-3 pr-4 flex items-center gap-4" onClick={()=>setRadarModal({show:true, data:p})}><div className="text-emerald-400 font-bold text-lg w-6">+{p.score}</div><Avatar name={p.name} colorIdx={p.avatar_idx} size="sm"/><div className="flex-1"><div className="font-bold text-white">{p.name}</div><div className="text-xs text-white/40">近5场</div></div><TrendingUp className="text-red-400" size={18} /></div>))}
                </div>
              </>
            )}

            {view === 'calendar' && (() => {
              const { daysInMonth, firstDay, matchDays, year, month } = calendarGrid;
              return (
                <div className="flex flex-col gap-6">
                  <div className="w-full shrink-0">
                    <div className="bg-slate-800/40 border border-white/5 rounded-3xl p-4 shadow-lg">
                      <div className="flex justify-between items-center mb-4"><button onClick={()=>setCalendarDate(new Date(year, month-1, 1))} className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full shadow"><ChevronLeft size={20}/></button><div className="font-bold text-base">{year}年 {month+1}月</div><button onClick={()=>setCalendarDate(new Date(year, month+1, 1))} className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full shadow"><ChevronRight size={20}/></button></div><div className="grid grid-cols-7 gap-1">{['日','一','二','三','四','五','六'].map(d=><div key={d} className="text-xs text-white/30 text-center py-2">{d}</div>)}{Array(firstDay).fill(null).map((_,i)=><div key={`e-${i}`}/>)}{Array(daysInMonth).fill(null).map((_, i) => { const day = i + 1; const hasMatch = matchDays.has(day); return (<button key={day} onClick={() => setSelectedDateMatches(matches.filter(m => { const d = new Date(m.created_at); return d.getDate()===day && d.getMonth()===month && d.getFullYear()===year; }))} className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all hover:bg-white/5 ${hasMatch ? 'bg-emerald-500/10 border-emerald-500/50 border' : 'bg-transparent'}`}><span className="text-white/80 text-sm">{day}</span>{hasMatch && <div className="w-1 h-1 rounded-full mt-0.5 bg-emerald-400" />}</button>) })}</div>
                    </div>
                  </div>
                  <div className="w-full">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-purple-400 mb-4"><LayoutList size={20}/> 对局详情</h2>
                    {selectedDateMatches.length > 0 ? (<div className="space-y-3">{selectedDateMatches.map(m => (<div key={m.id} className="bg-slate-800/50 border border-white/5 rounded-xl p-3 relative group flex items-center justify-between active:scale-[0.99] transition-transform" onClick={() => setMatchEditModal({ show: true, data: { id: m.id, scoreA: m.score_a, scoreB: m.score_b } })}><div className="flex flex-col items-start w-1/3"><div className="flex -space-x-2 mb-1">{m.team_a_ids.map(id=><Avatar key={id} name={stats.raw.find(p=>p.id===id)?.name} size="xs"/>)}</div><span className={`text-[10px] font-bold ${m.winner==='A'?'text-emerald-400':'text-white/30'}`}>Team A</span></div><div className="text-lg font-mono font-bold">{m.score_a}:{m.score_b}</div><div className="flex flex-col items-end w-1/3"><div className="flex -space-x-2 mb-1">{m.team_b_ids.map(id=><Avatar key={id} name={stats.raw.find(p=>p.id===id)?.name} size="xs"/>)}</div><span className={`text-[10px] font-bold ${m.winner==='B'?'text-emerald-400':'text-white/30'}`}>Team B</span></div></div>))}</div>) : (<div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-2xl text-sm text-white/30"><CalIcon size={32} className="mb-2 opacity-50"/>点击日历查看比赛</div>)}
                  </div>
                </div>
              );
            })()}

            {view === 'match' && prediction && (
               <div className="h-full flex flex-col pb-6">
                 <div className="flex justify-between items-center mb-4 shrink-0"><button onClick={()=>setView('lobby')} className="p-3 bg-white/5 rounded-full text-white/60 hover:text-white"><X size={20}/></button>{matchPointTeam && <span className="text-red-500 text-xs font-black animate-pulse tracking-widest">⚠️ 赛点</span>}<button onClick={()=>setIsEditingScore(true)} className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full"><Edit2 size={20}/></button></div>
                 <div className="mb-4 px-2 shrink-0">
                   <div className="flex justify-between text-[10px] font-bold text-white/40 mb-1 uppercase tracking-wider"><span>AI Prediction</span><span>{prediction.rateA}% VS {prediction.rateB}%</span></div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden flex mb-2"><div style={{width: `${prediction.rateA}%`}} className="h-full bg-emerald-500 transition-all duration-1000"></div><div style={{width: `${prediction.rateB}%`}} className="h-full bg-blue-500 transition-all duration-1000"></div></div>
                   {prediction.handicap && (<div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 flex items-center justify-center gap-2 text-xs text-purple-300"><Scale size={14}/> 建议让分: <strong>Team {prediction.handicap.team}</strong> 让 <strong>{prediction.handicap.points}</strong> 分</div>)}
                 </div>
                 <div className="flex-1 flex flex-col gap-3 justify-center">
                   <ScoreCard team="A" players={matchData.teamA.map(id=>stats.raw.find(p=>p.id===id)||{name:'?',colorIdx:0})} score={matchData.scoreA} color="bg-emerald-500" onPlus={()=>handleUpdateScore('A',1)} onMinus={()=>handleUpdateScore('A',-1)} onScoreChange={(val)=>handleDirectScoreChange('A',val)} />
                   <div className="text-center font-black text-xl text-white/20 italic h-6 shrink-0">VS</div>
                   <ScoreCard team="B" players={matchData.teamB.map(id=>stats.raw.find(p=>p.id===id)||{name:'?',colorIdx:0})} score={matchData.scoreB} color="bg-blue-500" onPlus={()=>handleUpdateScore('B',1)} onMinus={()=>handleUpdateScore('B',-1)} onScoreChange={(val)=>handleDirectScoreChange('B',val)} />
                 </div>
                 <AnimatePresence>{checkBadmintonWinCondition(matchData.scoreA, matchData.scoreB) && (<motion.div initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} exit={{y:50, opacity:0}} className="absolute bottom-8 left-0 right-0 flex justify-center z-50"><button onClick={manualFinishGame} className="bg-emerald-500 text-white px-8 py-3 rounded-full shadow-2xl font-bold text-lg flex items-center gap-2 border-4 border-slate-900 animate-bounce"><CheckCircle size={24}/> 结束比赛</button></motion.div>)}</AnimatePresence>
               </div>
            )}
           </div>
        </main>

        {/* Bottom Nav - 固定在屏幕底部 */}
        {view !== 'match' && (
          <div className="fixed bottom-6 left-0 right-0 z-40 flex items-center justify-center gap-3 px-4 pointer-events-none">
            <nav className="flex items-center gap-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl ring-1 ring-white/5 pointer-events-auto">
              <NavBtn icon={<Users size={20} />} label="大厅" active={view === 'lobby'} onClick={() => setView('lobby')} />
              <NavBtn icon={<Trophy size={20} />} label="排行" active={view === 'rank'} onClick={() => setView('rank')} />
              <NavBtn icon={<CalIcon size={20} />} label="赛程" active={view === 'calendar'} onClick={() => setView('calendar')} />
            </nav>
            <AnimatePresence>{selectedPlayers.length === 4 && (<motion.button initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} onClick={autoBalanceTeams} className="pointer-events-auto bg-purple-500 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-xs border-2 border-slate-900 whitespace-nowrap"><Scale size={16}/> 智能分队</motion.button>)}</AnimatePresence>
            <AnimatePresence>{(selectedPlayers.length === 2 || selectedPlayers.length === 4) && (<motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} onClick={startMatch} className="pointer-events-auto bg-emerald-500 text-white p-3.5 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-110 transition-all border-4 border-slate-950"><Play fill="currentColor" size={22} /></motion.button>)}</AnimatePresence>
          </div>
        )}

        {/* Modals */}
        <Modal isOpen={expenseModal}><div className="space-y-4"><h3 className="text-xl font-bold text-center">费用记录 (AA)</h3><form onSubmit={async (e) => {e.preventDefault(); const form = new FormData(e.target); const amount = form.get('amount'); const title = form.get('title'); const payer = form.get('payer'); if(amount && title) { await supabase.from('expenses').insert([{ title, amount, payer_name: payer, involved_count: 4 }]); e.target.reset(); fetchData(); }}} className="bg-white/5 p-4 rounded-xl space-y-3"><input name="title" placeholder="项目" className="w-full bg-black/30 p-2 rounded border border-white/10 text-base" required /><div className="flex gap-2"><input name="amount" type="number" placeholder="金额" className="w-2/3 bg-black/30 p-2 rounded border border-white/10 text-base" required /><input name="payer" placeholder="付款人" className="w-1/3 bg-black/30 p-2 rounded border border-white/10 text-base" /></div><button className="w-full py-2 bg-emerald-500 rounded font-bold text-sm">记一笔</button></form><div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar">{expenses.map(e => (<div key={e.id} className="flex justify-between text-sm p-2 border-b border-white/5"><div><div className="text-white">{e.title}</div><div className="text-xs text-white/40">{new Date(e.created_at).toLocaleDateString()} · {e.payer_name}付</div></div><div className="text-right"><div className="font-mono font-bold text-emerald-400">¥{e.amount}</div><div className="text-xs text-white/40">人均 ¥{(e.amount/e.involved_count).toFixed(1)}</div></div></div>))}</div><button onClick={()=>setExpenseModal(false)} className="w-full py-3 bg-white/10 rounded-xl">关闭</button></div></Modal>
        <Modal isOpen={seasonModal}><div className="space-y-4"><h3 className="text-xl font-bold text-center">赛季管理</h3><form onSubmit={handleSeasonSave} className="bg-white/5 p-4 rounded-xl space-y-3"><input name="sname" placeholder="赛季名称 (如 2025春季)" className="w-full bg-black/30 p-2 rounded border border-white/10 text-base" required /><div className="flex gap-2"><input name="sstart" type="date" className="w-1/2 bg-black/30 p-2 rounded text-base" required /><input name="send" type="date" className="w-1/2 bg-black/30 p-2 rounded text-base" required /></div><button className="w-full py-2 bg-emerald-500 rounded font-bold">创建赛季</button></form><button onClick={()=>setSeasonModal(false)} className="w-full py-3 bg-white/10 rounded-xl">关闭</button></div></Modal>
        <Modal isOpen={playerModal.show && playerModal.type === 'add'}><form onSubmit={handlePlayerSave} className="space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar"><h3 className="text-lg font-bold text-center sticky top-0 bg-slate-900 pb-2 z-10">创建新选手</h3><div className="grid grid-cols-2 gap-3"><div className="col-span-2"><label className="text-xs text-white/40 block mb-1">昵称</label><input name="pname" className="w-full bg-black/30 rounded-lg p-3 border border-white/10 outline-none focus:border-emerald-400 text-base" required /></div><div className="col-span-2"><label className="text-xs text-white/40 block mb-1">队伍</label><input name="pteam" className="w-full bg-black/30 rounded-lg p-3 border border-white/10 outline-none focus:border-emerald-400 text-base" /></div><div className="col-span-2"><label className="text-xs text-white/40 block mb-1">性别</label><select name="gender" className="w-full bg-black/30 rounded-lg p-3 border border-white/10 outline-none focus:border-emerald-400 text-white text-base"><option value="M">男</option><option value="F">女</option></select></div>{ATTRS.map(attr => (<div key={attr.key} className="col-span-2 md:col-span-1"><div className="flex justify-between mb-1"><label className="text-xs text-white/60 flex items-center gap-1">{attr.icon} {attr.label}</label><span className="text-xs font-mono text-emerald-400 font-bold">0-10</span></div><input name={attr.key} type="range" min="0" max="10" defaultValue={5} className="w-full accent-emerald-500 h-6 bg-white/10 rounded-lg cursor-pointer"/></div>))}</div><div className="flex gap-3 pt-4 sticky bottom-0 bg-slate-900 pt-2"><button type="button" onClick={()=>setPlayerModal({show:false})} className="flex-1 py-3 bg-white/5 rounded-xl">取消</button><button type="submit" className="flex-1 py-3 bg-emerald-500 rounded-xl font-bold">保存</button></div></form></Modal>
        <Modal isOpen={playerModal.show && playerModal.type === 'edit'}>{playerModal.data ? (<div className="space-y-4"><div className="text-center"><Avatar name={playerModal.data.name} colorIdx={playerModal.data.avatar_idx} size="xl" className="mx-auto mb-2"/><h3 className="text-xl font-bold">{playerModal.data.name}</h3></div><form onSubmit={handlePlayerSave} className="space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar border-t border-white/10 pt-4"><div className="grid grid-cols-2 gap-3"><div className="col-span-2"><label className="text-xs text-white/40 block mb-1">昵称</label><input name="pname" defaultValue={playerModal.data.name} className="w-full bg-black/30 rounded-lg p-3 border border-white/10 outline-none text-base" /></div><div className="col-span-2"><label className="text-xs text-white/40 block mb-1">队伍</label><input name="pteam" defaultValue={playerModal.data.team_name} className="w-full bg-black/30 rounded-lg p-3 border border-white/10 outline-none text-base" /></div><div className="col-span-2"><label className="text-xs text-white/40 block mb-1">性别</label><select name="gender" defaultValue={playerModal.data.gender} className="w-full bg-black/30 rounded-lg p-3 border border-white/10 outline-none text-white text-base"><option value="M">男</option><option value="F">女</option></select></div>{ATTRS.map(attr => (<div key={attr.key} className="col-span-2 md:col-span-1"><div className="flex justify-between mb-1"><label className="text-xs text-white/60 flex items-center gap-1">{attr.icon} {attr.label}</label><span className="text-xs font-mono text-emerald-400 font-bold">0-10</span></div><input name={attr.key} type="range" min="0" max="10" defaultValue={playerModal.data[attr.key]||5} className="w-full accent-emerald-500 h-6 bg-white/10 rounded-lg cursor-pointer"/></div>))}</div><button className="w-full py-3 bg-emerald-500 rounded-xl font-bold">更新资料</button></form><button onClick={()=>setPlayerModal({show:false})} className="w-full py-3 bg-white/10 rounded-xl">关闭</button></div>) : null}</Modal>
        <Modal isOpen={isEditingScore || matchEditModal.show}><div className="space-y-6"><h3 className="text-lg font-bold text-center text-white">{matchEditModal.show ? '编辑历史比分' : '修正比分'}</h3><div className="flex justify-center items-center gap-6"><div className="text-center"><div className="text-xs text-emerald-400 mb-2 font-bold">TEAM A</div><input id="qsA" type="number" pattern="\d*" defaultValue={isEditingScore ? matchData.scoreA : matchEditModal.data?.scoreA} className="w-24 h-20 text-4xl text-center bg-black/30 text-white rounded-2xl border border-white/10 focus:border-emerald-400 outline-none font-mono" /></div><span className="text-2xl font-black text-white/20">:</span><div className="text-center"><div className="text-xs text-blue-400 mb-2 font-bold">TEAM B</div><input id="qsB" type="number" pattern="\d*" defaultValue={isEditingScore ? matchData.scoreB : matchEditModal.data?.scoreB} className="w-24 h-20 text-4xl text-center bg-black/30 text-white rounded-2xl border border-white/10 focus:border-blue-400 outline-none font-mono" /></div></div><div className="flex gap-3"><button onClick={() => { setIsEditingScore(false); setMatchEditModal({ show: false, data: null }); }} className="flex-1 py-3 bg-white/5 rounded-xl text-white/60">取消</button><button onClick={() => { const sA = document.getElementById('qsA').value; const sB = document.getElementById('qsB').value; if (isEditingScore) handleQuickSetScore(sA, sB); else handleUpdateMatchHistory(); }} className="flex-1 py-3 bg-emerald-500 rounded-xl text-white font-bold">确认</button></div>{matchEditModal.show && (<div className="pt-2 border-t border-white/10"><button onClick={() => handleDeleteMatch(matchEditModal.data.id)} className="w-full py-3 bg-red-500/20 text-red-500 rounded-xl font-bold">删除此记录</button></div>)}</div></Modal>
        <Modal isOpen={!!gameResult}><div className="text-center space-y-4"><div id="share-card" className="bg-slate-900 p-6 rounded-2xl border border-white/10 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-blue-500" /><h3 className="text-3xl font-black italic text-white mb-1">VICTORY</h3><div className="text-xs text-white/40 mb-6 tracking-widest">{new Date().toLocaleDateString()} · SMASH MATCH</div><div className="flex justify-between items-center mb-6"><div className={`flex flex-col items-center ${gameResult?.winner==='A'?'scale-110':''}`}><div className="flex -space-x-2 mb-2">{gameResult?.teamA.map(id=><Avatar key={id} name={stats.raw.find(p=>p.id===id)?.name} size="sm"/>)}</div><div className={`text-4xl font-mono font-black ${gameResult?.winner==='A'?'text-emerald-400':'text-white/50'}`}>{gameResult?.scoreA}</div></div><div className="text-white/20 font-black italic text-2xl">VS</div><div className={`flex flex-col items-center ${gameResult?.winner==='B'?'scale-110':''}`}><div className="flex -space-x-2 mb-2">{gameResult?.teamB.map(id=><Avatar key={id} name={stats.raw.find(p=>p.id===id)?.name} size="sm"/>)}</div><div className={`text-4xl font-mono font-black ${gameResult?.winner==='B'?'text-blue-400':'text-white/50'}`}>{gameResult?.scoreB}</div></div></div><div className="flex justify-center gap-2 text-[10px] text-white/30 border-t border-white/10 pt-4"><span>Generated by SMASH. App</span></div></div><div className="flex gap-3"><button onClick={()=>{setGameResult(null); setView('lobby'); setSelectedPlayers([]); setMatchPointTeam(null);}} className="flex-1 py-3 bg-white/10 rounded-xl">关闭</button><button onClick={downloadShareCard} className="flex-1 py-3 bg-emerald-500 rounded-xl font-bold flex items-center justify-center gap-2"><Download size={18}/> 保存战报</button></div></div></Modal>
        <Modal isOpen={!!growthInfo}><div className="text-center space-y-4"><Sparkles className="text-yellow-400 w-12 h-12 mx-auto animate-spin-slow" /><h3 className="text-2xl font-black text-white">下克上！能力觉醒！</h3><div className="space-y-2 text-sm text-white/80">{growthInfo?.map((g, i) => (<div key={i} className="bg-white/10 p-3 rounded-xl flex items-center justify-between"><span>{g.name}</span><span className="text-emerald-400 font-bold">🔥 {g.attr} +1</span></div>))}</div><button onClick={()=>setGrowthInfo(null)} className="w-full py-3 bg-emerald-500 rounded-xl font-bold mt-4">太棒了</button></div></Modal>
        
        <Modal isOpen={radarModal.show && !radarModal.isPair}><div className="space-y-4"><h3 className="text-center font-bold text-white/50 uppercase tracking-wider text-xs">个人分析</h3>{radarModal.data ? (<div className="flex flex-col items-center"><RadarChart data={radarModal.data} label="" color="#10B981" /><div className="mt-4 text-center w-full"><div className="text-xl font-black text-white">{radarModal.data.name}</div><div className="text-xs text-white/40 mb-4">综合评分: {radarModal.data.rating}</div>{radarModal.data.similarPro && (<div className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-left relative overflow-hidden"><div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" /><div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5"><div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm shadow-lg shrink-0">{radarModal.data.similarPro.name[0]}</div><div><div className="text-sm font-bold text-white flex items-center gap-2">{radarModal.data.similarPro.name}<span className="text-[10px] font-normal bg-white/10 px-1.5 py-0.5 rounded text-white/60">相似度 90%+</span></div><div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{radarModal.data.similarPro.style}</div></div></div><div className="space-y-3"><div className="space-y-1"><h4 className="text-xs font-bold text-yellow-400 flex items-center gap-1"><Medal size={10} /> 荣誉</h4><div className="text-[10px] text-white/60 leading-snug">{radarModal.data.similarPro.honors?.join(' · ')}</div></div><div className="space-y-1"><h4 className="text-xs font-bold text-blue-400 flex items-center gap-1"><Activity size={10} /> 风格分析</h4><div className="text-[10px] text-white/60 leading-relaxed">{radarModal.data.similarPro.description}</div></div>{radarModal.data.similarPro.quote && (<div className="bg-white/5 p-2 rounded-lg text-[10px] text-white/50 italic text-center mt-2"><Quote size={8} className="inline mr-1 mb-1"/>{radarModal.data.similarPro.quote}</div>)}</div></div>)}</div></div>) : null}<button onClick={()=>setRadarModal({show:false})} className="w-full py-3 bg-slate-800 rounded-xl text-white font-bold mt-4">关闭</button></div></Modal>
        <Modal isOpen={radarModal.show && radarModal.isPair}><div className="space-y-4"><h3 className="text-center font-bold text-white/50 uppercase tracking-wider text-xs">组合分析</h3>{radarModal.data ? (<div className="flex flex-col items-center"><div className="flex gap-2 mb-2"><Avatar name={radarModal.data.p1?.name} colorIdx={radarModal.data.p1?.avatar_idx}/><Avatar name={radarModal.data.p2?.name} colorIdx={radarModal.data.p2?.avatar_idx}/></div><div className="text-xl font-black text-white mb-4">{radarModal.data.name}</div><div className="grid grid-cols-2 gap-4 w-full text-sm"><div className="bg-white/5 p-3 rounded-xl text-center"><div className="text-white/40 text-xs mb-1">胜率</div><div className="text-emerald-400 font-bold">{radarModal.data.matches>0?Math.round(radarModal.data.wins/radarModal.data.matches*100):0}%</div></div><div className="bg-white/5 p-3 rounded-xl text-center"><div className="text-white/40 text-xs mb-1">场次</div><div className="text-white font-bold">{radarModal.data.matches}</div></div></div><div className="w-full border-t border-white/10 my-4 pt-4"><div className="text-center text-xs text-white/50 mb-2">能力互补模型</div><RadarChart data={radarModal.data} label="" color="#FBBF24" /></div><button onClick={()=>setRadarModal({show:false})} className="w-full py-3 bg-slate-800 rounded-xl text-white font-bold mt-4">关闭</button></div>) : null}</div></Modal>
      </div>
    </>
  );
}

const NavBtn = ({ icon, label, active, onClick }) => (<button onClick={onClick} className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${active ? 'bg-white/10 text-white font-bold shadow-inner' : 'bg-transparent text-white/40 hover:text-white hover:bg-white/5'}`}>{icon} {active && <span className="text-xs">{label}</span>}</button>);
const TabBtn = ({ active, onClick, icon, label }) => (<button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${active ? 'bg-emerald-500 text-white shadow-lg' : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}>{icon} {label}</button>);
const Modal = ({ isOpen, children }) => (<AnimatePresence>{isOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center px-4"><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>{}} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" /><motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative w-full max-w-md bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">{children}</motion.div></div>)}</AnimatePresence>);
const ScoreCard = ({ team, players, score, color, onPlus, onMinus, onScoreChange, checkWin }) => (<div className={`flex-1 relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/5 p-3 md:p-4 shadow-xl flex flex-col transition-all`}><div className={`absolute top-0 right-0 w-24 h-24 ${color} blur-[60px] opacity-30`} /><div className="relative z-10 flex flex-col h-full justify-between"><div className="flex justify-between items-start"><div className="flex -space-x-2">{players.map(p => <Avatar key={p.id} name={p.name} colorIdx={p.avatar_idx} size="sm" className="border-slate-900 ring-2 ring-slate-900" />)}</div><span className="text-[10px] font-black opacity-30 tracking-widest text-white mt-1">TEAM {team}</span></div><div className="flex items-end justify-between mt-1 md:mt-2"><button onClick={onMinus} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/30 active:scale-90 touch-manipulation"><Minus size={24}/></button><input type="number" inputMode="numeric" pattern="\d*" value={score} onChange={(e)=>onScoreChange(e.target.value)} onBlur={checkWin} onKeyDown={(e)=>{if(e.key==='Enter')checkWin()}} className="w-20 text-6xl leading-none font-black tracking-tighter drop-shadow-2xl font-mono text-center bg-transparent outline-none appearance-none text-white z-20 p-0 m-0" /><button onClick={onPlus} className={`w-14 h-14 md:w-16 md:h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform text-white touch-manipulation`}><Plus size={32} strokeWidth={3} /></button></div></div></div>);