// ---------- PLAN: edit here ----------
const START = "2026-11-09"; // first Monday of the plan
const EZ = "6:30/km";  // default easy pace
const HR_EASY = 155;        // max heart rate on easy runs

// Practice model: t = type, km = fixed distance (empty = estimated),
// wx = warm-up, mx/mp = practice text/pace (pace shown for easy runs only), cx = cool-down, n = notes.
// Tip for the distance estimate: write reps like "3×10' at 5'00/km · rec 3' jog" or "3×3K at 5'00/km · rec 2' jog".
const S = (t, o) => Object.assign({t, km:"", wx:"", mx:"", mp:"", cx:"", n:""}, o);
const easy = (m, st) => S("easy", {km: String(m>=55?8:m>=43?7:6),
  mx: m+"' easy"+(st?'\n+ 4×20" strides, 40" walk between':''), mp: EZ, n: "Max heart rate "+HR_EASY});
const tempo = (n,m,p,r) => S("tempo", {
  wx:"15' easy",
  mx:n+"×"+m+"' at "+p+"/km · rec "+r+" jog",
  cx:"10' easy",
  n:"Recovery jog at 7'00/km or slower."});
let longRunIndex = 0; const long = (x, n) => S("long", {km:String([13,14,15,16][Math.min(longRunIndex++,3)]), mx:x, n:n||""});
const CLUB = () => S("club", {km:"11"});
const RACE = S("race", {
  mx:"10K at 5'00/km",
  n:"Goal: 50' (5'00/km).\nKm 1 at 5'03-5'05, km 2 to 7 at 5'00, then give what you have left from km 8."});
const RACE_DATE = "2026-11-08";

// Events shown in "Races & events" and used for the countdown. type: run, trail, triathlon or other
const EVENTS = [
  {id:"e-10k", name:"10K", date:RACE_DATE, type:"run", note:"", goalTime:"00:50:00", goalKm:"10"}
];

// Final race preparation
const VIEW_START = "2026-10-23"; // first day shown in the calendar
const PRE = {
  // This week
  "2026-10-23": easy(40,1),
  "2026-10-24": S("long", {km:"13",
    mx:"65' easy\n+ 10' at 5'20/km",
    n:"Last long run before the race. Keep it comfortable, finish feeling you could do more.\nSunday: rest."}),
  // Next week (Saturday 31 is the key workout)
  "2026-10-26": easy(45),
  "2026-10-28": S("club", {km:"4"}),
  "2026-10-30": easy(40,1),
  "2026-10-31": S("tempo", {
    wx:"15' easy",
    mx:"2×3K at 5'00/km · rec 2' jog",
    cx:"10' easy",
    n:"Controlled race-pace practice during the taper. Aim for 4'58-5'02/km without forcing; finish feeling you could complete another repetition."}),
  "2026-11-02": easy(40),
  "2026-11-04": S("tempo", {
    wx:"12' easy",
    mx:`3×1K at 4'50/km · rec 90" jog`,
    cx:"10' easy",
    n:"Short and snappy, not a fitness builder. Stop if it feels hard.\nAlternative: the club practice, with less volume."}),
  "2026-11-06": S("easy", {
    mx:`20' easy\n+ 4×20" strides, 40" walk between`, mp:EZ}),
  "2026-11-07": S("easy", {mx:"15' very easy shakeout, or rest", mp:"7'00/km"})
};

// Each week: [Monday, Wednesday, Friday, Saturday]
const WEEKS = [
  [S("easy",{mx:"30' very easy", mp:"6'45-7'15/km", n:"Or rest if your legs are heavy."}), CLUB(), easy(40), easy(60)],
  [easy(45), CLUB(), easy(45,1), tempo(2,10,"5'00","3'")],
  [easy(45), CLUB(), easy(40), long("65' easy\n+ 10' at 5'20/km")],
  [easy(45), CLUB(), easy(40,1), tempo(3,8,"4'58","2'")],
  [easy(40), CLUB(), easy(40), long("60' easy","No need to push the pace.")],
  [easy(45), CLUB(), easy(40,1), tempo(2,12,"4'58","2'30")],
  [easy(45), CLUB(), easy(40), long("65' easy\n+ 15' from 5'20 to 5'10/km")],
  [easy(30), S("club",{km:"4"}), easy(30), S("test",{
    wx:"12' easy", mx:"20' at 4'52/km, controlled", cx:"8' easy",
    n:"Taper week: keep this controlled, finish fresh, and compare heart rate only if you feel good."})]
];

// Week types (you can change each one from the calendar). Weeks of the plan above, in order:
const PHASES = ["Base", "Build", "Strength", "Peak", "Taper"];
const PHASE_BY_PLAN_WEEK = ["Base","Base","Build","Build","Strength","Strength","Peak","Taper"];
const PHASE = {"2026-10-19":"Peak", "2026-10-26":"Taper", "2026-11-02":"Taper"}; // weeks before the plan, by Monday
// ---------- end of editable zone ----------

const LABELS = {easy:"Easy", club:"Club", long:"Long", tempo:"Tempo", test:"Test", race:"Race"};
const TYPES = {run:"Run", trail:"Trail", triathlon:"Triathlon", other:"Other"};
const MONTHS = [[2026,9],[2026,10],[2026,11],[2027,0]];
const KEY = "10k-training-v3";
const DAY = 864e5;
const pad = n => String(n).padStart(2,"0");
const iso = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const addDays = (d,n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const mondayOf = d => addDays(d, -((d.getDay()+6)%7));
const first = new Date(START+"T00:00:00");
const END = addDays(first, WEEKS.length*7-1);
const VIEW = new Date(VIEW_START+"T00:00:00");
let todayISO = iso(new Date());
let today0 = new Date(todayISO+"T00:00:00");
let weekStart = mondayOf(today0);
const esc = t => String(t).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const daysTo = s => Math.round((new Date(s+"T00:00:00") - new Date(iso(new Date())+"T00:00:00"))/DAY);
const plural = n => n+(n === 1 ? " day" : " days");

const SESS = {};
SESS[RACE_DATE] = RACE;
Object.assign(SESS, PRE);
WEEKS.forEach((w,i) => {
  [0,2,4,5].forEach((off,j) => { SESS[iso(addDays(first, i*7+off))] = w[j]; });
  PHASE[iso(addDays(first, i*7))] = PHASE_BY_PLAN_WEEK[i];
});

// store.o = edited or added practices, store.rm = removed days, store.done = checkmarks,
// store.log = what you actually did, store.wt = week types, store.ev = events (null = use EVENTS above)
function parsePace(value) {
  const m = String(value||"").trim().match(/^(\d{1,2}):([0-5]\d)$/);
  return m ? Number(m[1])*60+Number(m[2]) : NaN;
}
function paceLabel(seconds) { const n=Math.round(Number(seconds)); return Math.floor(n/60)+":"+String(n%60).padStart(2,"0"); }
const DEFAULT_PACES = {easy:"6:30/km", tempo:"5:00/km", test:"4:52/km", easySec:390, tempoSec:300, testSec:292, easyMin:6.5, tempoMin:5, testMin:292/60, hr:155};
let store = {o:{}, rm:{}, done:{}, log:{}, wt:{}, ev:null, paces:{}};
try {
  const raw = localStorage.getItem(KEY);
  if (raw) store = Object.assign(store, JSON.parse(raw));
  else { // keep checkmarks from the previous version
    const old = JSON.parse(localStorage.getItem("10k-training-v2") || "{}");
    if (old.done) store.done = old.done;
  }
} catch(e) {}
if (Array.isArray(store.ev)) store.ev = store.ev.map(e => e && e.id === "e-10k" ? Object.assign({}, e, {note:""}) : e);
const savedPaces = store.paces || {};
store.paces = Object.assign({}, DEFAULT_PACES, savedPaces);
// Migrate older numeric-minutes settings to integer seconds/km.
for (const k of ["easy","tempo","test"]) {
  const sk = k+"Sec", mk = k+"Min";
  if (!(Number(savedPaces[sk]) > 0)) {
    const old = Number(savedPaces[mk]);
    store.paces[sk] = Number.isFinite(old) && old > 0 ? Math.round(old*60) : DEFAULT_PACES[sk];
  }
  store.paces[k] = paceLabel(store.paces[sk])+"/km";
  store.paces[mk] = store.paces[sk]/60;
}
let syncTimer = null;
let cloudSession = null;
let syncBusy = false;
const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch(e) {}
  if (cloudSession && !syncBusy) { clearTimeout(syncTimer); syncTimer = setTimeout(pushCloudState, 700); }
};

const BLANK = S("easy", {});
const getS = k => {
  if (store.rm[k]) return null;
  const s = store.o[k] || SESS[k];
  return s ? Object.assign({}, BLANK, s) : null;
};
const getEv = () => store.ev || EVENTS;
const weekPhase = mk => (mk in store.wt) ? store.wt[mk] : (PHASE[mk] || "");

// Two taps instead of a pop-up (pop-ups can be blocked, which made the buttons look dead)
function twoStep(btn, armedText, action){
  const orig = btn.textContent; let t = null;
  btn.addEventListener("click", () => {
    if (btn.dataset.armed){
      clearTimeout(t); delete btn.dataset.armed; btn.textContent = orig; action(); return;
    }
    btn.dataset.armed = "1"; btn.textContent = armedText;
    t = setTimeout(() => { delete btn.dataset.armed; btn.textContent = orig; }, 4000);
  });
}

