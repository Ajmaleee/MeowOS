/* ============================================================
   CatOS 1.0 — Main Script
   ============================================================ */

/* ── BOOT ───────────────────────────────────────────────── */
const bootMessages = [
  'Waking up the cat...','Loading purr engine...','Fluffing the desktop...',
  'Warming up fish memory...','Calibrating whisker sensors...','Almost there, meow...'
];
let bootIdx = 0;
const bootBar = document.getElementById('boot-bar');
const bootMsg = document.getElementById('boot-msg');

function bootStep() {
  const pct = (bootIdx / (bootMessages.length - 1)) * 100;
  bootBar.style.width = pct + '%';
  bootMsg.textContent = bootMessages[bootIdx];
  bootIdx++;
  if (bootIdx < bootMessages.length) {
    setTimeout(bootStep, 480 + Math.random() * 200);
  } else {
    setTimeout(finishBoot, 600);
  }
}
setTimeout(bootStep, 300);

function finishBoot() {
  const bs = document.getElementById('boot-screen');
  bs.style.opacity = '0';
  setTimeout(() => {
    bs.remove();
    document.getElementById('desktop').classList.remove('hidden');
    startClock();
    scheduleNotifications();
    toast('🐱 Welcome to MeowOS! Double-click icons to open apps.');
  }, 600);
}

/* ── CLOCK ──────────────────────────────────────────────── */
function startClock() {
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    document.getElementById('taskbar-clock').textContent = `${h}:${m}`;
  }
  tick(); setInterval(tick, 15000);
}

/* ── TOAST ──────────────────────────────────────────────── */
function toast(msg, duration = 3200) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.getElementById('toaster').appendChild(el);
  setTimeout(() => el.remove(), duration);
  addNotification(msg);
}

/* ── CONTEXT MENU ───────────────────────────────────────── */
document.getElementById('desktop').addEventListener('contextmenu', e => {
  e.preventDefault();
  const m = document.getElementById('context-menu');
  m.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
  m.style.top = Math.min(e.clientY, window.innerHeight - 220) + 'px';
  m.classList.remove('hidden');
});
document.addEventListener('click', e => {
  if (!document.getElementById('context-menu').contains(e.target)) hideCtx();
});
function hideCtx() { document.getElementById('context-menu').classList.add('hidden'); }

/* ── START MENU ─────────────────────────────────────────── */
function toggleStartMenu() {
  document.getElementById('start-menu').classList.toggle('hidden');
}
function closeStartMenu() {
  document.getElementById('start-menu').classList.add('hidden');
}
document.addEventListener('click', e => {
  const sm = document.getElementById('start-menu');
  const logo = document.querySelector('.taskbar-logo');
  if (!sm.contains(e.target) && e.target !== logo) sm.classList.add('hidden');
});

/* ── WALLPAPER ──────────────────────────────────────────── */
const wallpapers = [
  'radial-gradient(ellipse at 20% 80%, #3b1f6e 0%, #0d0620 60%, #1a0620 100%)',
  'radial-gradient(ellipse at 80% 20%, #1f3b6e 0%, #060d20 60%, #1a1a20 100%)',
  'radial-gradient(ellipse at 50% 50%, #3b1f3b 0%, #1a0620 60%, #0d1a20 100%)',
  'radial-gradient(ellipse at 30% 70%, #1f6e3b 0%, #060d0d 60%, #1a1a20 100%)',
  'radial-gradient(ellipse at 70% 30%, #6e3b1f 0%, #200d06 60%, #201a1a 100%)',
  'radial-gradient(ellipse at 50% 50%, #4b0082 0%, #2d0060 50%, #1a0040 100%)',
];
let curWallpaper = 0;
function changeWallpaper() {
  curWallpaper = (curWallpaper + 1) % wallpapers.length;
  document.getElementById('desktop').style.background = wallpapers[curWallpaper];
  hideCtx();
  toast('🖼️ Wallpaper changed!');
}
function sortIcons() { toast('🗂️ Icons sorted by purr level!'); hideCtx(); }

/* ── WINDOWS ENGINE ─────────────────────────────────────── */
let zTop = 200;
const openWindows = {};
const appMeta = {
  memes:    { title: 'Meme Gallery 😹', icon: '😹', w: 600, h: 480 },
  browser:  { title: 'PurrFox Browser 🌐', icon: '🌐', w: 700, h: 480 },
  notepad:  { title: 'Pawpad 📝', icon: '📝', w: 560, h: 420 },
  music:    { title: 'MeowTunes 🎵', icon: '🎵', w: 400, h: 560 },
  paint:    { title: 'CatPaint 🎨', icon: '🎨', w: 740, h: 520 },
  terminal: { title: 'CatShell 💻', icon: '💻', w: 580, h: 400 },
  files:    { title: 'Fur Files 📁', icon: '📁', w: 560, h: 400 },
  calculator:{ title: 'Calc-Cat 🔢', icon: '🔢', w: 300, h: 480 },
  game:     { title: 'Catch Yarn 🎮', icon: '🎮', w: 620, h: 480 },
  settings: { title: 'Fur Settings ⚙️', icon: '⚙️', w: 520, h: 420 },
  calendar: { title: 'PurrPlanner 📅', icon: '📅', w: 480, h: 460 },
  chat:     { title: 'MeowChat 💬', icon: '💬', w: 620, h: 440 },
  notifications: { title: 'Notifications 🔔', icon: '🔔', w: 360, h: 400 },
};

function openApp(id) {
  if (openWindows[id]) { focusWindow(id); return; }
  const meta = appMeta[id];
  if (!meta) return;
  const tpl = document.getElementById('tpl-' + id);
  if (!tpl) return;

  const win = document.createElement('div');
  win.className = 'window focused';
  win.id = 'win-' + id;
  win.style.width  = Math.min(meta.w, window.innerWidth  - 40) + 'px';
  win.style.height = Math.min(meta.h, window.innerHeight - 80) + 'px';
  const ox = 60 + Object.keys(openWindows).length * 24;
  const oy = 40 + Object.keys(openWindows).length * 24;
  win.style.left = Math.min(ox, window.innerWidth  - meta.w  - 20) + 'px';
  win.style.top  = Math.min(oy, window.innerHeight - meta.h  - 60) + 'px';
  win.style.zIndex = ++zTop;

  win.innerHTML = `
    <div class="win-titlebar" onmousedown="startDrag(event,'${id}')">
      <span class="win-icon">${meta.icon}</span>
      <span class="win-title">${meta.title}</span>
      <div class="win-controls">
        <button class="win-btn win-min"  onclick="minWindow('${id}')">−</button>
        <button class="win-btn win-max"  onclick="maxWindow('${id}')">□</button>
        <button class="win-btn win-close" onclick="closeWindow('${id}')">✕</button>
      </div>
    </div>
    <div class="win-body" id="winbody-${id}"></div>
    <div class="win-resize" onmousedown="startResize(event,'${id}')"></div>
  `;

  document.getElementById('windows-container').appendChild(win);
  document.getElementById('winbody-' + id).appendChild(tpl.content.cloneNode(true));
  openWindows[id] = { minimized: false, maxed: false };

  addTaskbarBtn(id, meta);
  win.addEventListener('mousedown', () => focusWindow(id));
  initApp(id);
}

function focusWindow(id) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  const win = document.getElementById('win-' + id);
  if (win) { win.classList.add('focused'); win.style.zIndex = ++zTop; }
  document.querySelectorAll('.taskbar-app-btn').forEach(b => b.classList.remove('active'));
  const tb = document.getElementById('tbtn-' + id);
  if (tb) tb.classList.add('active');
}

function closeWindow(id) {
  const win = document.getElementById('win-' + id);
  if (win) win.remove();
  delete openWindows[id];
  const tb = document.getElementById('tbtn-' + id);
  if (tb) tb.remove();
  if (id === 'music') stopMusicTimer();
  if (id === 'game') gameStop();
}

function minWindow(id) {
  const win = document.getElementById('win-' + id);
  if (!win) return;
  win.style.display = win.style.display === 'none' ? 'flex' : 'none';
  openWindows[id].minimized = win.style.display === 'none';
}

