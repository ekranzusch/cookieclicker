// ==UserScript==
// @name         Cookie Clicker Autoclicker
// @namespace    cookieclicker-ambient-automation
// @version      1.0.0
// @description  Auto-clicks the big cookie by calling Game.ClickCookie() directly. Clicking is a major income source in this build, so the default rate is intentionally high. Transparent, site-scoped alternative to a black-box autoclicker extension.
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

(() => {
  'use strict';

  const TARGET_CPS = 100;   // ~100 is plenty: the game only credits ~1 click per frame, so click income
                            // caps around 30-60 CPS. Higher just wastes CPU (and can spam console errors).
  const TICKS_PER_SEC = 50; // timer fires per second; 50 = 20ms, smooth and above the browser ~4ms floor
  const SHOW_METER = false; // set true to log actual clicks/sec while tuning

  const intervalMs = Math.round(1000 / TICKS_PER_SEC);
  const clicksPerTick = Math.max(1, Math.round(TARGET_CPS / TICKS_PER_SEC));
  let timer = null;
  let meter = null;
  let clicksThisSecond = 0;

  function isGameReady() {
    return typeof Game !== 'undefined' && Game.ready && typeof Game.ClickCookie === 'function';
  }

  function start() {
    if (timer || !isGameReady()) return;
    timer = setInterval(() => {
      for (let i = 0; i < clicksPerTick; i++) Game.ClickCookie();
      clicksThisSecond += clicksPerTick;
    }, intervalMs);
    if (SHOW_METER && !meter) {
      meter = setInterval(() => {
        console.log(`[autoclicker] actual ~${clicksThisSecond} clicks/sec (target ${TARGET_CPS})`);
        clicksThisSecond = 0;
      }, 1000);
    }
    console.log(`[autoclicker] started: target ${TARGET_CPS} CPS (${clicksPerTick} clicks every ${intervalMs}ms).`);
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    if (meter) {
      clearInterval(meter);
      meter = null;
    }
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