// ---------- distance estimate ----------
const secs = s => {
  const m = String(s||"").match(/\d+'\d{2}/g);
  if (!m) return 0;
  return m.reduce((a,x) => { const [mm,ss] = x.split("'"); return a + (+mm)*60 + (+ss); }, 0) / m.length;
};
const recSecs = t => {
  const m = String(t).match(/rec\s*(\d+)(['"])(\d+)?/i);
  return m ? (m[2] === "'" ? (+m[1])*60 + (+m[3]||0) : +m[1]) : 0;
};
const num = x => parseFloat(String(x).replace(",","."));
function estLine(line, defP){
  const rec = recSecs(line);
  const l = line.replace(/rec[^·\n]*/i, "");
  const p = secs(l) || defP;
  let m;
  if ((m = l.match(/(\d+)\s*×\s*(\d+(?:[.,]\d+)?)\s*K/i))) return (+m[1])*num(m[2]) + (+m[1]-1)*rec/420;
  if (!p) return 0;
  if ((m = l.match(/(\d+)\s*×\s*(\d+)\s*'/))) return (+m[1])*(+m[2])*60/p + (+m[1]-1)*rec/420;
  if ((m = l.match(/(\d+(?:[.,]\d+)?)\s*K\b/i))) return num(m[1]);
  if ((m = l.match(/(\d+)\s*'/))) return (+m[1])*60/p;
  return 0;
}
function estParts(g){
  const ez = secs(EZ);
  return [["wx",ez],["mx",secs(g.mp)||ez],["cx",ez]].reduce((a,[x,p]) =>
    a + String(g[x]||"").split("\n").reduce((b,line) => b + estLine(line, p), 0), 0);
}
function kmInfo(g){
  const o = num(g.km);
  if (!isNaN(o) && o > 0) return {v:o, auto:false};
  return {v:Math.round(estParts(g)*2)/2, auto:true};
}
const fmtKm = i => i.v > 0 ? (i.auto?"≈ ":"")+(Number.isInteger(i.v)?i.v:i.v.toFixed(1))+" km" : "";
const km1 = v => String(Math.round(v*10)/10);

// ---------- rendering ----------
const fmtPace = p => !p ? "" : String(p).replace(/(\d+)'(\d{2})-(\d+)'(\d{2})(?=\/km)/g,"$1:$2-$3:$4").replace(/(\d+)'(\d{2})(?=\/km)/g,"$1:$2").replace(/\/km$/,"/km").replace(/^(\d+:\d{2})$/, "$1/km");
const block = (label, x, p) => (!x && !p) ? "" :
  '<span class="blk">'+(label ? '<span class="lb">'+label+'</span>' : '')+
  (x ? '<span class="tx">'+esc(x).replace(/\n/g,"<br>")+'</span>' : '')+
  (p ? '<span class="pc">'+esc(fmtPace(p))+'</span>' : '')+'</span>';

function logText(g, k){
  const L = store.log[k] || {}, bits = [];
  if (String(L.km||"").trim()) bits.push(String(L.km).trim()+" km");
  if (String(L.duration||"").trim()) bits.push(String(L.duration).trim());
  if (String(L.hr||"").trim()){
    const hr = num(L.hr);
    bits.push(String(L.hr).trim()+" bpm"+(g.t === "easy" && hr > HR_EASY ? " (above "+HR_EASY+")" : ""));
  }
  if (L.feel) bits.push(L.feel);
  return bits.join(" · ");
}

function estimatedDuration(g){
  const km=kmInfo(g).v;
  if(!(km>0)) return '';
  const paces=store.paces||DEFAULT_PACES;
  let pace=(Number(paces.easySec)||390)/60;
  if(g.t==='tempo') pace=(Number(paces.tempoSec)||300)/60;
  if(g.t==='test') pace=(Number(paces.testSec)||292)/60;
  if(g.t==='club') pace=6.3;
  let minutes=km*pace;
  if(g.t==='tempo'||g.t==='test') minutes+=5;
  const total=Math.round(minutes), h=Math.floor(total/60), m=total%60;
  return 'Est. '+(h? h+'h ':'')+m+' min';
}
function planText(g, value) {
  if (!value) return value;
  const p = store.paces || DEFAULT_PACES;
  let out = String(value);
  // Easy ranges shift with the Easy pace saved in Settings.
  if (g.t === "easy") {
    const delta = (Number(p.easySec) || 390) - 390;
    out = out.replace(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})(?=\/km)/g,
      (_, a, b, c, d) => {
        const fmt = n => Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0");
        return fmt(Number(a) * 60 + Number(b) + delta) + "–" +
               fmt(Number(c) * 60 + Number(d) + delta);
      });
  }
  // Preserve legacy editable single-pace prescriptions.
  const target = g.t === "tempo" ? p.tempo : g.t === "test" ? p.test : null;
  if (target && /\d+'\d{2}(?:-\d+'\d{2})?\/km/.test(out)) {
    out = out.replace(/\d+'\d{2}(?:-\d+'\d{2})?\/km/g, target);
  }
  return out.replace(/(\d+)'(\d{2})-(\d+)'(\d{2})(?=\/km)/g,"$1:$2-$3:$4")
            .replace(/(\d+)'(\d{2})(?=\/km)/g,"$1:$2");
}
function chipHTML(g, k){
  g=Object.assign({},g,{wx:planText(g,g.wx),mx:planText(g,g.mx),cx:planText(g,g.cx),mp:planText(g,g.mp)});
  const km = fmtKm(kmInfo(g));
  return '<span class="top"><b class="km">'+(km || "&nbsp;")+'</b><span class="ty">'+esc(LABELS[g.t]||"")+'</span></span>'+ '<span class="pc">'+esc(estimatedDuration(g))+'</span>'+
    block("Warm-up", g.wx, "")+
    block("", g.mx, g.t === "easy" ? g.mp : "")+
    block("Cool-down", g.cx, "")+
    block("Logged", logText(g, k), "");
}

const monthFmt = new Intl.DateTimeFormat("en-GB", {month:"long", year:"numeric"});
const longFmt = new Intl.DateTimeFormat("en-GB", {weekday:"long", day:"numeric", month:"long"});
const shortFmt = new Intl.DateTimeFormat("en-GB", {day:"numeric", month:"short"});
const fullFmt = new Intl.DateTimeFormat("en-GB", {day:"numeric", month:"short", year:"numeric"});
const WD = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function evByDate(){
  const m = {};
  getEv().forEach(e => { if (e.date) (m[e.date] = m[e.date] || []).push(e); });
  return m;
}

function dayCell(d, evMap){
  const k = iso(d), g = getS(k), cell = document.createElement("div");
  cell.id = "d-"+k;
  cell.className = "day"+(g?"":" blank")+(k===todayISO?" today":"");
  cell.innerHTML = '<span class="num"><span class="dn">'+WD[(d.getDay()+6)%7]+' </span>'+d.getDate()+'</span>'+
    (evMap[k]||[]).map(e => '<span class="evt">'+esc(e.name||"Event")+' · '+(TYPES[e.type]||"Other")+'</span>').join("");
  if (g){
    const b = document.createElement("button");
    b.className = "chip t-"+g.t+(store.done[k]?" done":""); b.type = "button";
    b.innerHTML = chipHTML(g, k);
    b.onclick = () => openDay(k);
    cell.append(b);
  } else {
    const a = document.createElement("button");
    a.className = "add"; a.type = "button";
    a.setAttribute("aria-label","Add a practice on "+longFmt.format(d));
    a.onclick = () => addPractice(k);
    cell.append(a);
    if (store.rm[k] && SESS[k]){
      const r = document.createElement("button");
      r.className = "restore"; r.type = "button"; r.textContent = "↺ Restore planned practice";
      r.onclick = e => { e.stopPropagation(); delete store.rm[k]; save(); render(); };
      cell.append(r);
    }
  }
  return cell;
}

// Weekly row: dates, week type, planned and logged distance
function weekSummary(mon, wf, last){
  let planned = 0, logged = 0;
  for (let x = new Date(wf); x <= last; x = addDays(x,1)){
    const k = iso(x), g = getS(k);
    if (g) planned += kmInfo(g).v;
    const L = store.log[k];
    if (L && store.done[k]){ const v = num(L.km); if (v > 0) logged += v; }
  }
  const mk = iso(mon);
  const el = document.createElement("div"); el.className = "wk";
  const wl = document.createElement("span"); wl.className = "wl";
  wl.textContent = shortFmt.format(wf)+" – "+shortFmt.format(last);
  const phase = document.createElement("button");
  phase.type = "button"; phase.className = "week-phase";
  phase.setAttribute("aria-label","Change training phase for this week");
  const currentPhase = weekPhase(mk);
  phase.textContent = currentPhase || "Set phase";
  phase.title = "Click to cycle through training phases";
  phase.onclick = () => {
    const current = weekPhase(mk), idx = PHASES.indexOf(current);
    const next = PHASES[(idx+1)%PHASES.length];
    store.wt[mk] = next; save(); render();
  };
  el.append(wl, phase);
  if (planned){ const s = document.createElement("span"); s.textContent = "Planned ≈ "+km1(planned)+" km"; el.append(s); }
  const s = document.createElement("span"); s.textContent = "Actual completed "+km1(logged)+" km"; el.append(s);
  return el;
}

function renderCalendar(evMap){
  const viewFrom = weekStart > VIEW ? weekStart : VIEW;
  const cal = document.getElementById("cal");
  cal.innerHTML = "";
  MONTHS.forEach(([y,m]) => {
    const ms = new Date(y,m,1), me = new Date(y,m+1,0);
    // A week that sits across two months goes in the month holding most of its days
    // (the month of its Thursday), so 30 Nov - 6 Dec is shown in December.
    const weeks = [];
    for (let mon = mondayOf(ms); mon <= me; mon = addDays(mon,7)){
      const thu = addDays(mon,3);
      if (thu.getMonth() !== m || thu.getFullYear() !== y) continue;
      const wf = mon < viewFrom ? viewFrom : mon;
      const sun = addDays(mon,6), last = sun < END ? sun : END;
      if (wf <= last) weeks.push({mon, wf, last});
    }
    if (!weeks.length) return;
    const box = document.createElement("section"); box.className = "slide white";
    box.innerHTML = "<h2>"+monthFmt.format(ms)+"</h2>";
    const grid = document.createElement("div"); grid.className = "grid";
    WD.forEach(n => { const h = document.createElement("div"); h.className = "wd"; h.textContent = n; grid.append(h); });
    weeks.forEach(({mon, wf, last}) => {
      const lead = (wf.getDay()+6)%7;
      for (let i=0;i<lead;i++){ const e = document.createElement("div"); e.className = "day empty"; grid.append(e); }
      for (let d=new Date(wf); d<=last; d=addDays(d,1)) grid.append(dayCell(d, evMap));
      grid.append(weekSummary(mon, wf, last));
    });
    box.append(grid); cal.append(box);
  });
}

// Weeks that are over (before the current week) move to the archive at the end of the page
function renderArchive(evMap){
  const body = document.getElementById("archiveBody");
  body.innerHTML = "";
  const weeks = [];
  for (let m = mondayOf(VIEW); m < weekStart; m = addDays(m,7)) weeks.push(m);
  weeks.reverse();
  document.getElementById("archiveSum").textContent = "Archived previous weeks ("+weeks.length+")";
  if (!weeks.length){
    body.innerHTML = '<p class="note">Nothing here yet. Each week moves here once it is over.</p>';
    return;
  }
  weeks.forEach(mon => {
    const wf = mon < VIEW ? VIEW : mon;
    const sun = addDays(mon,6), last = sun < END ? sun : END;
    const wrap = document.createElement("div"); wrap.className = "aw";
    wrap.append(weekSummary(mon, wf, last));
    const grid = document.createElement("div"); grid.className = "grid";
    const lead = (wf.getDay()+6)%7;
    for (let i=0;i<lead;i++){ const e = document.createElement("div"); e.className = "day empty"; grid.append(e); }
    for (let d=new Date(wf); d<=last; d=addDays(d,1)) grid.append(dayCell(d, evMap));
    wrap.append(grid); body.append(wrap);
  });
}

// ---------- events ----------
function evRow(e, past){
  const b = document.createElement("button");
  b.type = "button"; b.className = "ev"+(past?" past":"");
  const n = e.date ? daysTo(e.date) : null;
  const go = n === null ? "" : n > 1 ? plural(n) : n === 1 ? "Tomorrow" : n === 0 ? "Today" : "Past";
  const gp = goalPace(e.goalTime, e.goalKm || (e.type === "run" ? 10 : 0));
  b.innerHTML = '<span class="evd">'+(e.date ? esc(fullFmt.format(new Date(e.date+"T00:00:00"))) : "No date")+'</span>'+
    '<span class="evn">'+esc(e.name || "Untitled event")+(e.id !== 'e-10k' && e.note ? '<small>'+esc(String(e.note).split("\n")[0])+'</small>' : '')+(gp ? '<small class="goal-label">Goal '+esc(formatGoalTime(e.goalTime))+' · '+gp+'/km</small>' : '')+'</span>'+
    '<span class="evtype ty-'+(TYPES[e.type] ? e.type : "other")+'">'+(TYPES[e.type]||"Other")+'</span>'+
    '<span class="evg">'+go+'</span>';
  b.onclick = () => openEv(e.id);
  return b;
}
function renderEvents(){
  const box = document.getElementById("evList");
  box.innerHTML = "";
  const list = getEv().slice().sort((a,b) => (a.date||"9999").localeCompare(b.date||"9999"));
  if (!list.length){ box.innerHTML = '<p class="note">No event yet. Add your first one below.</p>'; }
  const up = list.filter(e => !e.date || e.date >= todayISO), past = list.filter(e => e.date && e.date < todayISO).reverse();
  up.forEach(e => box.append(evRow(e, false)));
  if (past.length){
    const h = document.createElement("p"); h.className = "evh"; h.textContent = "Past events"; box.append(h);
    past.forEach(e => box.append(evRow(e, true)));
  }
  renderGoals();
  countdown();
}
// Top of the page: days to the next event, then the ones after it
function countdown(){
  const up = getEv().filter(e => e.date && e.date >= todayISO).sort((a,b) => a.date.localeCompare(b.date));
  const el = document.getElementById("count"), el2 = document.getElementById("count2");
  if (!up.length){ el.textContent = "No upcoming race. Add one in Races."; el2.textContent = ""; return; }
  const e = up[0], n = daysTo(e.date), name = e.name || "your event";
  el.textContent = n > 1 ? plural(n)+" to "+name+" · "+longFmt.format(new Date(e.date+"T00:00:00"))
    : n === 1 ? "Tomorrow: "+name : "Today: "+name+". Good luck!";
  el2.textContent = up.slice(1,3).map(x => {
    const d = daysTo(x.date);
    return (x.name || "Event")+" ("+(TYPES[x.type]||"Other")+") "+(d === 0 ? "today" : d === 1 ? "tomorrow" : "in "+plural(d));
  }).join(" · ");
}

function timeSeconds(value){
  const x=String(value||"").trim(); if(!x) return 0;
  const a=x.split(":").map(Number); if(a.some(Number.isNaN)) return 0;
  if(a.length===3) return a[0]*3600+a[1]*60+a[2];
  if(a.length===2) return a[0]*60+a[1];
  return 0;
}
function goalPace(time, distance){const sec=timeSeconds(time), km=num(distance); if(!sec||!km||km<=0)return ""; const p=Math.round(sec/km);return Math.floor(p/60)+"'"+pad(p%60);}
function formatGoalTime(value){const sec=timeSeconds(value);if(!sec)return value||"Not set";const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;if(h&&m)return h+" h "+m+" min"+(s?" "+s+" s":"");if(h)return h+" h"+(m?" "+m+" min":"")+(s?" "+s+" s":"");return m+" min"+(s?" "+s+" s":"");}
function renderGoals(){
 const box=document.getElementById("goalList"); if(!box)return; box.innerHTML="";
 const events=getEv(); if(!events.length){box.innerHTML='<p class="note">Add an event to set a goal.</p>';return;}
 events.forEach(e=>{const pace=goalPace(e.goalTime,e.goalKm||(e.type==="run"?10:0));const row=document.createElement("div");row.className="ev";row.style.cursor="default";row.innerHTML='<span class="evd">'+(e.date?esc(fullFmt.format(new Date(e.date+"T00:00:00"))):"No date")+'</span><span class="evn">'+esc(e.name||"Untitled event")+'<small>Target: '+esc(formatGoalTime(e.goalTime))+'</small></span><span class="evtype ty-run">Goal</span><span class="evg">'+(pace?esc(pace)+"/km":"Set goal")+'</span>';box.append(row);});
}
function loggedEntries(){return Object.keys(store.log).filter(k=>store.done[k]&&num(store.log[k].km)>0).sort();}
function renderDashboardWeek(){
 const today=new Date(iso(new Date())+"T00:00:00"), monday=mondayOf(today), wrap=document.getElementById('dashboardWeekPlan');
 document.getElementById('dashboardWeekRange').textContent=shortFmt.format(monday)+' – '+shortFmt.format(addDays(monday,6));
 wrap.innerHTML='';
 for(let i=0;i<7;i++){
  const d=addDays(monday,i),k=iso(d),g=getS(k),done=!!store.done[k],L=store.log[k]||{};
  const b=document.createElement('button');b.type='button';b.className='week-plan-day'+(g&&g.t?' t-'+g.t:'')+(done?' is-completed':'');
  const name=longFmt.format(d), planned=g?fmtKm(kmInfo(g)):'Rest / no planned session';
  let detail='';
  if(g){detail=(LABELS[g.t]||'Workout')+' · '+planned; if(g.mx)detail+='\n'+g.mx; if(g.mp)detail+=' · '+g.mp;}
  if(done&&num(L.km)>0)detail+='\nActual: '+num(L.km)+' km';
  b.innerHTML='<span class="wday"><span class="wday-label">'+esc(name)+'</span><span>'+(done?'<span class="wcheck" aria-label="Completed">✓</span>':'')+'</span></span><span class="wdetail">'+esc(detail||'Rest day').replace(/\n/g,'<br>')+(done?'<br><span class="wstatus-label">Completed</span>':'')+'</span>';
  b.addEventListener('click',()=>{if(g)openDay(k);else addPractice(k)});wrap.append(b);
 }
}
function renderDashboard(){
 renderDashboardWeek();
 const entries=loggedEntries(), actual=entries.reduce((a,k)=>a+num(store.log[k].km),0), completed=Object.keys(store.done).filter(k=>store.done[k]).length;
 const monday=mondayOf(new Date(iso(new Date())+"T00:00:00")), weekKeys=[];for(let d=new Date(monday);d<=addDays(monday,6);d=addDays(d,1))weekKeys.push(iso(d));
 const planned=weekKeys.reduce((a,k)=>{const g=getS(k);return a+(g?kmInfo(g).v:0)},0), weekActual=weekKeys.reduce((a,k)=>a+(store.done[k]&&store.log[k]&&num(store.log[k].km)>0?num(store.log[k].km):0),0);
 document.getElementById("dashboardMetrics").innerHTML=[['This week planned',planned.toFixed(1)+' km'],['This week completed',weekActual.toFixed(1)+' km']].map(x=>'<div class="metric"><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>').join('');
 const observations=[];
 if(entries.length){observations.push('You have logged '+entries.length+' completed workout'+(entries.length===1?'':'s')+' with an actual distance.');
 const withHr=entries.filter(k=>num(store.log[k].hr)>0);if(withHr.length){const avg=withHr.reduce((a,k)=>a+num(store.log[k].hr),0)/withHr.length;observations.push('Your average heart rate across '+withHr.length+' logged workout'+(withHr.length===1?'':'s')+' with heart-rate data is '+Math.round(avg)+' bpm.');}
 const withFeel=entries.filter(k=>store.log[k].feel==='Heavy');if(withFeel.length)observations.push('You marked '+withFeel.length+' completed workout'+(withFeel.length===1?'':'s')+' as Heavy.');
 const paces=entries.map(k=>({k,pace:actualPace(k)})).filter(x=>x.pace>0);if(paces.length>=2){const firstP=paces[0].pace,lastP=paces[paces.length-1].pace;if(lastP<firstP)observations.push('Your latest logged pace is faster than your earliest logged pace.');else if(lastP>firstP)observations.push('Your latest logged pace is slower than your earliest logged pace.');}
 } else observations.push('Complete and log workouts to see observations based on your data.');
 document.getElementById('observationList').innerHTML=observations.map(x=>'<li>'+esc(x)+'</li>').join('');
}
function actualPace(k){const L=store.log[k]||{};const km=num(L.km),sec=timeSeconds(L.duration||L.time);return km>0&&sec>0?sec/km:0;}
function renderStatistics(range='weekly'){
 // Plot each logged practice as its own point. The range toggle filters the
 // time window; it does not collapse several workouts into a single weekly dot.
 const today=new Date(iso(new Date())+'T00:00:00');
 const cutoff=new Date(today);
 if(range==='weekly') cutoff.setDate(cutoff.getDate()-55); // latest eight weeks
 else cutoff.setMonth(cutoff.getMonth()-11), cutoff.setDate(1); // latest twelve months
 const entries=Object.keys(store.log||{}).filter(k=>{
   const L=store.log[k]||{}; const d=new Date(k+'T00:00:00');
   return d>=cutoff && d<=addDays(today,1) && (num(L.km)>0 || num(L.hr)>0 || actualPace(k)>0);
 }).sort();
 const labels=entries.map(k=>{
   const d=new Date(k+'T00:00:00');
   return range==='weekly' ? new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'}).format(d) : new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'}).format(d);
 });
 const mileage=entries.map(k=>num((store.log[k]||{}).km)>0?num(store.log[k].km):null);
 const pace=entries.map(k=>{const p=actualPace(k);return p>0?p/60:null;});
 const hr=entries.map(k=>num((store.log[k]||{}).hr)>0?num((store.log[k]||{}).hr):null);
 drawChart('mileageChart',mileage,labels,'km');
 drawChart('paceChart',pace,labels,'min/km');
 drawChart('hrChart',hr,labels,'bpm');
 const summary=document.getElementById('statsSummary');
 if(summary){
   const distanceCount=mileage.filter(v=>v>0).length;
   const paceCount=pace.filter(v=>v>0).length;
   const hrCount=hr.filter(v=>v>0).length;
   summary.textContent=distanceCount
     ? distanceCount+' workout'+(distanceCount===1?'':'s')+' with distance logged in this period. Pace available for '+paceCount+' and heart rate available for '+hrCount+'. Each workout is shown as a separate point.'
     : 'No workouts with actual distance logged in this period. Enter actual distance, duration and heart rate in each workout to populate the relevant charts.';
 }
}
function drawChart(id,values,labels,unit){
 const c=document.getElementById(id);if(!c)return;
 const parent=c.parentElement;const cssWidth=Math.max(280,(parent?parent.clientWidth-32:320));const h=250,dpr=window.devicePixelRatio||1;
 c.style.width='100%';c.style.height=h+'px';c.width=Math.round(cssWidth*dpr);c.height=Math.round(h*dpr);
 const ctx=c.getContext('2d');if(!ctx)return;ctx.setTransform(dpr,0,0,dpr,0,0);
 const w=cssWidth,padL=42,padR=12,padT=22,padB=48;ctx.clearRect(0,0,w,h);
 ctx.font='11px Arial, sans-serif';ctx.strokeStyle='#dbe4ec';ctx.fillStyle='#536477';ctx.lineWidth=1;
 for(let i=0;i<4;i++){const y=padT+(h-padT-padB)*i/3;ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(w-padR,y);ctx.stroke();}
 const valid=values.filter(v=>Number.isFinite(v)&&v>0);
 if(!valid.length){ctx.fillStyle='#75869a';ctx.textAlign='center';ctx.font='13px Arial, sans-serif';ctx.fillText(unit==='km'?'No distance data in this period':unit==='min/km'?'Add actual distance and duration to see pace':'No heart-rate data in this period',w/2,h/2);ctx.textAlign='left';return;}
 const max=Math.max(...valid,1)*1.15,plotW=w-padL-padR,plotH=h-padT-padB,step=plotW/Math.max(values.length,1);
 ctx.strokeStyle='#2f54e0';ctx.fillStyle='#2f54e0';ctx.lineWidth=2;ctx.beginPath();let started=false;
 values.forEach((v,i)=>{const x=padL+step*(i+.5);if(Number.isFinite(v)&&v>0){const y=h-padB-(v/max)*plotH;if(!started){ctx.moveTo(x,y);started=true;}else ctx.lineTo(x,y);}else{started=false;ctx.stroke();ctx.beginPath();}});ctx.stroke();
 values.forEach((v,i)=>{if(!Number.isFinite(v)||v<=0)return;const x=padL+step*(i+.5),y=h-padB-(v/max)*plotH;ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#2f54e0';ctx.fill();ctx.fillStyle='#536477';ctx.font='10px Arial, sans-serif';const label=unit==='min/km'?formatPaceValue(v*60):(Math.round(v*10)/10)+'';ctx.fillText(label,Math.min(w-padR-26,Math.max(padL,x-12)),Math.max(padT+10,y-8));});
 // Keep date labels readable when many practices are logged.
 ctx.fillStyle='#536477';ctx.font='10px Arial, sans-serif';const stride=Math.max(1,Math.ceil(labels.length/7));
 labels.forEach((label,i)=>{if(i%stride!==0 && i!==labels.length-1)return;const x=padL+step*(i+.5);ctx.save();ctx.translate(Math.max(padL,Math.min(w-padR,x)),h-18);ctx.rotate(-0.25);ctx.fillText(label,-12,0);ctx.restore();});
 ctx.fillStyle='#536477';ctx.font='11px Arial, sans-serif';ctx.fillText(unit,padL,12);
}
function formatPaceValue(minutes){const total=Math.round(minutes*60);return Math.floor(total/60)+':'+String(total%60).padStart(2,'0');}

function renderPaceSettings(){
  const p = store.paces || DEFAULT_PACES;
  document.getElementById("settingEasy").value = paceLabel(p.easySec ?? 390);
  document.getElementById("settingTempo").value = paceLabel(p.tempoSec ?? 300);
  document.getElementById("settingTest").value = paceLabel(p.testSec ?? 292);
  document.getElementById("settingHr").value = p.hr;
}
function render(){
  renderPaceSettings();
  const evMap = evByDate();
  renderCalendar(evMap);
  renderArchive(evMap);
  renderEvents();
  renderDashboard();
  const range=document.querySelector('[data-range].active')?.dataset.range||'weekly'; renderStatistics(range);
}

// ---------- practice dialog ----------
const dlg = document.getElementById("dlg");
const dT = document.getElementById("dT"), dK = document.getElementById("dK"), dDone = document.getElementById("dDone");
const dCopyDate = document.getElementById("dCopyDate"), dCopyMsg = document.getElementById("dCopyMsg");
const fields = dlg.querySelectorAll("[data-f]");
const logFields = dlg.querySelectorAll("[data-l]");
let cur = null, copyPending = null;
Object.keys(LABELS).forEach(k => { const o = document.createElement("option"); o.value = k; o.textContent = LABELS[k]; dT.append(o); });
dCopyDate.min = VIEW_START; dCopyDate.max = iso(END);

function hint(){
  const g = getS(cur); if (!g) return;
  const e = fmtKm({v:Math.round(estParts(g)*2)/2, auto:true});
  dK.placeholder = e ? "auto: "+e : "auto";
}
function fill(){
  const g = getS(cur); if (!g) return;
  fields.forEach(el => { el.value = g[el.dataset.f] ?? ""; });
  const L = store.log[cur] || {};
  logFields.forEach(el => { el.value = L[el.dataset.l] ?? ""; });
  dDone.checked = !!store.done[cur];
  hint();
}
function openDay(k){
  cur = k; copyPending = null;
  document.getElementById("dTitle").textContent = longFmt.format(new Date(k+"T00:00:00"));
  dCopyDate.value = ""; dCopyMsg.textContent = "";
  fill(); dlg.showModal();
}
function addPractice(k){
  delete store.rm[k];
  store.o[k] = Object.assign({}, BLANK);
  save(); render(); openDay(k);
}
fields.forEach(el => el.addEventListener("input", () => {
  const g = getS(cur); if (!g) return;
  store.o[cur] = Object.assign({}, g, {[el.dataset.f]: el.value});
  save(); hint(); render();
}));
logFields.forEach(el => el.addEventListener("input", () => {
  store.log[cur] = Object.assign({}, store.log[cur], {[el.dataset.l]: el.value});
  save(); render();
}));
dDone.onchange = () => { store.done[cur] = dDone.checked; save(); render(); };
dCopyDate.addEventListener("input", () => { copyPending = null; });
document.getElementById("dCopy").onclick = () => {
  const t = dCopyDate.value;
  if (!t){ dCopyMsg.textContent = "Pick a date first."; return; }
  if (t === cur){ dCopyMsg.textContent = "Pick a different day."; return; }
  const td = new Date(t+"T00:00:00");
  if (td < VIEW || td > END){ dCopyMsg.textContent = "Pick a day between "+shortFmt.format(VIEW)+" and "+shortFmt.format(END)+"."; return; }
  if (getS(t) && copyPending !== t){
    copyPending = t;
    dCopyMsg.textContent = "There is already a practice on that day. Press Copy again to replace it.";
    return;
  }
  copyPending = null;
  const g = getS(cur);
  delete store.rm[t]; delete store.done[t]; delete store.log[t];
  store.o[t] = Object.assign({}, g);
  save(); render();
  dCopyMsg.textContent = "Copied to "+longFmt.format(td)+".";
};
document.getElementById("dClose").onclick = () => dlg.close();
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
twoStep(document.getElementById("dRemove"), "Tap again to remove", () => {
  delete store.o[cur]; delete store.done[cur]; delete store.log[cur]; store.rm[cur] = true;
  save(); dlg.close(); render();
});
document.getElementById("dReset").onclick = () => {
  delete store.o[cur]; delete store.rm[cur]; delete store.done[cur]; delete store.log[cur];
  save();
  if (SESS[cur]) fill(); else dlg.close();
  render();
};
twoStep(document.getElementById("resetAll"), "Tap again to erase everything", () => {
  store = {o:{}, rm:{}, done:{}, log:{}, wt:{}, ev:null, paces:Object.assign({},DEFAULT_PACES)}; save(); render();
});

// ---------- event dialog ----------
const evDlg = document.getElementById("evDlg");
const evFields = evDlg.querySelectorAll("[data-e]");
let evCur = null;
Object.keys(TYPES).forEach(k => { const o = document.createElement("option"); o.value = k; o.textContent = TYPES[k]; document.getElementById("evType").append(o); });
function openEv(id){
  const e = getEv().find(x => x.id === id); if (!e) return;
  evCur = id;
  evFields.forEach(el => { el.value = e[el.dataset.e] ?? ""; });
  updateGoalPace(); evDlg.showModal();
}
function updateGoalPace(){const pace=goalPace(document.getElementById('evGoalTime').value,document.getElementById('evGoalKm').value||(document.getElementById('evType').value==='run'?10:0));document.getElementById('evGoalPace').textContent=pace?'Equivalent average pace: '+pace+'/km':'Enter a target time and distance to calculate pace.';}
evFields.forEach(el => el.addEventListener("input", () => {
  store.ev = getEv().map(x => x.id === evCur ? Object.assign({}, x, {[el.dataset.e]: el.value}) : x);
  updateGoalPace(); save(); render();
}));
document.getElementById('evType').addEventListener('change',updateGoalPace);
document.getElementById("evAdd").onclick = () => {
  const id = "e"+Date.now();
  store.ev = getEv().concat([{id, name:"", date:"", type:"run", note:""}]);
  save(); render(); openEv(id);
};
twoStep(document.getElementById("evRemove"), "Tap again to remove", () => {
  store.ev = getEv().filter(x => x.id !== evCur);
  save(); evDlg.close(); render();
});
document.getElementById("evDone").onclick = () => evDlg.close();
evDlg.addEventListener("click", e => { if (e.target === evDlg) evDlg.close(); });

// ---------- pace settings ----------
document.getElementById('paceSettingsForm').addEventListener('submit', e => {
  e.preventDefault();
  const easy=parsePace(document.getElementById('settingEasy').value);
  const tempo=parsePace(document.getElementById('settingTempo').value);
  const test=parsePace(document.getElementById('settingTest').value);
  const hr=Number(document.getElementById('settingHr').value);
  if(!Number.isFinite(easy)||easy<240||easy>600||!Number.isFinite(tempo)||tempo<180||tempo>480||!Number.isFinite(test)||test<180||test>480||!Number.isFinite(hr)||hr<80||hr>220){document.getElementById('settingsMessage').textContent='Enter paces as min:sec (e.g. 6:30) and valid values: easy 4:00–10:00, tempo/test 3:00–8:00, heart rate 80–220 bpm.';return;}
  store.paces={easy:paceLabel(easy)+"/km",tempo:paceLabel(tempo)+"/km",test:paceLabel(test)+"/km",easySec:easy,tempoSec:tempo,testSec:test,easyMin:easy/60,tempoMin:tempo/60,testMin:test/60,hr};
  save(); render();
  document.getElementById('settingsMessage').textContent='Pace settings saved and training plan updated.';
});
document.getElementById('resetPaces').addEventListener('click',()=>{
  store.paces=Object.assign({},DEFAULT_PACES);save();renderPaceSettings();
  render(); document.getElementById('settingsMessage').textContent='Default pace settings restored.';
});

// ---------- header helpers ----------
document.getElementById("goToday").onclick = () => {
  document.querySelectorAll('.side-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab==='training'));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id==='training'));
  const el = document.getElementById("d-"+todayISO) || document.getElementById("calendrier");
  el.scrollIntoView({behavior:"smooth", block:"center"});
};

const lg = document.getElementById("calendrier");
Object.keys(LABELS).forEach(k => { const s = document.createElement("span"); s.className = "t-"+k; s.textContent = LABELS[k]; lg.append(s); });

document.documentElement.classList.add("js");
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
}), {threshold:.15}) : null;
document.querySelectorAll(".rise").forEach(el => io ? io.observe(el) : el.classList.add("in"));

document.querySelectorAll('.side-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.side-tab').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id===btn.dataset.tab));if(btn.dataset.tab==='statistics')requestAnimationFrame(()=>requestAnimationFrame(()=>renderStatistics(document.querySelector('[data-range].active')?.dataset.range||'weekly')));window.scrollTo({top:0,behavior:'smooth'});}));
document.querySelectorAll('.race-subtab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.race-subtab').forEach(b=>b.classList.toggle('active',b===btn));document.getElementById('eventsView').hidden=btn.dataset.raceTab!=='eventsView';document.getElementById('goalsView').hidden=btn.dataset.raceTab!=='goalsView';renderGoals();}));
document.querySelectorAll('[data-range]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-range]').forEach(b=>b.classList.toggle('active',b===btn));renderStatistics(btn.dataset.range);}));