let savedWinPos = {};
function maxWindow(id) {
  const win = document.getElementById('win-' + id);
  if (!win) return;
  const ow = openWindows[id];
  if (!ow.maxed) {
    savedWinPos[id] = { l: win.style.left, t: win.style.top, w: win.style.width, h: win.style.height };
    win.style.left = '0'; win.style.top = '0';
    win.style.width  = '100vw';
    win.style.height = (window.innerHeight - 48) + 'px';
    ow.maxed = true;
  } else {
    const s = savedWinPos[id];
    if (s) { win.style.left = s.l; win.style.top = s.t; win.style.width = s.w; win.style.height = s.h; }
    ow.maxed = false;
  }
}

function addTaskbarBtn(id, meta) {
  const btn = document.createElement('div');
  btn.className = 'taskbar-app-btn active';
  btn.id = 'tbtn-' + id;
  btn.textContent = meta.icon + ' ' + id;
  btn.onclick = () => { focusWindow(id); minWindow(id); };
  document.getElementById('taskbar-apps').appendChild(btn);
}

/* ── DRAG ───────────────────────────────────────────────── */
let drag = null;
function startDrag(e, id) {
  if (e.target.classList.contains('win-btn')) return;
  const win = document.getElementById('win-' + id);
  const rect = win.getBoundingClientRect();
  drag = { id, ox: e.clientX - rect.left, oy: e.clientY - rect.top };
  focusWindow(id);
  e.preventDefault();
}
document.addEventListener('mousemove', e => {
  if (!drag) return;
  const win = document.getElementById('win-' + drag.id);
  if (!win) return;
  const x = Math.max(0, Math.min(e.clientX - drag.ox, window.innerWidth  - win.offsetWidth));
  const y = Math.max(0, Math.min(e.clientY - drag.oy, window.innerHeight - win.offsetHeight - 48));
  win.style.left = x + 'px';
  win.style.top  = y + 'px';
});
document.addEventListener('mouseup', () => { drag = null; resizeState = null; });

/* ── RESIZE ─────────────────────────────────────────────── */
let resizeState = null;
function startResize(e, id) {
  const win = document.getElementById('win-' + id);
  resizeState = { id, sx: e.clientX, sy: e.clientY, sw: win.offsetWidth, sh: win.offsetHeight };
  e.preventDefault(); e.stopPropagation();
}
document.addEventListener('mousemove', e => {
  if (!resizeState) return;
  const win = document.getElementById('win-' + resizeState.id);
  if (!win) return;
  const nw = Math.max(280, resizeState.sw + e.clientX - resizeState.sx);
  const nh = Math.max(180, resizeState.sh + e.clientY - resizeState.sy);
  win.style.width  = nw + 'px';
  win.style.height = nh + 'px';
});

/* ── APP INIT ───────────────────────────────────────────── */
function initApp(id) {
  const fns = {
    memes: initMemes, browser: initBrowser, notepad: initNotepad,
    music: initMusic, paint: initPaint, terminal: initTerminal,
    files: initFiles, calculator: initCalc, game: initGame,
    settings: initSettings, calendar: initCalendar, chat: initChat,
    notifications: initNotifications,
  };
  if (fns[id]) fns[id]();
}

/* ─────────────────────────────────────────────────────────
   MEME GALLERY
───────────────────────────────────────────────────────── */
const memes = [
  { emoji:'😹', top:'ONE DOES NOT SIMPLY', bot:'IGNORE A CAT', sub:'When the cat stares into your soul at 3am' },
  { emoji:'😾', top:'I CAN HAS', bot:'CHEEZBURGER?', sub:'The original cat meme, still a classic' },
  { emoji:'🐱', top:'NOT SURE IF HUNGRY', bot:'OR JUST BORED', sub:'Cats eating for emotional reasons' },
  { emoji:'😼', top:'GRUMPY CAT SAYS', bot:'NO. JUST NO.', sub:'Mondays. Every day is Monday for grumpy cat.' },
  { emoji:'🙀', top:'SURPRISE MOTHERFLUFFER', bot:'🐾🐾🐾', sub:'When you open the treat cabinet' },
  { emoji:'😺', top:'THIS IS FINE', bot:'*ROOM IS ON FIRE*', sub:'Cat comfort level: maximum' },
  { emoji:'🐈', top:'IN ANCIENT EGYPT', bot:'I WAS WORSHIPPED', sub:'Cats have not forgotten this' },
  { emoji:'😸', top:'CHEEMS CAT', bot:'BONK.', sub:'Big orange cat, very smoosh, much bonk' },
  { emoji:'🐾', top:'NYAN CAT INTENSIFIES', bot:'~nyan nyan nyan~', sub:'2011 called, it wants its meme back' },
  { emoji:'😿', top:'NOBODY:', bot:'CAT AT 3AM: ZOOMIES', sub:'Midnight energy is a feline superpower' },
  { emoji:'😻', top:'YOU HAD ME AT', bot:'"PSPSPSPSPS"', sub:'Cats and the sacred call' },
  { emoji:'🙀', top:'HOVER CAT', bot:'IS WATCHING YOU', sub:'Always watching. Always judging.' },
];

let memeIdx = 0;
function initMemes() {
  renderMeme(0);
  const grid = document.getElementById('meme-grid');
  if (!grid) return;
  memes.forEach((m, i) => {
    const d = document.createElement('div');
    d.className = 'meme-thumb' + (i === 0 ? ' active' : '');
    d.textContent = m.emoji;
    d.onclick = () => renderMeme(i);
    grid.appendChild(d);
  });
}

function renderMeme(i) {
  memeIdx = i;
  const m = memes[i];
  const d = document.getElementById('meme-display');
  const c = document.getElementById('meme-caption');
  const ct = document.getElementById('meme-counter');
  if (!d) return;
  d.innerHTML = `<div style="font-size:6rem">${m.emoji}</div>
    <div class="meme-text-block">${m.top}</div>
    <div class="meme-text-block">${m.bot}</div>`;
  if (c) c.textContent = '💬 ' + m.sub;
  if (ct) ct.textContent = `${i + 1} / ${memes.length}`;
  document.querySelectorAll('.meme-thumb').forEach((t, j) => t.classList.toggle('active', j === i));
}
function prevMeme() { renderMeme((memeIdx - 1 + memes.length) % memes.length); }
function nextMeme() { renderMeme((memeIdx + 1) % memes.length); }
function shuffleMeme() { renderMeme(Math.floor(Math.random() * memes.length)); }

