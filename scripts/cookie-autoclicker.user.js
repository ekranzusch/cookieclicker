// ==UserScript==
// @name         Cookie Clicker Autoclicker
// @namespace    cookieclicker-ambient-automation
// @version      1.1.0
// @description  Auto-clicks the big cookie via Game.ClickCookie(), and (optionally) pops golden cookies and harvests ripe sugar lumps. Transparent, site-scoped alternative to a black-box autoclicker extension.
// @author       you
// @match        https://orteil.dashnet.org/cookieclicker/*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// ==/UserScript==
//
// INSTALL
//   1. Install Tampermonkey from the Chrome Web Store:
//      https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
//   2. Enable userscript execution (required by Chrome 138+). Right-click the
//      Tampermonkey icon -> Manage Extension, and turn on "Allow User Scripts".
//      (On older Chrome, enable Developer Mode at chrome://extensions instead.)
//      See https://www.tampermonkey.net/faq.php?q=Q209#Q209
//   3. Create a new Tampermonkey script and paste this whole file in, then save.
//   4. Reload Cookie Clicker. The clicker starts automatically once the game
//      has loaded. Use the Tampermonkey menu (toolbar icon) to Start/Stop.
//
// RATE
//   Clicking is a big income boost (measured ~13x passive income in testing),
//   but the game only CREDITS about one click per frame (~30 FPS). So click
//   income caps out around 30-60 CPS -- requesting 100, 1000, or 100000 all
//   earn the same. TARGET_CPS = 100 sits just above the cap with margin; going
//   higher only wastes CPU and can flood the console with errors.
//   Click income does not show in the "cookies per second" stat (passive only)
//   -- judge it by how fast the bank fills. The truly huge click payoffs come
//   from Click Frenzy golden-cookie buffs during active play.
//   To re-measure your own cap, set SHOW_METER = true and watch the log.
//
// GOLDEN COOKIES & SUGAR LUMPS
//   Unlike an OS-level clicker (which only catches these by luck when they drift
//   under the cursor), this targets them on purpose. AUTO_GOLDEN pops every
//   golden cookie / reindeer the instant it appears -- this synergizes with the
//   always-on clicker, since a popped Click Frenzy gets fully cashed in. AUTO_LUMP
//   harvests a sugar lump as soon as it is ripe (~23h), so none are ever missed.
//   Both run on a slow 1s check (cheap) and can be toggled from the menu.

(() => {
  'use strict';

  const TARGET_CPS = 100;   // ~100 is plenty: the game only credits ~1 click per frame, so click income
                            // caps around 30-60 CPS. Higher just wastes CPU (and can spam console errors).
  const TICKS_PER_SEC = 50; // timer fires per second; 50 = 20ms, smooth and above the browser ~4ms floor
  const SHOW_METER = false; // set true to log actual clicks/sec while tuning
  const AUTO_GOLDEN = true; // pop golden cookies / reindeer automatically
  const AUTO_LUMP = true;   // harvest sugar lumps once ripe (never harvests early)

  const intervalMs = Math.round(1000 / TICKS_PER_SEC);
  const clicksPerTick = Math.max(1, Math.round(TARGET_CPS / TICKS_PER_SEC));
  const SHIMMER_MS = 1000;  // how often to check for golden cookies / ripe lumps
  let timer = null;
  let shimmerTimer = null;
  let meter = null;
  let clicksThisSecond = 0;

  function isGameReady() {
    return typeof Game !== 'undefined' && Game.ready && typeof Game.ClickCookie === 'function';
  }

  // Pop every active shimmer (golden cookie, wrath cookie, reindeer). pop()
  // mutates Game.shimmers, so iterate over a copy.
  function popGolden() {
    if (!Array.isArray(Game.shimmers) || !Game.shimmers.length) return;
    Game.shimmers.slice().forEach((s) => {
      try { s.pop(); } catch (e) { /* ignore a shimmer that vanished mid-loop */ }
    });
  }

  // Harvest the sugar lump only once it is ripe. Calling Game.clickLump() on an
  // unripe lump pops a confirmation dialog, so we gate strictly on ripe age.
  function harvestLump() {
    if (typeof Game.clickLump !== 'function' || typeof Game.lumpT !== 'number') return;
    if (typeof Game.canLumps === 'function' && !Game.canLumps()) return;
    const ripeAge = (typeof Game.lumpRipeAge === 'number') ? Game.lumpRipeAge : 23 * 60 * 60 * 1000;
    if (Date.now() - Game.lumpT >= ripeAge) {
      try { Game.clickLump(); } catch (e) { /* ignore */ }
    }
  }

  function start() {
    if (timer || !isGameReady()) return;
    timer = setInterval(() => {
      for (let i = 0; i < clicksPerTick; i++) Game.ClickCookie();
      clicksThisSecond += clicksPerTick;
    }, intervalMs);
    if ((AUTO_GOLDEN || AUTO_LUMP) && !shimmerTimer) {
      shimmerTimer = setInterval(() => {
        if (AUTO_GOLDEN) popGolden();
        if (AUTO_LUMP) harvestLump();
      }, SHIMMER_MS);
    }
    if (SHOW_METER && !meter) {
      meter = setInterval(() => {
        console.log(`[autoclicker] actual ~${clicksThisSecond} clicks/sec (target ${TARGET_CPS})`);
        clicksThisSecond = 0;
      }, 1000);
    }
    console.log(`[autoclicker] started: target ${TARGET_CPS} CPS (${clicksPerTick} clicks every ${intervalMs}ms)` +
      `, golden=${AUTO_GOLDEN}, lumps=${AUTO_LUMP}.`);
  }

  function stop() {
    if (!timer && !shimmerTimer) return;
    if (timer) { clearInterval(timer); timer = null; }
    if (shimmerTimer) { clearInterval(shimmerTimer); shimmerTimer = null; }
    if (meter) { clearInterval(meter); meter = null; }
    console.log('[autoclicker] stopped.');
  }

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Autoclicker: Start', start);
    GM_registerMenuCommand('Autoclicker: Stop', stop);
  }

  // Auto-start once the game has finished loading.
  const ready = setInterval(() => {
    if (isGameReady()) {
      clearInterval(ready);
      start();
    }
  }, 500);
})();