// ---------- Supabase cloud sync (free tier; requires one-time project setup) ----------
const SYNC_CONFIG_KEY = "10k-training-sync-config-v1";
const SYNC_SESSION_KEY = "10k-training-sync-session-v1";
let syncConfig = {};
try { syncConfig = JSON.parse(localStorage.getItem(SYNC_CONFIG_KEY)||"{}"); } catch(e) {}
try { cloudSession = JSON.parse(localStorage.getItem(SYNC_SESSION_KEY)||"null"); } catch(e) {}
const syncUrlEl=document.getElementById("syncUrl"), syncKeyEl=document.getElementById("syncKey"), syncEmailEl=document.getElementById("syncEmail"), syncPassEl=document.getElementById("syncPassword"), syncMsg=document.getElementById("syncMessage");
if(syncUrlEl){syncUrlEl.value=syncConfig.url||"";syncKeyEl.value=syncConfig.key||"";syncEmailEl.value=syncConfig.email||"";}
function showSyncMessage(msg){ if(syncMsg) syncMsg.textContent=msg; }
function currentSyncConfig(){return {url:String(syncUrlEl.value||"").trim().replace(/\/$/,""),key:String(syncKeyEl.value||"").trim(),email:String(syncEmailEl.value||"").trim()};}
async function authCloud(createAccount=false){
  const cfg=currentSyncConfig(); const password=syncPassEl.value;
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(cfg.url)||!cfg.key||!cfg.email||!password){showSyncMessage("Enter a valid Supabase URL, publishable/anon key, email and password.");return;}
  localStorage.setItem(SYNC_CONFIG_KEY,JSON.stringify(cfg));
  showSyncMessage(createAccount?"Creating account…":"Signing in…");
  const endpoint=createAccount?"/auth/v1/signup":"/auth/v1/token?grant_type=password";
  const response=await fetch(cfg.url+endpoint,{method:"POST",headers:{"Content-Type":"application/json","apikey":cfg.key},body:JSON.stringify({email:cfg.email,password})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok){showSyncMessage(data.msg||data.message||data.error_description||data.error||"Could not authenticate. Check the URL/key, credentials and email confirmation settings.");return;}
  if(!data.access_token){showSyncMessage(createAccount?"Account created. Check your email if confirmation is enabled, then sign in.":"No session returned. Check whether email confirmation is required.");return;}
  cloudSession={access_token:data.access_token,refresh_token:data.refresh_token,user:data.user};
  localStorage.setItem(SYNC_SESSION_KEY,JSON.stringify(cloudSession));
  await pullCloudState(true);
}
async function ensureCloudSession(){
  if(!cloudSession||!syncConfig.url||!syncConfig.key)return false;
  try {
    const payload=JSON.parse(atob(cloudSession.access_token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));
    if(payload.exp*1000>Date.now()+120000)return true;
  } catch(e) {}
  if(!cloudSession.refresh_token) return false;
  const r=await fetch(syncConfig.url+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{"Content-Type":"application/json","apikey":syncConfig.key},body:JSON.stringify({refresh_token:cloudSession.refresh_token})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!d.access_token){showSyncMessage("Your cloud session expired. Sign in again in Settings.");return false;}
  cloudSession={access_token:d.access_token,refresh_token:d.refresh_token,user:d.user||cloudSession.user};
  localStorage.setItem(SYNC_SESSION_KEY,JSON.stringify(cloudSession));
  return true;
}
async function pullCloudState(showMessage=true){
  if(!cloudSession||!syncConfig.url||!syncConfig.key)return;
  try{
    if(!(await ensureCloudSession())) return;
    const cfg=syncConfig, uid=cloudSession.user.id;
    const r=await fetch(cfg.url+"/rest/v1/app_state?select=payload&user_id=eq."+encodeURIComponent(uid),{headers:{"apikey":cfg.key,"Authorization":"Bearer "+cloudSession.access_token}});
    const data=await r.json();
    if(!r.ok) throw new Error(data.message||"Could not read cloud state. Check the SQL table and RLS policy.");
    if(data.length&&data[0].payload){syncBusy=true;store=Object.assign(store,data[0].payload);store.paces=Object.assign({},DEFAULT_PACES,store.paces||{});save();syncBusy=false;render();if(showMessage)showSyncMessage("Signed in. Training plan loaded from cloud and synced.");}
    else {await pushCloudState();if(showMessage)showSyncMessage("Signed in. Your current plan was uploaded to the cloud.");}
  }catch(err){syncBusy=false;if(showMessage)showSyncMessage(err.message||"Cloud sync failed.");}
}
async function pushCloudState(){
  if(!cloudSession||!syncConfig.url||!syncConfig.key||syncBusy)return;
  try{
    if(!(await ensureCloudSession())) return;
    const r=await fetch(syncConfig.url+"/rest/v1/app_state?on_conflict=user_id",{method:"POST",headers:{"apikey":syncConfig.key,"Authorization":"Bearer "+cloudSession.access_token,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({user_id:cloudSession.user.id,payload:store,updated_at:new Date().toISOString()})});
    if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d.message||"Cloud save failed. Check the table and RLS policy.");}
    showSyncMessage("Cloud sync connected · latest changes saved.");
  }catch(err){showSyncMessage(err.message||"Cloud save failed. Reconnect from Settings if your session expired.");}
}
document.getElementById("syncForm").addEventListener("submit",e=>{e.preventDefault();syncConfig=currentSyncConfig();authCloud(false).catch(err=>showSyncMessage(err.message||"Sign-in failed."));});
document.getElementById("syncSignup").addEventListener("click",()=>{syncConfig=currentSyncConfig();authCloud(true).catch(err=>showSyncMessage(err.message||"Account creation failed."));});
document.getElementById("syncLogout").addEventListener("click",()=>{cloudSession=null;localStorage.removeItem(SYNC_SESSION_KEY);showSyncMessage("Disconnected. Local data remains on this device.");});
if(cloudSession&&syncConfig.url&&syncConfig.key){pullCloudState(false);}