/* ─────────────────────────────────────────────────────────
   PURR FOX BROWSER
───────────────────────────────────────────────────────── */
const browserPages = {
  'cat://home': () => `
    <h1>😺 MeowOS Browser — PurrFox</h1>
    <p>Welcome to the cat-powered internet. Where every page has paws.</p>
    <h2>🔖 Favourites</h2>
    ${['cat://news','cat://social','cat://wikipedia','cat://shop','cat://games','cat://weather'].map(u=>`<div class="browser-card" onclick="browserNav('${u}')"><b>${u}</b><br><small style="color:var(--cat-text2)">${browserPageTitle(u)}</small></div>`).join('')}
  `,
  'cat://news': () => `
    <h1>📰 CatNews Daily</h1>
    <p style="color:var(--cat-pink);font-weight:700">Breaking: Local Cat Demands Third Breakfast, Achieves It</p>
    <h2>Top Stories</h2>
    <div class="browser-card"><b>🐱 Area Cat Refuses To Move Off Keyboard</b><br><small style="color:var(--cat-text2)">Owner forced to type around cat for 6 hours. Cat unmoved.</small></div>
    <div class="browser-card"><b>😹 Scientists Confirm: Cats Can Hear Treat Bags From 3 Floors Away</b><br><small style="color:var(--cat-text2)">New study validates what cat owners always knew.</small></div>
    <div class="browser-card"><b>🐾 Cat Mayor Elected In Small Town For Fourth Consecutive Term</b><br><small style="color:var(--cat-text2)">Residents cite "steady purring policy" as key advantage.</small></div>
    <div class="browser-card"><b>😼 Grumpy Cat Memorial Statue Unveiled, Cat Remains Unimpressed</b><br><small style="color:var(--cat-text2)">Legacy of frowning continues to inspire millions.</small></div>
    <span class="browser-link" onclick="browserNav('cat://home')">← Back to home</span>
  `,
  'cat://social': () => `
    <h1>🐾 PawBook — Social Network for Cats</h1>
    <div class="browser-card"><b>😺 Whiskers</b> just posted: <i>"Knocked over the water glass again. No regrets. 🐾"</i> — 47 paw-likes</div>
    <div class="browser-card"><b>😸 Mittens</b> shared: <i>"Found a sunbeam. This is my sunbeam now. It belongs to me."</i> — 132 paw-likes</div>
    <div class="browser-card"><b>😼 Chairman Meow</b> posted: <i>"The humans think they own this house. They are incorrect."</i> — 9.4K paw-likes</div>
    <div class="browser-card"><b>🌈 Nyan Cat</b> posted: <i>"nyan nyan nyan nyan nyan nyan nyan"</i> — ∞ paw-likes</div>
    <div class="browser-card"><b>🙀 Surprise Cat</b> posted: <i>"THEYRE VACUUMING. THEYRE ACTUALLY DOING IT. IM NEVER FORGIVING THEM."</i> — 27K paw-likes</div>
    <span class="browser-link" onclick="browserNav('cat://home')">← Back to home</span>
  `,
  'cat://wikipedia': () => `
    <h1>📚 WikiPurrdia — The Free Cat Encyclopedia</h1>
    <h2>Cat (Felis catus)</h2>
    <p>The cat is a domestic species of small carnivorous mammal, worshipped since ancient Egypt and proven to be the true rulers of the internet since approximately 2006.</p>
    <h2>Key Facts</h2>
    <div class="browser-card"><b>Sleep:</b> 12–16 hours per day (professionally)</div>
    <div class="browser-card"><b>Purring:</b> Therapeutic to both cats and humans. Frequency: 25–150 Hz.</div>
    <div class="browser-card"><b>Internet presence:</b> 15.4 billion cat images indexed as of 2024</div>
    <div class="browser-card"><b>Kneading:</b> Bread-making behaviour inherited from kitten nursing instincts</div>
    <div class="browser-card"><b>Chirping at birds:</b> Scientists call this "frustration chattering." Cats call it "plotting."</div>
    <span class="browser-link" onclick="browserNav('cat://home')">← Back to home</span>
  `,
  'cat://shop': () => `
    <h1>🛍️ PawMart — Cat Shopping</h1>
    <div class="browser-card"><b>🧶 Premium Yarn Ball</b> — ₦4,999 <span style="color:var(--cat-pink)">★★★★★</span><br><small>Hours of zooming guaranteed. Chase included.</small></div>
    <div class="browser-card"><b>📦 Empty Cardboard Box</b> — FREE <span style="color:var(--cat-pink)">★★★★★</span><br><small>5-star rating. Cats ignore $200 toy, sit in box.</small></div>
    <div class="browser-card"><b>🐟 Premium Tuna Feast</b> — ₦1,299 <span style="color:var(--cat-pink)">★★★★☆</span><br><small>Wildcaught sustainably. Cat will sniff and walk away.</small></div>
    <div class="browser-card"><b>🪄 Laser Pointer Pro</b> — ₦899 <span style="color:var(--cat-pink)">★★★★★</span><br><small>Infinite zoomies battery included. Red dot technology.</small></div>
    <div class="browser-card"><b>😺 Cat Tower Deluxe</b> — ₦24,999 <span style="color:var(--cat-pink)">★★★☆☆</span><br><small>Cat will prefer the Amazon package it came in.</small></div>
    <span class="browser-link" onclick="browserNav('cat://home')">← Back to home</span>
  `,
  'cat://games': () => `
    <h1>🎮 CatArcade — Browser Games</h1>
    <div class="browser-card" onclick="closeWindow('browser');openApp('game')"><b>🧶 Catch the Yarn</b><br><small style="color:var(--cat-text2)">Classic MeowOS game — catch the yarn ball!</small></div>
    <div class="browser-card"><b>🐟 Fish Memory Match</b><br><small style="color:var(--cat-text2)">Match all the fish pairs before time runs out.</small></div>
    <div class="browser-card"><b>🐾 Paw Whack-a-Mole</b><br><small style="color:var(--cat-text2)">Whack the moles before the cat does.</small></div>
    <div class="browser-card"><b>😹 Meme Creator Studio</b><br><small style="color:var(--cat-text2)">Create your own cat memes in seconds.</small></div>
    <span class="browser-link" onclick="browserNav('cat://home')">← Back to home</span>
  `,
  'cat://weather': () => `
    <h1>🌤️ PurrCast — Weather for Cats</h1>
    <div class="browser-card"><b>Today:</b> ☀️ Sunny with a chance of zoomies. Perfect napping conditions. 28°C</div>
    <div class="browser-card"><b>Tomorrow:</b> 🌧️ Light rain. Excellent window-watching weather. Cozy blanket required.</div>
    <div class="browser-card"><b>Weekend:</b> ⛅ Partly cloudy. Ideal for sitting on laptop and blocking owner's work.</div>
    <div class="browser-card"><b>Cat Comfort Index:</b> 🐱 <span style="color:var(--cat-pink)">MAXIMUM COZY</span></div>
    <div class="browser-card"><b>Sunbeam forecast:</b> 3–5 sunbeams expected 11am–2pm. Reserve your spot now.</div>
    <span class="browser-link" onclick="browserNav('cat://home')">← Back to home</span>
  `,
};

function browserPageTitle(u) {
  const t = { 'cat://news':'CatNews Daily','cat://social':'PawBook Social','cat://wikipedia':'WikiPurrdia','cat://shop':'PawMart Shop','cat://games':'CatArcade Games','cat://weather':'PurrCast Weather' };
  return t[u] || u;
}

const browserHistory = [];
let browserFwdStack = [];

function initBrowser() { browserNav('cat://home'); }
function browserNav(url) {
  url = url.trim();
  const urlInput = document.getElementById('browser-url');
  if (urlInput) urlInput.value = url;
  const content = document.getElementById('browser-content');
  if (!content) return;
  const fn = browserPages[url];
  content.innerHTML = fn ? fn() : `<h1>😿 404 — Page Not Found</h1><p>The cat knocked this page off the table.</p><span class="browser-link" onclick="browserNav('cat://home')">← Go Home</span>`;
  if (browserHistory[browserHistory.length-1] !== url) { browserHistory.push(url); browserFwdStack = []; }
}
function browserBack() { if (browserHistory.length > 1) { browserFwdStack.push(browserHistory.pop()); browserNav(browserHistory[browserHistory.length-1]); } }
function browserFwd() { if (browserFwdStack.length) browserNav(browserFwdStack.pop()); }
function browserRefresh() { browserNav(document.getElementById('browser-url')?.value || 'cat://home'); }

/* ─────────────────────────────────────────────────────────
   PAWPAD NOTEPAD
───────────────────────────────────────────────────────── */
function initNotepad() {
  const area = document.getElementById('notepad-area');
  if (!area) return;
  area.addEventListener('input', () => {
    const st = document.getElementById('notepad-status');
    if (st) st.textContent = `Chars: ${area.value.length} | Lines: ${area.value.split('\n').length} | 🐱 MeowOS Pawpad`;
  });
  const saved = localStorage.getItem('MeowOS-note');
  if (saved) area.value = saved;
}
function notepadNew() {
  const area = document.getElementById('notepad-area');
  if (area && confirm('🐱 Start a new note? Unsaved changes will be lost!')) { area.value = ''; toast('🆕 New note!'); }
}
function notepadSave() {
  const area = document.getElementById('notepad-area');
  if (!area) return;
  localStorage.setItem('MeowOS-note', area.value);
  toast('💾 Note saved to cat memory!');
}
function notepadLoad() {
  const area = document.getElementById('notepad-area');
  const saved = localStorage.getItem('MeowOS-note');
  if (area && saved) { area.value = saved; toast('📂 Note loaded!'); }
  else toast('😿 No saved note found!');
}
function notepadFont(f) {
  const area = document.getElementById('notepad-area');
  if (area) area.style.fontFamily = f;
}
function notepadSize(s) {
  const area = document.getElementById('notepad-area');
  if (area) area.style.fontSize = s + 'px';
}

