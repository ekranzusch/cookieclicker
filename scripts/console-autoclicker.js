// In-browser autoclicker for Cookie Clicker. RECOMMENDED over the OS-level
// cliclick script: it calls the game's own click function directly, so there
// is no mouse-event simulation and no process spawning, and it can sustain
// far higher click rates than cliclick (which is capped near ~50 CPS).
//
// WHY THE RATE MATTERS
//   Clicking is a major income source in this build, not a side activity.
//   Late-game mouse upgrades make each click worth a fixed share of your CpS
//   (~15% in testing), and click income scales LINEARLY with click rate.
//   So faster genuinely earns more here. Note: click income does NOT show up
//   in the "cookies per second" stat (that stat is passive only) -- judge the
//   effect by how fast your cookie bank fills.
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
// GOTCHA: browsers throttle timers in BACKGROUND tabs to ~1/sec, and the
//   game's own passive loop throttles in background tabs too. Keep Cookie
//   Clicker in the foreground (or use the Steam desktop version, which does
//   not background-throttle).

(() => {
  const TARGET_CPS = 100;   // ~100 is plenty: the game credits ~1 click per frame, so click income caps
                            // around 30-60 CPS. Higher just wastes CPU (and can spam console errors).
  const TICKS_PER_SEC = 50; // timer fires per second; 50 = 20ms, smooth and above the browser ~4ms floor
  const SHOW_METER = false; // set true to log actual clicks/sec while tuning

  // Stop any clicker (and meter) already running from a previous paste.
  if (window.autoClicker) clearInterval(window.autoClicker);
  if (window.autoClickerMeter) clearInterval(window.autoClickerMeter);

  const intervalMs = Math.round(1000 / TICKS_PER_SEC);
  const clicksPerTick = Math.max(1, Math.round(TARGET_CPS / TICKS_PER_SEC));
  let clicksThisSecond = 0;

  window.autoClicker = setInterval(() => {
    for (let i = 0; i < clicksPerTick; i++) Game.ClickCookie();
    clicksThisSecond += clicksPerTick;
  }, intervalMs);

  if (SHOW_METER) {
    window.autoClickerMeter = setInterval(() => {
      console.log(`[autoclicker] actual ~${clicksThisSecond} clicks/sec (target ${TARGET_CPS})`);
      clicksThisSecond = 0;
    }, 1000);
  }

  console.log(
    `[autoclicker] running: target ${TARGET_CPS} CPS ` +
    `(${clicksPerTick} clicks every ${intervalMs}ms). ` +
    `If the game stutters, lower TARGET_CPS. Stop with: clearInterval(window.autoClicker); clearInterval(window.autoClickerMeter)`
  );
})();