render();
window.__lastCountdownDate=iso(new Date());
setInterval(()=>{const fresh=iso(new Date());if(fresh!==window.__lastCountdownDate){window.__lastCountdownDate=fresh;todayISO=fresh;today0=new Date(fresh+'T00:00:00');weekStart=mondayOf(today0);render();}},60000);
window.addEventListener('resize',()=>{if(document.getElementById('statistics').classList.contains('active'))renderStatistics(document.querySelector('[data-range].active')?.dataset.range||'weekly');});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
 // plan52.js: current week + 12-week plan to a 10K on Sat 6 Feb 2027 (Mon 9 Nov 2026 to Sun 7 Feb 2027).
// Loaded AFTER the main script in index.html. It replaces the old 8-week plan.
// Each week = list of [day offset from Monday, practice]; edit any practice below.
(function () {
const { PLAN, PHASE_BY_WEEK, NEW_PHASES } = window.TRAINING_PLAN_DATA;

// Replace the old plan
for (let i = 0; i < PLAN.length * 7; i++) delete SESS[iso(addDays(first, i))];
PLAN.forEach((w, i) => {
  w.forEach(([off, x]) => { SESS[iso(addDays(first, i * 7 + off))] = S(x.t, x); });
  PHASE[iso(addDays(first, i * 7))] = PHASE_BY_WEEK[i];
});
WEEKS.length = 0; PLAN.forEach(w => WEEKS.push(w));
PHASES.length = 0; NEW_PHASES.forEach(p => PHASES.push(p));
END.setTime(addDays(first, PLAN.length * 7 - 1).getTime());
dCopyDate.max = iso(END);

// Calendar months shown (Oct 2026 to Nov 2027)
MONTHS.length = 0;
[[2026,9],[2026,10],[2026,11]].concat(Array.from({length: 11}, (_, i) => [2027, i])).forEach(m => MONTHS.push(m));

// Races of the 12-week plan (goal times calculate the pace in Races > Goals).
// Log the actual time in each event's Result section.
EVENTS.length = 0;
[
  {id:"e-10k", name:"10K", date:"2026-11-08", type:"run", note:"", goalTime:"00:50:00", goalKm:"10"},
  {id:"e-5k-tt", name:"5K time trial", date:"2026-12-26", type:"run", note:"", goalTime:"00:23:00", goalKm:"5", isGoal:true},
  {id:"e-10k-feb", name:"10K", date:"2027-02-06", type:"run", note:"", goalTime:"00:46:45", goalKm:"10"}
].forEach(e => EVENTS.push(e));

// Use each practice's own planned duration when it has one
const baseEst = estimatedDuration;
estimatedDuration = function (g) {
  if (Number(g.ds) > 0) {
    const t = Math.round(Number(g.ds)), h = Math.floor(t / 60), m = t % 60;
    return "Est. " + (h ? h + "h " : "") + m + " min";
  }
  return baseEst(g);
};

// Update default pace settings only if you never changed them
const NP = {tempo:"5:22/km", test:"4:55/km", tempoSec:322, testSec:295, tempoMin:322/60, testMin:295/60};
Object.assign(DEFAULT_PACES, NP);
const sp = store.paces;
if (sp && sp.easySec === 390 && sp.tempoSec === 300 && sp.testSec === 292) { Object.assign(sp, NP); save(); }

// ===== Layout tweaks: week header on top, no empty day boxes, "Done" checkbox, plain background =====
const css = document.createElement("style");
css.textContent = `
body::before{display:none}
.wkbox{margin:0 0 18px}
.wkbox .wk{border-bottom:0;padding:4px 0 10px;align-items:center}
.wdays{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:8px}
.wdays .day{min-height:170px}
.wdays .num{display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:.82rem;font-weight:600;color:var(--ink)}
.ck{display:flex;align-items:center;gap:5px;font-size:.74rem;font-weight:400;color:var(--slate);cursor:pointer}
.ck input{width:20px;height:20px;margin:0;accent-color:#16834a;cursor:pointer}
.addsel{margin-left:auto;font:inherit;font-size:.78rem;border:1px solid var(--rule);border-radius:999px;background:#fff;color:var(--ink);padding:3px 8px;cursor:pointer}
`;
document.head.append(css);

function sessCell(d, evMap) {
  const k = iso(d), g = getS(k), cell = document.createElement("div");
  cell.id = "d-" + k;
  cell.className = "day" + (k === todayISO ? " today" : "");
  cell.innerHTML = '<span class="num"><span>' + WD[(d.getDay() + 6) % 7] + " " + d.getDate() + "</span>" +
    '<label class="ck"><input type="checkbox"' + (store.done[k] ? " checked" : "") + ' aria-label="Mark as completed"> Done</label></span>' +
    (evMap[k] || []).map(e => '<span class="evt">' + esc(e.name || "Event") + " · " + (TYPES[e.type] || "Other") + "</span>").join("");
  cell.querySelector("input").onchange = e => { store.done[k] = e.target.checked; save(); render(); };
  const b = document.createElement("button");
  b.className = "chip t-" + g.t + (store.done[k] ? " done" : ""); b.type = "button";
  b.innerHTML = chipHTML(g, k);
  b.onclick = () => openDay(k);
  cell.append(b);
  return cell;
}

// "+ Add practice" menu in the week header (replaces the old empty boxes)
function addSel(wf, last) {
  const opts = [];
  for (let x = new Date(wf); x <= last; x = addDays(x, 1)) {
    const k = iso(x);
    if (getS(k)) continue;
    opts.push(store.rm[k] && SESS[k]
      ? '<option value="restore:' + k + '">↺ Restore planned: ' + longFmt.format(x) + "</option>"
      : '<option value="' + k + '">' + longFmt.format(x) + "</option>");
  }
  if (!opts.length) return null;
  const s = document.createElement("select");
  s.className = "addsel"; s.setAttribute("aria-label", "Add a practice on a free day");
  s.innerHTML = '<option value="">+ Add practice</option>' + opts.join("");
  s.onchange = () => {
    const v = s.value; if (!v) return;
    if (v.indexOf("restore:") === 0) { delete store.rm[v.slice(8)]; save(); render(); }
    else addPractice(v);
  };
  return s;
}

function weekBox(mon, wf, last, evMap) {
  const wrap = document.createElement("div"); wrap.className = "wkbox";
  const head = weekSummary(mon, wf, last);   // dates, phase, planned km, completed km
  const sel = addSel(wf, last); if (sel) head.append(sel);
  wrap.append(head);
  const grid = document.createElement("div"); grid.className = "wdays";
  for (let d = new Date(wf); d <= last; d = addDays(d, 1)) if (getS(iso(d))) grid.append(sessCell(d, evMap));
  if (grid.children.length) wrap.append(grid);
  else { const p = document.createElement("p"); p.className = "note"; p.textContent = "No session planned this week."; wrap.append(p); }
  return wrap;
}

renderCalendar = function (evMap) {
  const viewFrom = weekStart > VIEW ? weekStart : VIEW;
  const cal = document.getElementById("cal"); cal.innerHTML = "";
  MONTHS.forEach(([y, m]) => {
    const ms = new Date(y, m, 1), me = new Date(y, m + 1, 0), weeks = [];
    for (let mon = mondayOf(ms); mon <= me; mon = addDays(mon, 7)) {
      const thu = addDays(mon, 3);
      if (thu.getMonth() !== m || thu.getFullYear() !== y) continue;
      const wf = mon < viewFrom ? viewFrom : mon, sun = addDays(mon, 6), last = sun < END ? sun : END;
      if (wf <= last) weeks.push({mon, wf, last});
    }
    if (!weeks.length) return;
    const box = document.createElement("section"); box.className = "slide white";
    box.innerHTML = "<h2>" + monthFmt.format(ms) + "</h2>";
    weeks.forEach(w => box.append(weekBox(w.mon, w.wf, w.last, evMap)));
    cal.append(box);
  });
};

renderArchive = function (evMap) {
  const body = document.getElementById("archiveBody"); body.innerHTML = "";
  const weeks = [];
  for (let m = mondayOf(VIEW); m < weekStart; m = addDays(m, 7)) weeks.push(m);
  weeks.reverse();
  document.getElementById("archiveSum").textContent = "Archived previous weeks (" + weeks.length + ")";
  if (!weeks.length) { body.innerHTML = '<p class="note">Nothing here yet. Each week moves here once it is over.</p>'; return; }
  weeks.forEach(mon => {
    const wf = mon < VIEW ? VIEW : mon, sun = addDays(mon, 6), last = sun < END ? sun : END;
    body.append(weekBox(mon, wf, last, evMap));
  });
};

// ===== Round 2: archive button, pace fix, Done at top, planned km when completed, new feels =====

// "Archived" button, left of "Today"
(function () {
  const goT = document.getElementById("goToday");
  const b = document.createElement("button");
  b.type = "button"; b.id = "goArchive"; b.textContent = "Archived";
  goT.parentNode.insertBefore(b, goT);
  b.onclick = () => {
    document.querySelectorAll(".side-tab").forEach(x => x.classList.toggle("active", x.dataset.tab === "training"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === "training"));
    const a = document.getElementById("archive"); a.open = true;
    a.scrollIntoView({behavior: "smooth", block: "start"});
  };
})();

// Duration parsing: accepts 32, 32:00, 1:05:30, 32'30
timeSeconds = function (value) {
  const x = String(value || "").trim().replace(/['’]/g, ":").replace(/[^0-9:]/g, "");
  if (!x) return 0;
  const a = x.split(":").map(Number);
  if (a.some(Number.isNaN)) return 0;
  if (a.length === 1) return a[0] * 60;
  if (a.length === 2) return a[0] * 60 + a[1];
  return a[0] * 3600 + a[1] * 60 + a[2];
};
// Chart labels: the value passed in is seconds per km (was shown as 384:00 instead of 6:24)
formatPaceValue = function (sec) {
  const t = Math.round(sec);
  return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0");
};

// Distance counted for a session: the actual km if logged, else the planned km once it is completed
function doneKm(k) {
  const v = num((store.log[k] || {}).km);
  if (v > 0) return v;
  if (store.done[k]) { const g = getS(k); return g ? kmInfo(g).v : 0; }
  return 0;
}
function progBar(done, planned) {
  const pct = planned > 0 ? Math.min(100, Math.round(done / planned * 100)) : 0;
  const b = document.createElement("span"); b.className = "wbar";
  b.title = km1(done) + " of " + km1(planned) + " km (" + pct + "%)";
  b.innerHTML = '<i class="' + (pct >= 100 ? "full" : "") + '" style="width:' + pct + '%"></i>';
  return b;
}
weekSummary = function (mon, wf, last) {
  let planned = 0, logged = 0;
  for (let x = new Date(wf); x <= last; x = addDays(x, 1)) {
    const k = iso(x), g = getS(k);
    if (g) planned += kmInfo(g).v;
    if (store.done[k]) logged += doneKm(k);
  }
  const mk = iso(mon), el = document.createElement("div"); el.className = "wk";
  const wl = document.createElement("span"); wl.className = "wl";
  wl.textContent = shortFmt.format(wf) + " – " + shortFmt.format(last);
  const phase = document.createElement("button");
  phase.type = "button"; phase.className = "week-phase";
  phase.setAttribute("aria-label", "Change training phase for this week");
  phase.textContent = weekPhase(mk) || "Set phase";
  phase.title = "Click to cycle through training phases";
  phase.onclick = () => {
    const idx = PHASES.indexOf(weekPhase(mk));
    store.wt[mk] = PHASES[(idx + 1) % PHASES.length]; save(); render();
  };
  el.append(wl, phase);
  if (planned) { const s = document.createElement("span"); s.textContent = "Planned ≈ " + km1(planned) + " km"; el.append(s); }
  const s2 = document.createElement("span"); s2.textContent = "Actual completed " + km1(logged) + " km"; el.append(s2);
  if (planned > 0) {
    el.append(progBar(logged, planned));
    const pc = document.createElement("span"); pc.className = "wpct"; pc.textContent = Math.min(100, Math.round(logged / planned * 100)) + "%"; el.append(pc);
  }
  return el;
};

// Statistics: completed sessions without a logged distance count with their planned km
renderStatistics = function (range) {
  range = range || "weekly";
  const today = new Date(iso(new Date()) + "T00:00:00"), cutoff = new Date(today);
  if (range === "weekly") cutoff.setDate(cutoff.getDate() - 55);
  else { cutoff.setMonth(cutoff.getMonth() - 11); cutoff.setDate(1); }
  const keys = new Set(Object.keys(store.log || {}));
  Object.keys(store.done || {}).forEach(k => { if (store.done[k]) keys.add(k); });
  const entries = Array.from(keys).filter(k => {
    const d = new Date(k + "T00:00:00"), L = store.log[k] || {};
    return d >= cutoff && d <= addDays(today, 1) && (doneKm(k) > 0 || num(L.hr) > 0 || actualPace(k) > 0);
  }).sort();
  const labels = entries.map(k => shortFmt.format(new Date(k + "T00:00:00")));
  const mileage = entries.map(k => doneKm(k) > 0 ? doneKm(k) : null);
  const pace = entries.map(k => { const p = actualPace(k); return p > 0 ? p / 60 : null; });
  const hr = entries.map(k => num((store.log[k] || {}).hr) > 0 ? num(store.log[k].hr) : null);
  drawChart("mileageChart", mileage, labels, "km");
  drawChart("paceChart", pace, labels, "min/km");
  drawChart("hrChart", hr, labels, "bpm");
  const sm = document.getElementById("statsSummary");
  if (sm) {
    const nk = mileage.filter(v => v > 0).length, np = pace.filter(v => v > 0).length, nh = hr.filter(v => v > 0).length;
    sm.textContent = nk
      ? nk + " workout" + (nk === 1 ? "" : "s") + " with distance in this period (planned distance is used when a completed session has no logged distance). Pace available for " + np + ", heart rate for " + nh + "."
      : "No completed workouts with a distance in this period. Tick Done on a session or log its distance.";
  }
};

// Dashboard: weekly completed km (same rule) with progress bar, feel and backup observations
const baseDash = renderDashboard;
function addObs(ul, text) {
  const f0 = ul.querySelector("li");
  if (f0 && /^Complete and log/.test(f0.textContent)) ul.innerHTML = "";
  const li = document.createElement("li"); li.textContent = text; ul.append(li);
}
renderDashboard = function () {
  baseDash();
  const monday = mondayOf(new Date(iso(new Date()) + "T00:00:00"));
  let km = 0, pk = 0;
  for (let i = 0; i < 7; i++) { const k = iso(addDays(monday, i)), g = getS(k); km += doneKm(k); if (g) pk += kmInfo(g).v; }
  const ms = document.querySelectorAll("#dashboardMetrics .metric");
  if (ms[1]) {
    const sg = ms[1].querySelector("strong"); if (sg) sg.textContent = km.toFixed(1) + " km";
    if (pk > 0) ms[1].append(progBar(km, pk));
  }
  const ul = document.getElementById("observationList"); if (!ul) return;
  const cnt = {};
  Object.keys(store.done || {}).forEach(k => {
    const f = (store.log[k] || {}).feel;
    if (store.done[k] && (f === "Heavy legs" || f === "Tired" || f === "Hard")) cnt[f] = (cnt[f] || 0) + 1;
  });
  const parts = Object.keys(cnt).map(f => cnt[f] + " as " + f.toLowerCase());
  if (parts.length) addObs(ul, "You marked completed workouts as " + parts.join(", ") + ".");
  let last = null; try { last = localStorage.getItem("10k-training-last-backup"); } catch (e) {}
  const days = last ? (Date.now() - new Date(last).getTime()) / DAY : Infinity;
  if (days > 14 && Object.keys(store.done || {}).some(k => store.done[k]))
    addObs(ul, "No backup in the last 14 days. Download one in Settings.");
};

// Feel options: Tired, Hard, Heavy legs (old "Heavy" entries are renamed)
(function () {
  const sel = document.querySelector('#dlg [data-l="feel"]');
  if (sel) sel.innerHTML = '<option value="">-</option><option>Great</option><option>Good</option><option>OK</option><option>Tired</option><option>Hard</option><option>Heavy legs</option>';
  let changed = false;
  Object.keys(store.log || {}).forEach(k => { if (store.log[k] && store.log[k].feel === "Heavy") { store.log[k].feel = "Heavy legs"; changed = true; } });
  if (changed) save();
})();

// Session dialog: title, Done button and Completed checkbox at the top
(function () {
  const dl = document.getElementById("dlg"), t = document.getElementById("dTitle");
  const top = document.createElement("div"); top.className = "dtop";
  t.parentNode.insertBefore(top, t); top.append(t);
  const dn = document.createElement("button"); dn.type = "button"; dn.className = "btn"; dn.textContent = "Done";
  dn.onclick = () => dl.close(); top.append(dn);
  const chk = document.getElementById("dDone").closest("label"); top.after(chk);
  const st = document.createElement("style");
  st.textContent = "#dlg .dtop{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:10px;margin:-22px -22px 12px;padding:14px 22px;background:#fff;border-bottom:1px solid var(--mist)}#dlg .dtop h3{margin:0}#dlg>.chk{margin:0 0 14px;font-size:1rem;font-weight:600;display:flex;align-items:center;gap:10px}#dDone{width:22px;height:22px;accent-color:#16834a}";
  document.head.append(st);
})();

// ===== Round 3: backup, pace zone cards, weekly progress bar =====
(function () {
  const st = document.createElement("style");
  st.textContent = `
.wbar{display:block;flex:1 1 120px;max-width:240px;height:8px;border-radius:999px;background:var(--mist);overflow:hidden}
.wbar i{display:block;height:100%;background:var(--cobalt);border-radius:999px}
.wbar i.full{background:#16834a}
.metric .wbar{max-width:none;margin-top:12px}
.wpct{font-size:.8rem;color:var(--slate)}
.zsel{display:flex;align-items:center;gap:8px;font-size:.9rem;color:var(--slate);margin:6px 0 16px}
.zsel select{font:inherit;border:1px solid var(--rule);border-radius:10px;padding:6px 10px;background:#fff;color:var(--ink)}
.zone-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
.zone{background:#fff;border:1px solid var(--mist);border-radius:16px;padding:14px 16px;min-width:0}
.zone.key{border-color:var(--cobalt);box-shadow:inset 0 0 0 1px var(--cobalt)}
.zone h3{margin:0;font-size:.85rem;font-weight:500;color:var(--slate)}
.zone strong{display:block;font-size:1.35rem;font-weight:500;letter-spacing:-.04em;margin:6px 0 2px}
.zone .hr{font-size:.82rem;color:var(--slate)}
.zone p{margin:6px 0 0;font-size:.8rem;color:var(--slate)}
`;
  document.head.append(st);
})();

// ---- Backup: download / restore all data ----
(function () {
  const settings = document.getElementById("settings");
  if (!settings || document.getElementById("backupSec")) return;
  const LB = "10k-training-last-backup";
  const sec = document.createElement("section"); sec.className = "slide white"; sec.id = "backupSec";
  sec.innerHTML = '<h2>Backup</h2><p class="note">Download all your data (completed sessions, logs, edits, events and pace settings) as one file, and restore it on this or another device. Do it regularly, and before clearing your browser data.</p>' +
    '<div class="row" style="justify-content:flex-start"><button class="btn" id="bkExport" type="button">Download backup</button><button class="btn" id="bkImport" type="button">Restore from file</button><input id="bkFile" type="file" accept="application/json,.json" hidden></div>' +
    '<div class="row" id="bkConfirmRow" style="justify-content:flex-start" hidden><button class="btn" id="bkConfirm" type="button">Replace my data with this backup</button><button class="btn" id="bkCancel" type="button">Cancel</button></div>' +
    '<p id="bkMsg" class="note" aria-live="polite"></p>';
  const blocks = settings.querySelectorAll("section.slide");
  settings.insertBefore(sec, blocks[1] || null);
  const msg = document.getElementById("bkMsg"), row = document.getElementById("bkConfirmRow"), file = document.getElementById("bkFile");
  let pending = null;
  const lastText = () => {
    let l = null; try { l = localStorage.getItem(LB); } catch (e) {}
    return l ? "Last backup: " + fullFmt.format(new Date(l)) + "." : "No backup downloaded yet.";
  };
  msg.textContent = lastText();
  document.getElementById("bkExport").onclick = () => {
    const data = {app: "10k-training", version: 1, exported: new Date().toISOString(), store: store};
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], {type: "application/json"}));
    const a = document.createElement("a"); a.href = url; a.download = "10k-training-backup-" + iso(new Date()) + ".json";
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000);
    try { localStorage.setItem(LB, new Date().toISOString()); } catch (e) {}
    msg.textContent = "Backup downloaded. " + lastText();
  };
  document.getElementById("bkImport").onclick = () => file.click();
  file.onchange = () => {
    const f = file.files && file.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const o = JSON.parse(rd.result);
        if (!o || o.app !== "10k-training" || !o.store || typeof o.store !== "object") throw new Error("bad");
        pending = o;
        const s = o.store, nd = Object.keys(s.done || {}).filter(k => s.done[k]).length, nl = Object.keys(s.log || {}).length;
        msg.textContent = "Backup from " + fullFmt.format(new Date(o.exported)) + ": " + nd + " completed sessions, " + nl + " logs. Replace your current data with it?";
        row.hidden = false;
      } catch (e) { pending = null; row.hidden = true; msg.textContent = "This file is not a 10K training backup."; }
      file.value = "";
    };
    rd.readAsText(f);
  };
  document.getElementById("bkCancel").onclick = () => { pending = null; row.hidden = true; msg.textContent = lastText(); };
  document.getElementById("bkConfirm").onclick = () => {
    if (!pending) return;
    const s = Object.assign({o: {}, rm: {}, done: {}, log: {}, wt: {}, ev: null, paces: {}}, pending.store);
    s.paces = Object.assign({}, DEFAULT_PACES, s.paces || {});
    store = s; save(); pending = null; row.hidden = true; render();
    msg.textContent = "Backup restored.";
  };
})();