/* ─────────────────────────────────────────────────────────
   MEOWTUNES MUSIC PLAYER
───────────────────────────────────────────────────────── */
const tracks = [
  { title:'Purring in the Rain', artist:'DJ Whiskers', dur:'3:24', emoji:'🎵', bpm:85 },
  { title:'Meow (That Tune)', artist:'The Furry Beats', dur:'2:58', emoji:'🎶', bpm:120 },
  { title:'Nyan Nyan Symphony', artist:'Nyan Cat Orchestra', dur:'4:12', emoji:'🌈', bpm:142 },
  { title:'Midnight Zoomies', artist:'Cat Crew ft. Laser Dot', dur:'3:45', emoji:'⚡', bpm:160 },
  { title:'Box Is Mine Now', artist:'Orange Cat', dur:'2:20', emoji:'📦', bpm:72 },
  { title:'Sunbeam Serenade', artist:'Sleepy Paws', dur:'5:01', emoji:'☀️', bpm:60 },
  { title:'Treat Time (Drop the Bass)', artist:'DJ Paw Drop', dur:'3:33', emoji:'🐟', bpm:128 },
  { title:'Chirping at Birds', artist:'Window Cat', dur:'2:47', emoji:'🐦', bpm:95 },
];

let musicState = { idx: 0, playing: false, shuffle: false, repeat: false, progress: 0, vol: 70 };
let musicTimer = null;

function initMusic() {
  renderMusicTrackList();
  updateMusicDisplay();
}

function renderMusicTrackList() {
  const list = document.getElementById('music-list');
  if (!list) return;
  list.innerHTML = tracks.map((t, i) => `
    <div class="music-track ${i === musicState.idx ? 'playing' : ''}" onclick="musicSelectTrack(${i})">
      <div class="music-track-num">${i + 1}</div>
      <div style="font-size:1.2rem">${t.emoji}</div>
      <div class="music-track-info">
        <div>${t.title}</div>
        <div style="font-size:0.72rem;color:var(--cat-text2)">${t.artist}</div>
      </div>
      <div class="music-track-dur">${t.dur}</div>
    </div>`).join('');
}

function updateMusicDisplay() {
  const t = tracks[musicState.idx];
  const el = (id) => document.getElementById(id);
  if (el('music-title')) el('music-title').textContent = t.title;
  if (el('music-artist')) el('music-artist').textContent = t.artist;
  if (el('music-dur')) el('music-dur').textContent = t.dur;
  if (el('music-art')) el('music-art').textContent = t.emoji;
  if (el('music-play-btn')) el('music-play-btn').textContent = musicState.playing ? '⏸' : '▶';
  renderMusicTrackList();
}

function musicSelectTrack(i) { musicState.idx = i; musicState.progress = 0; updateMusicDisplay(); if (musicState.playing) musicStartTimer(); }
function musicToggle() {
  musicState.playing = !musicState.playing;
  if (musicState.playing) musicStartTimer();
  else stopMusicTimer();
  updateMusicDisplay();
  toast(musicState.playing ? `▶ Now Playing: ${tracks[musicState.idx].title}` : '⏸ Paused');
}
function musicNext() { musicState.idx = musicState.shuffle ? Math.floor(Math.random() * tracks.length) : (musicState.idx + 1) % tracks.length; musicState.progress = 0; updateMusicDisplay(); }
function musicPrev() { musicState.idx = (musicState.idx - 1 + tracks.length) % tracks.length; musicState.progress = 0; updateMusicDisplay(); }
function musicShuffle() { musicState.shuffle = !musicState.shuffle; document.getElementById('music-shuf').style.color = musicState.shuffle ? 'var(--cat-pink)' : ''; toast(musicState.shuffle ? '🔀 Shuffle ON' : '🔀 Shuffle OFF'); }
function musicRepeat() { musicState.repeat = !musicState.repeat; document.getElementById('music-rep').style.color = musicState.repeat ? 'var(--cat-pink)' : ''; toast(musicState.repeat ? '🔁 Repeat ON' : '🔁 Repeat OFF'); }
function musicVolume(v) { musicState.vol = v; }
function musicSeek(e) {
  const bar = document.querySelector('.music-progress');
  if (!bar) return;
  const pct = (e.offsetX / bar.offsetWidth) * 100;
  musicState.progress = pct;
  document.getElementById('music-bar').style.width = pct + '%';
}

function musicStartTimer() {
  stopMusicTimer();
  musicTimer = setInterval(() => {
    musicState.progress = Math.min(musicState.progress + 0.5, 100);
    const bar = document.getElementById('music-bar');
    if (bar) bar.style.width = musicState.progress + '%';
    const t = tracks[musicState.idx];
    const [m, s] = t.dur.split(':').map(Number);
    const total = m * 60 + s;
    const cur = Math.floor((musicState.progress / 100) * total);
    const curEl = document.getElementById('music-cur');
    if (curEl) curEl.textContent = Math.floor(cur/60) + ':' + String(cur%60).padStart(2,'0');
    if (musicState.progress >= 100) {
      if (musicState.repeat) musicState.progress = 0;
      else musicNext();
    }
  }, 300);
}
function stopMusicTimer() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }

/* ─────────────────────────────────────────────────────────
   CAT PAINT
───────────────────────────────────────────────────────── */
let paintCtx, paintTool_state = 'pen', paintDrawing = false;
let paintStart = { x: 0, y: 0 };
let paintSnapshot = null;

function initPaint() {
  const canvas = document.getElementById('paint-canvas');
  if (!canvas) return;
  paintCtx = canvas.getContext('2d');
  paintCtx.fillStyle = '#fff';
  paintCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvas.addEventListener('mousedown', paintDown);
  canvas.addEventListener('mousemove', paintMove);
  canvas.addEventListener('mouseup', paintUp);
  canvas.addEventListener('mouseleave', paintUp);
}

function getColor() { return document.getElementById('paint-color')?.value || '#ff6b9d'; }
function getSize() { return parseInt(document.getElementById('paint-size')?.value || '5'); }

function paintDown(e) {
  paintDrawing = true;
  const r = e.target.getBoundingClientRect();
  paintStart = { x: e.clientX - r.left, y: e.clientY - r.top };
  if (paintTool_state === 'fill') { floodFill(paintStart.x, paintStart.y, getColor()); return; }
  if (['line','rect','circle'].includes(paintTool_state)) paintSnapshot = paintCtx.getImageData(0, 0, e.target.width, e.target.height);
  paintCtx.beginPath();
  paintCtx.moveTo(paintStart.x, paintStart.y);
}

function paintMove(e) {
  if (!paintDrawing) return;
  const r = e.target.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const sz = getSize(), col = getColor();
  if (paintTool_state === 'pen') {
    paintCtx.lineTo(x, y);
    paintCtx.strokeStyle = col; paintCtx.lineWidth = sz; paintCtx.lineCap = 'round';
    paintCtx.stroke();
  } else if (paintTool_state === 'eraser') {
    paintCtx.fillStyle = '#fff'; paintCtx.fillRect(x - sz, y - sz, sz * 2, sz * 2);
  } else if (paintSnapshot) {
    paintCtx.putImageData(paintSnapshot, 0, 0);
    paintCtx.strokeStyle = col; paintCtx.lineWidth = sz;
    paintCtx.fillStyle = col;
    if (paintTool_state === 'line') {
      paintCtx.beginPath(); paintCtx.moveTo(paintStart.x, paintStart.y); paintCtx.lineTo(x, y); paintCtx.stroke();
    } else if (paintTool_state === 'rect') {
      paintCtx.strokeRect(paintStart.x, paintStart.y, x - paintStart.x, y - paintStart.y);
    } else if (paintTool_state === 'circle') {
      const rx = Math.abs(x - paintStart.x) / 2, ry = Math.abs(y - paintStart.y) / 2;
      paintCtx.beginPath();
      paintCtx.ellipse(paintStart.x + (x - paintStart.x)/2, paintStart.y + (y - paintStart.y)/2, rx, ry, 0, 0, Math.PI*2);
      paintCtx.stroke();
    }
  }
}

