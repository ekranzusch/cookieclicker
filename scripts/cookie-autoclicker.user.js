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
//   1. Install Tampermonkey (https://www.tampermonkey.net/) in Chrome.
//   2. Open this file's raw URL, or create a new Tampermonkey script and paste
//      this whole file in, then save.
//   3. Reload Cookie Clicker. The clicker starts automatically once the game
//      has loaded. Use the Tampermonkey menu (toolbar icon) to Start/Stop.
//
// RATE
//   Clicking scales linearly with rate and each click is worth a large share
//   of your CpS, so faster earns more. The real limit is FRAME RATE: if the
//   game stutters, lower CPS. Click income does not show in the "cookies per
//   second" stat (that is passive only) -- judge it by how fast the bank fills.

(() => {
  'use strict';

  const CPS = 500;            // target clicks per second (try 250-1000+, watch FPS)
  const CLICKS_PER_TICK = 10; // clicks per timer fire; raise for very high CPS

  const intervalMs = Math.max(1, Math.round(1000 / (CPS / CLICKS_PER_TICK)));
  let timer = null;

  function isGameReady() {
    return typeof Game !== 'undefined' && Game.ready && typeof Game.ClickCookie === 'function';
  }

  function start() {
    if (timer || !isGameReady()) return;
    timer = setInterval(() => {
      for (let i = 0; i < CLICKS_PER_TICK; i++) Game.ClickCookie();
    }, intervalMs);
    console.log(`[autoclicker] started at ~${CPS} CPS (${CLICKS_PER_TICK} clicks every ${intervalMs}ms).`);
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
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
