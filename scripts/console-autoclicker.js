// In-browser autoclicker for Cookie Clicker.
//
// This is the lowest-overhead way to autoclick for a 24/7, idle-leaning run:
// it calls the game's own click function directly, so there is no OS-level
// mouse-event simulation and no process spawning. It also gives you exact,
// stable control over the click rate.
//
// HOW TO USE
//   1. Open Cookie Clicker in your browser.
//   2. Open the developer console (F12, or Cmd+Option+J in Chrome).
//   3. Paste the block below and press Enter.
//   4. To stop: run  clearInterval(window.autoClicker)
//
// CHOOSING A RATE
//   This build's income is ~all passive, and the game's logic loop runs at
//   ~30 FPS on a single thread. Clicking competes with the loop that mints
//   your passive cookies, so clicking faster than a few hundred CPS can
//   actually REDUCE income while wasting CPU. ~25-100 CPS is plenty.
//
// GOTCHA: browsers throttle timers in BACKGROUND tabs to ~1/sec. The game's
//   own passive loop is throttled in background tabs too, so keep Cookie
//   Clicker in the foreground (or use the Steam desktop version, which does
//   not background-throttle) regardless.

(() => {
  const CPS = 50;            // target clicks per second (~25-100 recommended)
  const CLICKS_PER_TICK = 5; // clicks per timer fire; keeps the timer relaxed

  // Stop any clicker already running from a previous paste.
  if (window.autoClicker) clearInterval(window.autoClicker);

  const intervalMs = Math.max(1, Math.round(1000 / (CPS / CLICKS_PER_TICK)));

  window.autoClicker = setInterval(() => {
    for (let i = 0; i < CLICKS_PER_TICK; i++) Game.ClickCookie();
  }, intervalMs);

  console.log(
    `[autoclicker] running at ~${CPS} CPS ` +
    `(${CLICKS_PER_TICK} clicks every ${intervalMs}ms). ` +
    `Stop with: clearInterval(window.autoClicker)`
  );
})();