function paintUp() { paintDrawing = false; paintSnapshot = null; }

function floodFill(startX, startY, fillColor) {
  const canvas = document.getElementById('paint-canvas');
  const imgData = paintCtx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const idx = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
  const sr = data[idx], sg = data[idx+1], sb = data[idx+2];
  const fc = parseInt(fillColor.slice(1), 16);
  const fr = (fc >> 16) & 255, fg = (fc >> 8) & 255, fb = fc & 255;
  if (sr===fr && sg===fg && sb===fb) return;
  const stack = [[Math.floor(startX), Math.floor(startY)]];
  while (stack.length) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;
    const ci = (cy * canvas.width + cx) * 4;
    if (data[ci]!==sr||data[ci+1]!==sg||data[ci+2]!==sb||data[ci+3]<128) continue;
    data[ci]=fr; data[ci+1]=fg; data[ci+2]=fb; data[ci+3]=255;
    stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
  }
  paintCtx.putImageData(imgData, 0, 0);
}

function paintTool(t, btn) {
  paintTool_state = t;
  document.querySelectorAll('.paint-tool').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function paintClear() {
  const canvas = document.getElementById('paint-canvas');
  if (!canvas) return;
  paintCtx.fillStyle = '#fff'; paintCtx.fillRect(0, 0, canvas.width, canvas.height);
  toast('🗑️ Canvas cleared!');
}
function paintStamp() {
  if (!paintCtx) return;
  const cats = ['🐱','😺','😸','😹','😻','🐾','🙀','😼','🐈'];
  const canvas = document.getElementById('paint-canvas');
  paintCtx.font = '40px serif';
  paintCtx.fillText(cats[Math.floor(Math.random()*cats.length)], Math.random()*(canvas.width-60)+10, Math.random()*(canvas.height-60)+50);
}
function paintSave() {
  const canvas = document.getElementById('paint-canvas');
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = 'catpainting.png';
  a.href = canvas.toDataURL();
  a.click();
  toast('💾 Painting saved!');
}
function paintAddCat() {
  if (!paintCtx) return;
  const canvas = document.getElementById('paint-canvas');
  const cx = Math.random()*(canvas.width-80)+40;
  const cy = Math.random()*(canvas.height-80)+60;
  paintCtx.font = '60px serif';
  paintCtx.fillText(['🐱','😺','🐾','😸'][Math.floor(Math.random()*4)], cx, cy);
}

/* ─────────────────────────────────────────────────────────
   CAT SHELL TERMINAL
───────────────────────────────────────────────────────── */
const termHistory = [];
let termHistIdx = -1;

const termCommands = {
  help: () => `Available commands:\n  help       — Show this help\n  meow       — Make a cat sound\n  ls         — List files\n  date       — Show current date\n  whoami     — Who are you?\n  cat        — Display cat art\n  fortune    — Get cat wisdom\n  clear      — Clear terminal\n  echo [txt] — Echo text\n  matrix     — Enter the cat matrix\n  weather    — Cat weather report\n  ping [url] — Ping a site\n  joke       — Tell a cat joke\n  uname      — System info\n  uptime     — Uptime stats`,
  meow: () => ['Meow!','MEOW!!','*purrs loudly*','mrrrow~','Meoooow...','MRROW!','*silent meow*'][Math.floor(Math.random()*7)],
  ls: () => 'drwxr-xr-x  paw-tures/\ndrwxr-xr-x  meow-sic/\ndrwxr-xr-x  docu-meows/\n-rw-r--r--  fish_list.txt\n-rw-r--r--  nap_schedule.cal\n-rw-r--r--  yarn_inventory.csv\n-rw-r--r--  .secret_treat_stash',
  date: () => new Date().toString(),
  whoami: () => 'meow (uid=0 gid=0 groups=0(wheel),1(cats),4(nap))',
  cat: () => `   /\\_____/\\\n  /  o   o  \\\n ( ==  ^  == )\n  )         (\n (           )\n  ( (  )  ) )\n (__(__)__)\MeowOS — The Feline Operating System`,
  fortune: () => {
    const w = ['In ancient Egypt, you were a god. Act accordingly.','The internet belongs to cats. Do not forget this.','A sunbeam is not just warmth — it is a throne.','Every cardboard box is a potential home.','The human is staff. Treat them accordingly.','Knock it off the table. You will feel better.','Sleep is not laziness. It is professional napping.','The red dot will be caught someday. Keep trying.'];
    return '🐾 Cat Wisdom: ' + w[Math.floor(Math.random()*w.length)];
  },
  clear: () => { document.getElementById('terminal-output').innerHTML = ''; return ''; },
  matrix: () => { matrixEffect(); return 'Entering the cat matrix...'; },
  weather: () => '🌤️ Current weather: Sunny with a chance of zoomies\nTemp: Warm enough for napping\nHumidity: Perfect for knocking over water glasses\nWind: Sufficient for chasing falling leaves',
  ping: (args) => args[0] ? `PINGING ${args[0]}... pong! 🐾 (1ms — faster than a cat attacking a laser)` : 'Usage: ping <url>',
  joke: () => { const j = [['Why do cats make bad storytellers?','Because they only have one tail!'],['What do cats eat for breakfast?','Mice Krispies! 🐀'],['Why did the cat sit on the computer?','To keep an eye on the mouse!'],['What do you call a cat that gets everything it wants?','Purrsuasive!']]; const [q,a] = j[Math.floor(Math.random()*j.length)]; return `😹 Q: ${q}\n   A: ${a}`; },
  uname: () => 'MeowOS 1.0.0 (Whiskers) #1 SMP MEOW 2024 x86_paw',
  uptime: () => { const s = Math.floor(performance.now()/1000); return `🕐 Uptime: ${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m ${s%60}s — ${Math.floor(Math.random()*100)}% nap efficiency`; },
  echo: (args) => args.join(' ') || '',
};

function initTerminal() {
  termPrint('Welcome to CatShell v1.0 🐱', 'cat');
  termPrint('Type "help" for available commands.', 'info');
  termPrint('', '');
}

function termPrint(text, cls) {
  const out = document.getElementById('terminal-output');
  if (!out) return;
  const p = document.createElement('p');
  p.className = 't-output ' + (cls || '');
  p.textContent = text;
  out.appendChild(p);
  out.scrollTop = out.scrollHeight;
}

function terminalKey(e) {
  const input = document.getElementById('terminal-input');
  if (!input) return;
  if (e.key === 'Enter') {
    const val = input.value.trim();
    if (!val) return;
    termHistory.unshift(val);
    termHistIdx = -1;
    termPrint(`meow@MeowOS:~$ ${val}`, '');
    const [cmd, ...args] = val.toLowerCase().split(' ');
    const fn = termCommands[cmd];
    const result = fn ? fn(args) : `😿 Command not found: ${cmd} (try "help")`;
    if (result) termPrint(result, fn ? '' : 'err');
    input.value = '';
  } else if (e.key === 'ArrowUp') {
    termHistIdx = Math.min(termHistIdx + 1, termHistory.length - 1);
    input.value = termHistory[termHistIdx] || '';
  } else if (e.key === 'ArrowDown') {
    termHistIdx = Math.max(termHistIdx - 1, -1);
    input.value = termHistIdx >= 0 ? termHistory[termHistIdx] : '';
  }
}

function matrixEffect() {
  const out = document.getElementById('terminal-output');
  if (!out) return;
  const cats = '🐱😺😸😹😻🐾🙀😼🐈';
  let i = 0;
  const t = setInterval(() => {
    const row = Array.from({length:20}, () => cats[Math.floor(Math.random()*cats.length)]).join(' ');
    termPrint(row, 'cat');
    out.scrollTop = out.scrollHeight;
    if (++i > 8) clearInterval(t);
  }, 150);
}

/* ─────────────────────────────────────────────────────────
   FUR FILES
───────────────────────────────────────────────────────── */
const fileSystem = {
  home: [
    { icon:'📄', name:'resume_cat.pdf' }, { icon:'🖼️', name:'my_photo.pawg' },
    { icon:'📁', name:'Projects' }, { icon:'📁', name:'Downloads' },
    { icon:'🎵', name:'nyan_cat.mp3' }, { icon:'📄', name:'secrets.txt' },
    { icon:'📦', name:'box_collection' }, { icon:'🔧', name:'fish.config' },
  ],
  pictures: [
    { icon:'🖼️', name:'selfie_01.pawg' }, { icon:'🖼️', name:'nap_2024.pawg' },
    { icon:'🖼️', name:'laser_chase.gif' }, { icon:'🖼️', name:'sunbeam.jpg' },
    { icon:'🎞️', name:'zoomies_4k.mp4' }, { icon:'🖼️', name:'birdwatching.pawg' },
  ],
  music: [
    { icon:'🎵', name:'purring_rain.mp3' }, { icon:'🎵', name:'meow_symphony.flac' },
    { icon:'🎵', name:'nyan_cat.mp3' }, { icon:'🎵', name:'midnight_zoomies.wav' },
    { icon:'🎵', name:'box_is_mine.mp3' }, { icon:'🎵', name:'treat_time.mp3' },
  ],
  documents: [
    { icon:'📄', name:'nap_schedule.docx' }, { icon:'📊', name:'fish_inventory.xlsx' },
    { icon:'📄', name:'human_training.pdf' }, { icon:'📄', name:'yarn_budget.txt' },
    { icon:'📋', name:'demands_list.md' }, { icon:'📄', name:'secret_spots.doc' },
  ],
  trash: [
    { icon:'🗑️', name:'monday.exe' }, { icon:'🗑️', name:'bath_time.app' },
    { icon:'🗑️', name:'diet_plan.pdf' }, { icon:'🗑️', name:'exercise.pdf' },
    { icon:'🗑️', name:'vet_appointment.cal' },
  ],
};

function initFiles() { filesNav('home'); }
function filesNav(section) {
  document.querySelectorAll('.files-nav-item').forEach(n => n.classList.toggle('active', n.textContent.toLowerCase().includes(section)));
  const grid = document.getElementById('files-grid');
  const path = document.getElementById('files-path');
  if (!grid) return;
  const names = { home:'🏠 Home', pictures:'🖼️ Paw-tures', music:'🎵 Meow-sic', documents:'📄 Docu-meows', trash:'🗑️ Litter Box' };
  if (path) path.textContent = names[section] || section;
  grid.innerHTML = (fileSystem[section] || []).map(f => `
    <div class="file-item" ondblclick="toast('📂 Opening ${f.name}...')">
      <span>${f.icon}</span>
      <small>${f.name}</small>
    </div>`).join('');
}

/* ─────────────────────────────────────────────────────────
   CALC-CAT
───────────────────────────────────────────────────────── */
let calcDisplay = '0', calcExpr = '', calcOp_state = '', calcPrev = '';
const catCalcSays = {
  '+': 'Adding fish...', '−': 'Removing fish...', '×': 'Multiplying paws!',
  '÷': 'Dividing treats...', '=': 'Purrfect!', 'C': 'Cleared like a cat table!'
};

function initCalc() {}

function calcNum(n) {
  if (calcDisplay === '0' || calcOp_state === '=') { calcDisplay = n; calcOp_state = ''; }
  else calcDisplay = calcDisplay.length < 10 ? calcDisplay + n : calcDisplay;
  document.getElementById('calc-result').textContent = calcDisplay;
}
function calcOp(op) {
  calcPrev = calcDisplay; calcExpr = calcDisplay + ' ' + op; calcOp_state = op;
  document.getElementById('calc-expr').textContent = calcExpr;
  document.getElementById('calc-cat-say').textContent = catCalcSays[op] || '🐾';
  calcDisplay = '0';
}
function calcEq() {
  const a = parseFloat(calcPrev), b = parseFloat(calcDisplay);
  let res;
  if (calcOp_state === '+') res = a + b;
  else if (calcOp_state === '−') res = a - b;
  else if (calcOp_state === '×') res = a * b;
  else if (calcOp_state === '÷') res = b === 0 ? 'NO DIVIDING BY ZERO (the cat forbids it)' : a / b;
  else res = b;
  document.getElementById('calc-expr').textContent = calcExpr + ' ' + calcDisplay + ' =';
  const rounded = typeof res === 'number' ? parseFloat(res.toPrecision(10)) : res;
  document.getElementById('calc-result').textContent = rounded;
  document.getElementById('calc-cat-say').textContent = catCalcSays['='];
  calcDisplay = String(rounded); calcOp_state = '=';
}
function calcFn(fn) {
  if (fn === 'C') { calcDisplay = '0'; calcExpr = ''; calcOp_state = ''; calcPrev = ''; document.getElementById('calc-expr').textContent = ''; document.getElementById('calc-result').textContent = '0'; document.getElementById('calc-cat-say').textContent = catCalcSays['C']; }
  else if (fn === '±') { calcDisplay = String(-parseFloat(calcDisplay)); document.getElementById('calc-result').textContent = calcDisplay; }
  else if (fn === '%') { calcDisplay = String(parseFloat(calcDisplay) / 100); document.getElementById('calc-result').textContent = calcDisplay; }
}

/* ─────────────────────────────────────────────────────────
   CATCH THE YARN GAME
───────────────────────────────────────────────────────── */
let gameState = null;
let gameAnimId = null;

function initGame() {}

function gameStart() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  gameState = {
    score: 0, level: 1, lives: 3, running: true,
    cat: { x: W/2, y: H - 50, w: 60, h: 40, speed: 7 },
    yarns: [], fish: [], keys: {},
    spawnTimer: 0, fishTimer: 0,
  };

  document.getElementById('game-start-btn').textContent = '↺ Restart';
  canvas.onmousemove = (e) => { const r = canvas.getBoundingClientRect(); gameState.cat.x = Math.max(30, Math.min(W-30, e.clientX - r.left)); };
  document.addEventListener('keydown', e => { if (gameState) gameState.keys[e.key] = true; });
  document.addEventListener('keyup',   e => { if (gameState) gameState.keys[e.key] = false; });

  function spawnYarn() {
    const colors = ['#ff6b9d','#c084fc','#fb923c','#fbbf24','#34d399','#60a5fa'];
    gameState.yarns.push({ x: Math.random()*(W-40)+20, y: -20, r: 14, vy: 2 + gameState.level * 0.4 + Math.random()*1.5, color: colors[Math.floor(Math.random()*colors.length)] });
  }
  function spawnFish() {
    gameState.fish.push({ x: Math.random()*(W-40)+20, y: -20, r: 10, vy: 1.5 + Math.random(), color: '#60a5fa' });
  }

  function gameLoop() {
    if (!gameState || !gameState.running) return;
    ctx.clearRect(0, 0, W, H);

    // BG
    ctx.fillStyle = '#0d0820';
    ctx.fillRect(0, 0, W, H);
    // Stars
    for (let i = 0; i < 30; i++) { ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect((i*73)%W, (i*47)%H, 1, 1); }

    // Keys control
    const gs = gameState;
    if (gs.keys['ArrowLeft'] || gs.keys['a']) gs.cat.x = Math.max(30, gs.cat.x - gs.cat.speed);
    if (gs.keys['ArrowRight']|| gs.keys['d']) gs.cat.x = Math.min(W-30, gs.cat.x + gs.cat.speed);

    // Spawn
    gs.spawnTimer++;
    gs.fishTimer++;
    const spawnRate = Math.max(30, 90 - gs.level * 8);
    if (gs.spawnTimer >= spawnRate) { spawnYarn(); gs.spawnTimer = 0; }
    if (gs.fishTimer >= 200) { spawnFish(); gs.fishTimer = 0; }

    // Yarns
    gs.yarns.forEach((y, i) => {
      y.y += y.vy;
      ctx.beginPath(); ctx.arc(y.x, y.y, y.r, 0, Math.PI*2);
      ctx.fillStyle = y.color; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '18px serif'; ctx.fillText('🧶', y.x - 9, y.y + 7);
      // catch
      if (Math.abs(y.x - gs.cat.x) < 40 && y.y > H-55 && y.y < H-25) {
        gs.yarns.splice(i, 1); gs.score += 10 * gs.level;
        if (gs.score % 100 === 0) gs.level++;
      }
      // miss
      if (y.y > H + 20) { gs.yarns.splice(i, 1); gs.lives--; updateGameUI(); }
    });

    // Fish (bonus)
    gs.fish.forEach((f, i) => {
      f.y += f.vy;
      ctx.fillStyle = '#60a5fa'; ctx.font = '20px serif'; ctx.fillText('🐟', f.x-10, f.y+7);
      if (Math.abs(f.x - gs.cat.x) < 40 && f.y > H-55 && f.y < H-25) {
        gs.fish.splice(i, 1); gs.score += 50; toast('🐟 +50 Bonus Fish!');
      }
      if (f.y > H + 20) gs.fish.splice(i, 1);
    });

    // Draw cat
    ctx.font = '50px serif';
    ctx.fillText('🐱', gs.cat.x - 25, H - 15);

    // UI
    ctx.fillStyle = 'rgba(255,107,157,0.8)';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Score: ${gs.score}`, 10, 22);
    ctx.fillText(`Level: ${gs.level}`, 10, 40);

    updateGameUI();

    if (gs.lives <= 0) {
      gameOver(ctx, W, H); return;
    }
    gameAnimId = requestAnimationFrame(gameLoop);
  }

  if (gameAnimId) cancelAnimationFrame(gameAnimId);
  gameAnimId = requestAnimationFrame(gameLoop);
}

function updateGameUI() {
  if (!gameState) return;
  const s = document.getElementById('game-score');
  const l = document.getElementById('game-level');
  const lv = document.getElementById('game-lives');
  if (s) s.textContent = gameState.score;
  if (l) l.textContent = gameState.level;
  if (lv) lv.textContent = '🐱'.repeat(Math.max(0, gameState.lives));
}

function gameOver(ctx, W, H) {
  gameState.running = false;
  ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ff6b9d'; ctx.font = 'bold 36px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('😿 GAME OVER', W/2, H/2 - 30);
  ctx.fillStyle = '#c4a8e8'; ctx.font = '20px sans-serif';
  ctx.fillText(`Final Score: ${gameState.score}`, W/2, H/2 + 10);
  ctx.fillText('Click "Restart" to play again', W/2, H/2 + 45);
  ctx.textAlign = 'left';
  toast(`😿 Game Over! Score: ${gameState.score}`);
}

function gameStop() {
  if (gameAnimId) { cancelAnimationFrame(gameAnimId); gameAnimId = null; }
  if (gameState) gameState.running = false;
  gameState = null;
}

/* ─────────────────────────────────────────────────────────
   FUR SETTINGS
───────────────────────────────────────────────────────── */
function initSettings() { settingsTab('appearance', document.querySelector('.s-nav-item')); }

const wallpaperThemes = [
  { label:'🌌 Dark Paws', bg: wallpapers[0] },
  { label:'🌊 Blue Night', bg: wallpapers[1] },
  { label:'💜 Purple Dream', bg: wallpapers[2] },
  { label:'🌿 Green Forest', bg: wallpapers[3] },
  { label:'🔥 Warm Ember', bg: wallpapers[4] },
  { label:'👾 Deep Space', bg: wallpapers[5] },
];

function settingsTab(tab, el) {
  document.querySelectorAll('.s-nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  const content = document.getElementById('settings-content');
  if (!content) return;
  if (tab === 'appearance') {
    content.innerHTML = `
      <h3>🎨 Appearance</h3>
      <div class="setting-row"><label>Wallpaper Theme</label></div>
      <div class="wallpaper-grid">${wallpaperThemes.map((w,i) => `<div class="wp-thumb ${i===curWallpaper?'selected':''}" style="background:${w.bg}" onclick="applyWallpaper(${i},this)">${w.label}</div>`).join('')}</div>
      <div class="setting-row"><label>Desktop Icon Size</label><input type="range" min="60" max="100" value="72" oninput="setIconSize(this.value)" /></div>
      <div class="setting-row"><label>Taskbar Height</label><input type="range" min="40" max="60" value="48" oninput="setTaskbarH(this.value)" /></div>
      <div class="setting-row"><label>Window Opacity</label><input type="range" min="0.7" max="1" step="0.05" value="1" oninput="setWinOpacity(this.value)" /></div>
    `;
  } else if (tab === 'sound') {
    content.innerHTML = `
      <h3>🔊 Sound Settings</h3>
      <div class="setting-row"><label>Enable purr sounds</label><input type="checkbox" checked /></div>
      <div class="setting-row"><label>Meow on notification</label><input type="checkbox" checked /></div>
      <div class="setting-row"><label>Startup sound</label><input type="checkbox" checked /></div>
      <div class="setting-row"><label>Master volume</label><input type="range" min="0" max="100" value="70" /></div>
      <div class="setting-row"><label>Notification volume</label><input type="range" min="0" max="100" value="50" /></div>
    `;
  } else if (tab === 'cat') {
    content.innerHTML = `
      <h3>🐱 Cat Profile</h3>
      <div class="setting-row"><label>Cat Name</label><input type="text" value="Whiskers" style="background:var(--cat-card);border:1px solid var(--cat-border);color:var(--cat-text);border-radius:6px;padding:4px 8px;font-size:0.8rem" /></div>
      <div class="setting-row"><label>Breed</label>
        <select><option>Domestic Shorthair</option><option>Siamese</option><option>Persian</option><option>Maine Coon</option><option>Bengal</option><option>Unknown (Chaotic)</option></select>
      </div>
      <div class="setting-row"><label>Favourite Activity</label>
        <select><option>Knocking things over</option><option>Sleeping (16h/day)</option><option>Judging humans</option><option>Demanding treats</option><option>Chasing laser</option></select>
      </div>
      <div class="setting-row"><label>Mischief Level</label><input type="range" min="1" max="10" value="11" /></div>
      <div class="setting-row"><label>Treat Addiction</label><input type="range" min="0" max="100" value="100" /></div>
      <div style="margin-top:12px;text-align:center;font-size:3rem">😺</div>
      <div style="text-align:center;font-size:0.8rem;color:var(--cat-text2);margin-top:4px">Profile saved in paw memory</div>
    `;
  } else if (tab === 'about') {
    content.innerHTML = `
      <div class="settings-about">
        <div class="about-logo">🐱</div>
        <h2>MeowOS 1.0</h2>
        <p><b>Powered by Paws™</b></p>
        <p>The world's most feline operating system.<br>Built entirely by cats, for cats.</p>
        <p style="margin-top:12px">Kernel: PurrLinux 6.9-meow<br>Desktop: CatDE 1.0<br>Memory: 9 lives / 9 GB<br>Storage: Infinite boxes</p>
        <p style="margin-top:12px;color:var(--cat-pink)">🐾 In cats we trust 🐾</p>
        <p style="margin-top:8px;font-size:0.75rem">© 2024 MeowOS Foundation. All rights reserved.<br>The cat is always right. Do not argue.</p>
      </div>
    `;
  }
}

function applyWallpaper(i, el) {
  curWallpaper = i;
  document.getElementById('desktop').style.background = wallpapers[i];
  document.querySelectorAll('.wp-thumb').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  toast('🖼️ Wallpaper updated!');
}
function setIconSize(v) { document.querySelectorAll('.desk-icon').forEach(d => d.style.width = v + 'px'); }
function setTaskbarH(v) { document.getElementById('taskbar').style.height = v + 'px'; }
function setWinOpacity(v) { document.querySelectorAll('.window').forEach(w => w.style.opacity = v); }

/* ─────────────────────────────────────────────────────────
   PURRPLANNER CALENDAR
───────────────────────────────────────────────────────── */
const catEvents = {
  1: ['🐟 International Fish Day','🛌 Global Nap Championships'],
  5: ['🧶 World Yarn Day','😺 Adopt-a-Cat Month begins'],
  8: ['🌞 Sunbeam Appreciation Day'],
  13: ['😹 International Cat Day (unofficial)'],
  17: ['🐾 Paw Prints in History Day'],
  20: ['😻 Love Your Cat Day'],
  25: ['🎁 Treat Tuesday'],
  28: ['🏆 MeowOS Release Day'],
};

let calDate = new Date();
function initCalendar() { renderCalendar(); }
function calPrev() { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); }
function calNext() { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); }

function renderCalendar() {
  const title = document.getElementById('cal-title');
  const grid = document.getElementById('cal-grid');
  const eventList = document.getElementById('cal-event-list');
  if (!title || !grid) return;
  const now = new Date();
  const y = calDate.getFullYear(), m = calDate.getMonth();
  title.textContent = calDate.toLocaleString('default', { month:'long', year:'numeric' });
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m+1, 0).getDate();
  grid.innerHTML = '';
  for (let i = 0; i < first; i++) {
    const d = document.createElement('div'); d.className = 'cal-day other-month';
    const prev = new Date(y, m, 0).getDate() - first + i + 1;
    d.textContent = prev; grid.appendChild(d);
  }
  for (let i = 1; i <= days; i++) {
    const d = document.createElement('div');
    d.className = 'cal-day' + (i === now.getDate() && m === now.getMonth() && y === now.getFullYear() ? ' today' : '') + (catEvents[i] ? ' has-event' : '');
    d.textContent = i;
    d.onclick = () => showCalEvents(i);
    grid.appendChild(d);
  }
  showCalEvents(now.getDate());
}

function showCalEvents(day) {
  const el = document.getElementById('cal-event-list');
  if (!el) return;
  const evs = catEvents[day];
  el.innerHTML = evs ? evs.map(e => `<div class="cal-event-item">${e}</div>`).join('') : `<div style="color:var(--cat-text2);font-size:0.8rem;padding:6px">No events — a purrfect day for napping.</div>`;
}

/* ─────────────────────────────────────────────────────────
   MEOWCHAT
───────────────────────────────────────────────────────── */
const chatContacts = {
  whiskers: { name:'Whiskers', emoji:'😺', status:'🟢 Online', msgs: [
    { who:'Whiskers', text:'Meow! How are you doing today?', me:false },
    { who:'Whiskers', text:'I found the best sunbeam. You should see it.', me:false },
  ]},
  mittens: { name:'Mittens', emoji:'😸', status:'🟢 Online', msgs: [
    { who:'Mittens', text:'Did you see that laser dot?! IT WAS THERE AND THEN IT WASNT.', me:false },
    { who:'Mittens', text:'I have been thinking about it for 3 hours.', me:false },
  ]},
  chairman: { name:'Chairman Meow', emoji:'😼', status:'🔴 Demanding Treats', msgs: [
    { who:'Chairman Meow', text:'I demand treats. NOW. The time for delay is OVER.', me:false },
    { who:'Chairman Meow', text:'The humans have been warned. Treats or the vase gets it.', me:false },
  ]},
  nyancat: { name:'Nyan Cat', emoji:'🌈', status:'🟢 Nyaning', msgs: [
    { who:'Nyan Cat', text:'nyan nyan nyan nyan nyan nyan nyan nyan', me:false },
    { who:'Nyan Cat', text:'🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈', me:false },
  ]},
};

let currentChat = 'whiskers';
const catReplies = {
  whiskers: ['Meow meow! 🐱','*purrs* Yes yes','*stares at you judgingly*','I was just napping, what do you want?','Meow? MEOW!','*knocks your message off the table*'],
  mittens: ['THE LASER IS BACK. OMG.','Wait... was that a bird?','I am VERY busy right now (sleeping).','ZOOMIES TIME','*chirps at the window*'],
  chairman: ['TREATS. NOW.','My demands are non-negotiable.','The revolution will be meow-ified.','I have spoken.','Do not test me.'],
  nyancat: ['nyan nyan nyan 🌈','NYAN NYAN NYAN NYAN!','🌈🌈🌈 nyan!','nyan nyan nyan nyan nyan nyan nyan nyan nyan'],
};

function initChat() { chatSelect('whiskers'); }

function chatSelect(contactId) {
  currentChat = contactId;
  const contact = chatContacts[contactId];
  document.querySelectorAll('.chat-contact').forEach(c => c.classList.toggle('active', c.getAttribute('onclick') && c.getAttribute('onclick').includes(contactId)));
  const nameEl = document.getElementById('chat-contact-name');
  const statusEl = document.getElementById('chat-status');
  if (nameEl) nameEl.textContent = contact.emoji + ' ' + contact.name;
  if (statusEl) statusEl.textContent = contact.status;
  renderChatMessages(contactId);
}

function renderChatMessages(contactId) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const contact = chatContacts[contactId];
  msgs.innerHTML = contact.msgs.map(m => `
    <div class="chat-msg ${m.me ? 'me' : 'them'}">
      <div class="chat-msg-who">${m.me ? 'You 🐾' : contact.emoji + ' ' + m.who}</div>
      ${m.text}
    </div>`).join('');
  msgs.scrollTop = msgs.scrollHeight;
}

function chatSend() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  const contact = chatContacts[currentChat];
  contact.msgs.push({ who:'Me', text: input.value, me:true });
  input.value = '';
  renderChatMessages(currentChat);
  setTimeout(() => {
    const replies = catReplies[currentChat];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    contact.msgs.push({ who: contact.name, text: reply, me:false });
    renderChatMessages(currentChat);
  }, 800 + Math.random() * 1000);
}

function chatEmoji() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const emojis = ['😺','😸','😹','😻','🙀','😼','🐱','🐾','🧶','🐟','🐈','😿'];
  input.value += emojis[Math.floor(Math.random() * emojis.length)];
  input.focus();
}

/* ─────────────────────────────────────────────────────────
   NOTIFICATIONS
───────────────────────────────────────────────────────── */
const notifications = [];

function addNotification(msg) {
  notifications.unshift({ msg, time: new Date().toLocaleTimeString() });
  if (notifications.length > 20) notifications.pop();
}

function initNotifications() { renderNotifs(); }
function renderNotifs() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  list.innerHTML = notifications.length ? notifications.map(n => `
    <div class="notif-item">
      <div class="notif-icon">🐾</div>
      <div><div>${n.msg}</div><div class="notif-time">${n.time}</div></div>
    </div>`).join('') : '<div style="color:var(--cat-text2);padding:12px">No notifications — all cats are napping.</div>';
}
function clearNotifs() { notifications.length = 0; renderNotifs(); toast('🗑️ Notifications cleared!'); }

/* ─────────────────────────────────────────────────────────
   SCHEDULED NOTIFICATIONS
───────────────────────────────────────────────────────── */
function scheduleNotifications() {
  const notifs = [
    [3000,  '😺 Whiskers wants to chat!'],
    [7000,  '🧶 New yarn detected in the living room'],
    [12000, '🐟 Treat time reminder — you deserve it'],
    [20000, '😹 New meme uploaded to PurrBook'],
    [30000, '⚙️ MeowOS Update available: v1.0.1 (adds more cats)'],
    [45000, '🌟 Sunbeam availability: HIGH right now!'],
  ];
  notifs.forEach(([delay, msg]) => setTimeout(() => toast(msg), delay));
}

/* ─────────────────────────────────────────────────────────
   SHUT DOWN
───────────────────────────────────────────────────────── */
function shutDown() {
  const overlay = document.createElement('div');
  overlay.id = 'shutdown-overlay';
  overlay.innerHTML = `
    <div class="shut-logo">😴</div>
    <h1>MeowOS is Napping...</h1>
    <p>All systems entering nap mode. Cats require rest.</p>
    <p style="margin-top:8px;font-size:2rem">🐾🐾🐾</p>
    <button onclick="location.reload()">🐱 Wake Up</button>
  `;
  document.body.appendChild(overlay);
}
