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
//   The real limit is FRAME RATE, not a fixed CPS number. The game's logic
//   loop runs at ~30 FPS on a single thread and clicks share that thread, so
//   push the rate up and only back off if the game visibly stutters or lags.
//   A few hundred to ~1000 CPS is a strong, safe range on modern hardware.
//
// GOTCHA: browsers throttle timers in BACKGROUND tabs to ~1/sec, and the
//   game's own passive loop throttles in background tabs too. Keep Cookie
//   Clicker in the foreground (or use the Steam desktop version, which does
//   not background-throttle).

(() => {
  const CPS = 500;            // target clicks per second (try 250-1000+, watch FPS)
  const CLICKS_PER_TICK = 10; // clicks per timer fire; raise this for very high CPS

  // Stop any clicker already running from a previous paste.
  if (window.autoClicker) clearInterval(window.autoClicker);

  const intervalMs = Math.max(1, Math.round(1000 / (CPS / CLICKS_PER_TICK)));

  window.autoClicker = setInterval(() => {
    for (let i = 0; i < CLICKS_PER_TICK; i++) Game.ClickCookie();
  }, intervalMs);

  console.log(
    `[autoclicker] running at ~${CPS} CPS ` +
    `(${CLICKS_PER_TICK} clicks every ${intervalMs}ms). ` +
    `If the game stutters, lower CPS. Stop with: clearInterval(window.autoClicker)`
  );
})();
