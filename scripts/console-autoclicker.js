// In-browser autoclicker for Cookie Clicker. RECOMMENDED over the OS-level
// cliclick script: it calls the game's own click function directly, so there
// is no mouse-event simulation and no process spawning, and it can also pop
// golden cookies and harvest sugar lumps -- things a screen-position clicker
// only ever hits by luck.
//
// HOW TO USE
//   1. Open Cookie Clicker in your browser.
//   2. Open the developer console (F12, or Cmd+Option+J in Chrome).
//   3. Paste the block below and press Enter.
//   4. To stop: run  clearInterval(window.autoClicker)
//
// CHOOSING A RATE
//   Clicking is a big income boost (~13x passive in testing), but the game only
//   CREDITS about one click per frame (~30 FPS), so click income caps around
//   30-60 CPS -- requesting 100, 1000, or 100000 all earn the same. TARGET_CPS
//   = 100 sits just above the cap with margin; higher only wastes CPU and can
//   flood the console with errors. Click income does not show in the "cookies
//   per second" stat (passive only); the huge click payoffs come from Click
//   Frenzy during active play. Set SHOW_METER = true to re-measure the cap.
//
// GOLDEN COOKIES & SUGAR LUMPS
//   AUTO_GOLDEN pops golden cookies and reindeer (not wrath cookies — Ruin etc.).
//   A popped Click Frenzy gets fully cashed in by the always-on clicker. AUTO_LUMP
//   harvests a sugar lump once it is ripe (~23h), never early. Both run on a
//   cheap 1s check. Set either to false to disable.
//
// GOTCHA: browsers throttle timers in BACKGROUND tabs to ~1/sec, and the
//   game's own passive loop throttles in background tabs too. Keep Cookie
//   Clicker in the foreground (or use the Steam desktop version, which does
//   not background-throttle).

(() => {
  const TARGET_CPS = 100;   // ~100 is plenty: the game credits ~1 click per frame, so click income caps
                            // around 30-60 CPS. Higher just wastes CPU (and can spam console errors).
  const TICKS_PER_SEC = 50; // timer fires per second; 50 = 20ms, smooth and above the browser ~4ms floor
  const SHOW_METER = false; // set true to log actual clicks/sec while tuning
  const AUTO_GOLDEN = true; // pop golden cookies / reindeer automatically
  const AUTO_LUMP = true;   // harvest sugar lumps once ripe (never harvests early)

  // Stop anything already running from a previous paste.
  if (window.autoClicker) clearInterval(window.autoClicker);
  if (window.autoClickerMeter) clearInterval(window.autoClickerMeter);
  if (window.autoClickerShimmer) clearInterval(window.autoClickerShimmer);

  const intervalMs = Math.round(1000 / TICKS_PER_SEC);
  const clicksPerTick = Math.max(1, Math.round(TARGET_CPS / TICKS_PER_SEC));
  let clicksThisSecond = 0;

  window.autoClicker = setInterval(() => {
    for (let i = 0; i < clicksPerTick; i++) Game.ClickCookie();
    clicksThisSecond += clicksPerTick;
  }, intervalMs);

  if (AUTO_GOLDEN || AUTO_LUMP) {
    window.autoClickerShimmer = setInterval(() => {
      // pop() mutates Game.shimmers, so iterate over a copy.
      if (AUTO_GOLDEN && Array.isArray(Game.shimmers) && Game.shimmers.length) {
        Game.shimmers.slice().forEach((s) => {
          if (s.wrath) return; // wrath cookies are type "golden" with .wrath === 1
          try { s.pop(); } catch (e) {}
        });
      }
      // Only harvest a ripe lump -- clickLump() on an unripe lump pops a dialog.
      if (AUTO_LUMP && typeof Game.clickLump === 'function' && typeof Game.lumpT === 'number') {
        if (typeof Game.canLumps === 'function' && !Game.canLumps()) return;
        const ripeAge = (typeof Game.lumpRipeAge === 'number') ? Game.lumpRipeAge : 23 * 60 * 60 * 1000;
        if (Date.now() - Game.lumpT >= ripeAge) { try { Game.clickLump(); } catch (e) {} }
      }
    }, 1000);
  }

  if (SHOW_METER) {
    window.autoClickerMeter = setInterval(() => {
      console.log(`[autoclicker] actual ~${clicksThisSecond} clicks/sec (target ${TARGET_CPS})`);
      clicksThisSecond = 0;
    }, 1000);
  }

  console.log(
    `[autoclicker] running: target ${TARGET_CPS} CPS ` +
    `(${clicksPerTick} clicks every ${intervalMs}ms), golden=${AUTO_GOLDEN}, lumps=${AUTO_LUMP}. ` +
    `Stop with: clearInterval(window.autoClicker); clearInterval(window.autoClickerShimmer); clearInterval(window.autoClickerMeter)`
  );
})();