render();
// Additional interface improvements.
"use strict";
const $ = id => document.getElementById(id);

// ---- styles: blue-to-purple progress bar, collapsible zones ----
const st = document.createElement("style");
st.textContent = `
.wbar i,.wbar i.full{background:linear-gradient(90deg,#2f54e0,#8b5cf6)}
.zhead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.zhead h2{margin:0}
.ztoggle{display:flex;align-items:center;gap:8px;font:inherit;font-size:.88rem;color:var(--ink);background:#fff;border:1px solid var(--rule);border-radius:999px;padding:6px 14px;cursor:pointer}
.ztoggle .arr{display:inline-block;transition:transform .2s}
.ztoggle[aria-expanded="true"] .arr{transform:rotate(90deg)}`;
document.head.append(st);

// ---- dates as DD/MM/YYYY ----
const setFmt = (t, o) => { const f = new Intl.DateTimeFormat("en-GB", o); Object.defineProperty(t, "format", {value: d => f.format(d)}); };
setFmt(longFmt, {weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"});
setFmt(shortFmt, {day: "2-digit", month: "2-digit"});
setFmt(fullFmt, {day: "2-digit", month: "2-digit", year: "numeric"});
const MON = {Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6, Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12};
const _drawChart = window.drawChart;
window.drawChart = (id, v, labels, u) => _drawChart(id, v, labels.map(l => {
  const m = /^(\d+) ([A-Za-z]{3})/.exec(l); return m && MON[m[2]] ? pad(+m[1]) + "/" + pad(MON[m[2]]) : l;
}), u);

// ---- week of 16/11 is Base ----
const wk2 = iso(addDays(first, 7));
PHASE[wk2] = "Base";
if (store.wt && store.wt[wk2] === "Recovery") delete store.wt[wk2];

// Pace zones are part of Training plan; no separate Paces navigation tab.
const al = $("allures"); if (al) al.remove();
const oldZones = $("zonesSec"); if (oldZones) oldZones.remove();
const panel = $("training");
const TEST_IDS = ["e-5k-feb", "e-10k-mar", "e-5k-may", "e-10k-jun", "e-5k-aug", "e-10k-sep"];
const isGoal = e => e.isGoal !== undefined ? !!e.isGoal : TEST_IDS.indexOf(e.id) > -1;
(function () {
  const planned10kPace = w => {
    const A = [[0, 292], [12, 280]], x = Math.max(0, Math.min(12, w - 1));
    for (let k = 0; k < A.length - 1; k++) if (x <= A[k + 1][0]) return A[k][1] + (A[k + 1][1] - A[k][1]) * (x - A[k][0]) / (A[k + 1][0] - A[k][0]);
    return 280;
  };
  const latestTest10kPace = () => {
    const tests = getEv().filter(e => isGoal(e) && e.date && e.date <= todayISO)
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    for (const e of tests) {
      const log = store.log[e.date] || {};
      const distance = num(log.km) || num(e.goalKm);
      const duration = timeSeconds(log.duration || log.time);
      if (!(distance > 0 && duration > 0)) continue;
      const secondsPerKm = duration / distance;
      // Convert a 5K test to an equivalent 10K pace (Riegel exponent 1.06).
      return distance >= 9.5 ? secondsPerKm :
             distance >= 4.5 && distance <= 5.5 ? secondsPerKm * Math.pow(2, 1.06) : null;
    }
    return null;
  };
  const fp = s => { s = Math.round(s); return Math.floor(s / 60) + ":" + pad(s % 60); };
  // [name, low, high, key zone, shown when collapsed]
  const ZONES = [
    ["Recovery", null, 1.30, 0, 0], ["Easy", 1.17, 1.30, 0, 1], ["LT1 (aerobic threshold)", 1.175, 1.24, 1, 1],
    ["Steady", 1.11, 1.16, 0, 0], ["Tempo", 1.05, 1.08, 0, 0], ["LT2 (lactate threshold)", 1.01, 1.035, 1, 1],
    ["10K race pace", 1, 1, 0, 1], ["5K pace", 0.94, 0.97, 0, 0], ["1 km reps", 0.93, 0.95, 0, 0],
    ["Short reps", 0.86, 0.89, 0, 0], ["Strides", 0.80, 0.85, 0, 0]
  ];
  let open = false;
  const sec = document.createElement("section"); sec.className = "slide pale"; sec.id = "zonesSec";
  sec.innerHTML = '<div class="zhead"><h2>Pace zones</h2><button type="button" class="ztoggle" id="zoneToggle" aria-expanded="false" aria-controls="zoneGrid"><span class="arr">▸</span><span id="zoneToggleTxt">Show all</span></button></div>' +
    '<label class="zsel">Zones for <select id="zoneWeek"></select></label><div class="zone-grid" id="zoneGrid"></div><p class="note" id="zoneNote"></p>';
  const archive = $("archive");
  const calendar = $("cal");
  if (archive) archive.before(sec); else if (calendar) calendar.after(sec); else panel.append(sec);
  const cur = Math.max(1, Math.min(13, Math.floor((new Date(todayISO + "T00:00:00") - first) / (7 * DAY)) + 1));
  const sel = $("zoneWeek");
  sel.innerHTML = [[cur, "This week (week " + cur + ")"]].concat([1, 4, 7, 10, 13].map(w => [w, "Week " + w + " · " + fullFmt.format(addDays(first, (w - 1) * 7))]))
    .map(o => '<option value="' + o[0] + '">' + o[1] + "</option>").join("");
  function draw() {
    const p = latestTest10kPace() || planned10kPace(Number(sel.value) || cur);
    $("zoneGrid").innerHTML = ZONES.filter(z => open || z[4]).map(z => {
      const lo = z[1], hi = z[2];
      const pace = lo === null ? "slower than " + fp(hi * p) : lo === hi ? fp(p) : z[3] ? "≈ " + fp((lo + hi) / 2 * p) : fp(lo * p) + "–" + fp(hi * p);
      const range = z[3] ? '<span class="hr">' + fp(lo * p) + "–" + fp(hi * p) + "/km range</span>" : "";
      return '<div class="zone' + (z[3] ? " key" : "") + '"><h3>' + z[0] + "</h3><strong>" + pace + "/km</strong>" + range + "</div>";
    }).join("");
    $("zoneNote").textContent = latestTest10kPace()
      ? "Based on your latest logged test result, converted to an equivalent 10K pace. Update the test workout log to refresh these zones."
      : "No completed test result is logged yet. Showing the plan's target 10K pace for the selected week (" + fp(p) + "/km) as a provisional estimate.";
  }
  $("zoneToggle").onclick = e => {
    open = !open; e.currentTarget.setAttribute("aria-expanded", open);
    $("zoneToggleTxt").textContent = open ? "Show fewer" : "Show all"; draw();
  };
  sel.onchange = draw; draw();
})();

// ---- test events are goals, not races (and you can switch it per event) ----
const byDate = (a, b) => (a.date || "9999").localeCompare(b.date || "9999");
renderEvents = function () {
  const box = $("evList"); box.innerHTML = "";
  const list = getEv().filter(e => !isGoal(e)).sort(byDate);
  if (!list.length) box.innerHTML = '<p class="note">No race yet. Add your first one below.</p>';
  const up = list.filter(e => !e.date || e.date >= todayISO), past = list.filter(e => e.date && e.date < todayISO).reverse();
  up.forEach(e => box.append(evRow(e, false)));
  if (past.length) { const h = document.createElement("p"); h.className = "evh"; h.textContent = "Past races"; box.append(h); past.forEach(e => box.append(evRow(e, true))); }
  renderGoals(); countdown();
};
countdown = function () {
  const up = getEv().filter(e => !isGoal(e) && e.date && e.date >= todayISO).sort(byDate);
  const el = $("count"), el2 = $("count2");
  if (!up.length) { el.textContent = "No upcoming race. Add one in Races."; el2.textContent = ""; return; }
  const e = up[0], n = daysTo(e.date), name = e.name || "your event";
  el.textContent = n > 1 ? plural(n) + " to " + name + " · " + longFmt.format(new Date(e.date + "T00:00:00")) : n === 1 ? "Tomorrow: " + name : "Today: " + name + ". Good luck!";
  el2.textContent = up.slice(1, 3).map(x => { const d = daysTo(x.date); return (x.name || "Event") + " (" + (TYPES[x.type] || "Other") + ") " + (d === 0 ? "today" : d === 1 ? "tomorrow" : "in " + plural(d)); }).join(" · ");
};
renderGoals = function () {
  const box = $("goalList"); if (!box) return; box.innerHTML = "";
  const all = getEv().slice().sort(byDate);
  if (!all.length) { box.innerHTML = '<p class="note">Add an event to set a goal.</p>'; return; }
  [["Race goals", all.filter(e => !isGoal(e))], ["Test goals", all.filter(isGoal)]].forEach(([title, list]) => {
    if (!list.length) return;
    const h = document.createElement("p"); h.className = "evh"; h.textContent = title; box.append(h);
    list.forEach(e => {
      const pace = goalPace(e.goalTime, e.goalKm || (e.type === "run" ? 10 : 0)), g = isGoal(e);
      const row = document.createElement("button"); row.type = "button"; row.className = "ev" + (e.date && e.date < todayISO ? " past" : "");
      row.innerHTML = '<span class="evd">' + (e.date ? esc(fullFmt.format(new Date(e.date + "T00:00:00"))) : "No date") + "</span>" +
        '<span class="evn">' + esc(e.name || "Untitled event") + "<small>Target: " + esc(formatGoalTime(e.goalTime)) + "</small></span>" +
        '<span class="evtype ty-' + (g ? "trail" : "run") + '">' + (g ? "Test" : "Race") + "</span>" +
        '<span class="evg">' + (pace ? esc(pace) + "/km" : "Set goal") + "</span>";
      row.onclick = () => openEv(e.id); box.append(row);
    });
  });
};
(function () {
  const row = $("evDlg").querySelector(".row");
  const lab = document.createElement("label"); lab.className = "chk";
  lab.innerHTML = '<input type="checkbox" id="evIsGoal"> This is a test goal, not a race';
  row.before(lab);
  const cb = $("evIsGoal"), baseOpen = openEv;
  openEv = function (id) { baseOpen(id); const e = getEv().find(x => x.id === id); cb.checked = !!(e && isGoal(e)); };
  cb.onchange = () => { store.ev = getEv().map(x => x.id === evCur ? Object.assign({}, x, {isGoal: cb.checked}) : x); save(); render(); };
})();

render();
})();
// ===== Past races: actual result linked to the logged (archived) activity, and one-time events migration =====
(function () {
const $r = id => document.getElementById(id);
const NEW_EVENTS = EVENTS.map(e => Object.assign({}, e));
const OLD_IDS = ["e-5k-feb", "e-10k-may", "e-5k-jul", "e-10k-sep", "e-10k-45", "e-10k-mar", "e-5k-may", "e-10k-jun", "e-5k-aug", "e-10k-final", "e-10k-feb", "e-5k-tt"];

// Events you already saved in the browser or in the cloud still hold the old list: swap it once.
// Logged results are stored by date, so nothing you logged is lost.
function migrate() {
  if (store.evVer === 6) return;
  if (Array.isArray(store.ev)) {
    const keep = store.ev.filter(e => e && OLD_IDS.indexOf(e.id) < 0);
    NEW_EVENTS.forEach(n => { if (!keep.some(k => k.id === n.id)) keep.push(Object.assign({}, n)); });
    store.ev = keep;
  }
  store.evVer = 6; save();
}
const baseRender = render;
render = function () { migrate(); baseRender(); };

// ---- 2. Result helpers (the result IS the logged activity of that day) ----
const fmtDur = s => { s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ":" + pad(m) : m) + ":" + pad(s % 60); };
const fmtP = s => { s = Math.round(s); return Math.floor(s / 60) + ":" + pad(s % 60); };
const isPast = e => !!(e && e.date && e.date <= todayISO);
const goalKmOf = e => num(e.goalKm) || (e.type === "run" ? 10 : 0);
function resultOf(e) {
  if (!isPast(e)) return null;
  const L = store.log[e.date] || {}, sec = timeSeconds(L.duration || L.time);
  if (!sec) return null;
  const km = num(L.km) || goalKmOf(e);
  return {sec, km, pace: km > 0 ? sec / km : 0};
}
function compareText(e, r) {
  const goal = timeSeconds(e.goalTime), gk = goalKmOf(e);
  if (!goal || !(gk > 0) || !(r.km > 0)) return "";
  if (Math.abs(r.km - gk) / gk < 0.03) {
    const d = r.sec - goal;
    return d === 0 ? "exactly on the goal" : fmtDur(Math.abs(d)) + (d < 0 ? " faster than" : " slower than") + " the goal";
  }
  const d = Math.round(r.pace - goal / gk);
  return d === 0 ? "on the goal pace" : Math.abs(d) + " s/km " + (d < 0 ? "faster than" : "slower than") + " the goal pace";
}
function resultChip(e) {
  const r = resultOf(e); if (!r) return null;
  const s = document.createElement("small");
  s.className = "goal-label"; s.style.cssText = "display:inline-block;margin-right:6px;background:#e3f4ea;color:#16683b";
  s.textContent = "Result " + fmtDur(r.sec) + (r.pace ? " · " + fmtP(r.pace) + "/km" : "");
  return s;
}

// Races list and Goals list show the result next to the goal
const baseEvRow = evRow;
evRow = function (e, past) {
  const b = baseEvRow(e, past), c = resultChip(e), n = b.querySelector(".evn");
  if (c && n) n.append(c);
  return b;
};
const baseRenderGoals = renderGoals;
renderGoals = function () {
  baseRenderGoals();
  const box = $r("goalList"); if (!box) return;
  getEv().forEach(e => {
    if (!resultOf(e)) return;
    const d = fullFmt.format(new Date(e.date + "T00:00:00"));
    box.querySelectorAll(".ev").forEach(row => {
      const evd = row.querySelector(".evd"), evn = row.querySelector(".evn");
      if (evd && evn && evd.textContent === d && evn.firstChild && evn.firstChild.textContent === (e.name || "Untitled event")) evn.append(resultChip(e));
    });
  });
};

// ---- 3. Result section in the event dialog (past events only) ----
const row = evDlg.querySelector(".row");
const box = document.createElement("div"); box.id = "evResult"; box.hidden = true;
box.innerHTML = '<p class="sec">Result</p>' +
  '<div class="two"><label>Actual time (HH:MM:SS or MM:SS)<input type="text" id="evResTime" placeholder="e.g. 00:48:42"></label>' +
  '<label>Actual distance (km)<input type="text" id="evResKm" inputmode="decimal"></label></div>' +
  '<p class="goal-pace" id="evResPace"></p><p class="hint" id="evResLink"></p>' +
  '<div class="row" style="margin-top:0"><button class="btn" id="evResOpen" type="button">Open archived activity</button></div>';
row.before(box);

function syncResult(fill) {
  const e = getEv().find(x => x.id === evCur);
  box.hidden = !isPast(e); if (box.hidden) return;
  const L = store.log[e.date] || {}, r = resultOf(e), g = getS(e.date), c = r && compareText(e, r);
  if (fill) { $r("evResTime").value = L.duration || L.time || ""; $r("evResKm").value = L.km || ""; }
  $r("evResKm").placeholder = goalKmOf(e) ? String(goalKmOf(e)) : "";
  $r("evResPace").textContent = r ? "Actual pace " + (r.pace ? fmtP(r.pace) + "/km" : "n/a") + (c ? " · " + c : "") : "Enter your time to see your pace.";
  $r("evResLink").textContent = g
    ? "Linked to the archived activity of " + fullFmt.format(new Date(e.date + "T00:00:00")) + " (" + (LABELS[g.t] || "Workout") + "). Changes here update that day's log, and the other way round."
    : "No activity on this day yet. Entering a result creates one.";
  $r("evResOpen").hidden = !g;
}
function writeResult(from) {
  const e = getEv().find(x => x.id === evCur); if (!e || !isPast(e)) return;
  const t = $r("evResTime").value.trim(), k = $r("evResKm").value.trim();
  if (!getS(e.date)) {
    if (!t && !k) return;
    delete store.rm[e.date];
    store.o[e.date] = S(e.isGoal || /test/i.test(e.name || "") ? "test" : "race", {mx: e.name || "Race", km: e.goalKm || ""});
  }
  const L = Object.assign({}, store.log[e.date]);
  if (t) L.duration = t; else delete L.duration;
  if (k) L.km = k; else delete L.km;
  if (from === "time" && t && !L.km && goalKmOf(e)) { L.km = String(goalKmOf(e)); $r("evResKm").value = L.km; }
  store.log[e.date] = L;
  if (t) store.done[e.date] = true;
  save(); render(); syncResult(false);
}
$r("evResTime").addEventListener("input", () => writeResult("time"));
$r("evResKm").addEventListener("input", () => writeResult("km"));
$r("evResOpen").onclick = () => { const e = getEv().find(x => x.id === evCur); if (e) { evDlg.close(); openDay(e.date); } };
evFields.forEach(f => f.addEventListener("input", () => syncResult(true)));
const baseOpenEv = openEv;
openEv = function (id) { baseOpenEv(id); syncResult(true); };

render();
})();
