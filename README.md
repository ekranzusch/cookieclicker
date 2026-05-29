# Cookie Clicker: Ambient Automation Playstyle

This README documents a low-maintenance, long-run Cookie Clicker playstyle built around:

- rare ascensions
- ambient automation
- passive momentum
- low micromanagement
- broad upgrade buying

This is **not** a hyper-optimized combo-clicking strategy. It is designed to make the game feel smooth, fast, and self-sustaining without turning it into a spreadsheet job.

---

# Core Philosophy

The central goal is simple: **get as far as possible on as few ascensions as possible.** Depth within a single long run matters more than ascension count or prestige-per-hour. Resets are the exception, not the engine.

The goal is not to play Cookie Clicker *perfectly*. The goal is to make Cookie Clicker run well with minimal attention.

This approach assumes:

- long sessions
- frequent idle time
- periodic check-ins
- autoclicker always running
- buying upgrades whenever they appear
- buying buildings in broad waves
- ascending rarely, but meaningfully

The game should feel like a machine you maintain, not a button you babysit.

---

# The Playstyle: Ambient Automation

This setup is best described as **ambient automation**.

It is not fully idle. It is not fully active.

It is a hybrid:

- the autoclicker keeps pressure on the big cookie
- passive gains keep production moving
- upgrades are bought as they appear
- buildings are bought in chunks
- golden cookies are clicked when convenient
- the game progresses steadily without constant supervision

The goal is to build a run that remains productive even when attention drifts.

---

# Autoclicker

Two options are provided:

- [`scripts/fastclick.sh`](scripts/fastclick.sh) — OS-level clicker for macOS (`cliclick`). It clicks wherever the cursor sits, so it keeps working while the window is merely visible-but-unfocused. Park the pointer over the big cookie before starting.
- [`scripts/console-autoclicker.js`](scripts/console-autoclicker.js) — a snippet pasted into the browser console that calls the game's click function directly. This is the lowest-overhead choice for a 24/7 run and gives exact rate control.

Either keeps constant click pressure on the big cookie.

What this changes:

- active clicking upgrades become much stronger
- passive + click hybrid upgrades gain value
- full idle becomes less important than always-on throughput
- broad production multipliers become more valuable than pure offline gains

This setup rewards **constant low-effort throughput**, not manual precision.

## Faster Is Not Better

Clicking at the maximum rate the hardware allows is **not** optimal.

- Cookie Clicker has no built-in click-rate cap, so the game accepts every click. The real ceiling is your CPU and browser, not the game.
- The game is single-threaded and its logic loop runs at roughly 30 FPS. Clicking, on-screen effects, and the loop that mints your **passive** cookies all share one thread. Push clicks too hard and you starve that loop.
- In this build income is almost entirely passive, so over-clicking can actually *reduce* total output while burning CPU around the clock for months.
- Click income itself is a rounding error here. The autoclicker matters mainly for Click Frenzy combos, which are done manually during active play.

A rate of roughly **25–100 CPS is plenty**. The `cliclick` floor (about 20 ms per event) naturally lands in this range, and the console snippet defaults to ~50 CPS. There is no reason to chase thousands of clicks per second.

Background-tab note: browsers throttle timers in unfocused tabs to about once per second, and the game's own passive loop throttles in background tabs as well. Keep Cookie Clicker in the foreground, or use the Steam desktop version, which does not background-throttle.

---

# Run Rules

## During Runs

Simple operating rules:

1. Keep the autoclicker running.
2. Buy every upgrade when it appears.
3. Buy buildings in broad waves (100s, then 10s, then singles).
4. Click golden cookies when convenient.
5. Do not force combo play.
6. Push dragon steadily.
7. Let the run stabilize and scale.

This run is strongest when it is allowed to breathe.

---

## Building Philosophy

Do not obsess over exact building ratios.

The rule is simple:

- if upgrades are available, buy upgrades
- if upgrades are not available, buy buildings in bulk

That is enough.

The autoclicker smooths over inefficiency. Long sessions smooth over imperfect decisions. Consistency matters more than precision.

---

## Golden Cookies

Golden cookies are opportunistic, not central.

- click them when seen
- enjoy the bonus
- do not build the run around combo fishing

This playstyle does not rely on constant golden-cookie babysitting.

The Golden Switch (a heavenly upgrade) grants a strong passive bonus while idle. Keep it on during unattended periods and switch it off only when actively combo-clicking golden cookies.

---

# Ascension Philosophy

Ascend rarely.

This strategy is built around **long runs**, not frequent resets.

Ascend when:

- the run has clearly stabilized
- growth has genuinely stalled over a long stretch, not just slowed
- a reset would multiply prestige several times over, not add a sliver
- the next ascension will materially improve the next long run

Do not ascend constantly. This build gets stronger by letting runs mature.

To put the cadence in perspective: a single run here can comfortably last months. This guide is written around exactly one ascension across roughly six months of near-continuous play. The default answer to "should I ascend?" is almost always **no, keep going**. Reset only when a run has truly plateaued and a fresh prestige total would dwarf the current one.

---

## Post-Ascension Rebuild

After reincarnating, the fastest restart for this build is:

1. Rush buildings.
2. Turn on Christmas immediately with the Season Switcher and rebuild Santa quickly.
3. Unlock the dragon (Krumblor) as soon as possible.
4. Keep the Golden Switch on while idling for the passive boost; turn it off only when actively combo-clicking golden cookies.

This is the single biggest improvement for someone who does not ascend often.

---

# Heavenly Chip Spending Priorities

> Note: because this build ascends so rarely, heavenly chip spending is a one-time housekeeping step, not an ongoing concern. The details below are a reference for the occasions you *do* ascend. Do not let them pull focus away from the real goal — going deep on the current run. If in doubt, buy the obvious permanent power and quality-of-life upgrades and get back to baking.

This strategy values:

1. permanent passive value
2. smoother rebuilds
3. stronger long-session throughput
4. lower maintenance
5. broad permanent production

It does **not** prioritize spreadsheet-perfect efficiency.

---

## Priority Order

The plan below reflects the actual first-ascension spend (roughly 6,678 Heavenly Chips available at about 7,280 prestige). Costs are shown in Heavenly Chips.

### 1. Core permanent power

Buy these first. They are the strongest early power spikes and improve every run:

- Legacy (1)
- Heavenly Cookies (3)
- How to Bake Your Dragon (9)
- Heavenly Luck (77)
- Heralds (100)
- Permanent Upgrade Slot I (100)

---

### 2. Quality-of-life and rebuild speed

For a rare ascender, these matter more than min-maxed prestige efficiency. They are the single biggest reason the next run feels dramatically faster:

- Season Switcher (1,111) — force Christmas / Valentine's / Easter on demand
- Golden Switch (999) — large passive boost while idling
- Starter Kit (50) — faster early rebuild
- Starter Kitchen (5,000) — even faster early rebuild

Starter Kitchen is expensive. It is fine to defer it to a later ascension if chips are tight.

---

### 3. Cheap permanent biscuits

Always buy the cheap biscuit line when available:

- Box of brand biscuits (25)
- Tin of british tea biscuits (25)
- Tin of butter cookies (25)
- Box of macarons (25)

These are excellent cleanup purchases: cheap, permanent, passive, and always useful.

---

### 4. Offline production line (low priority for this build)

Twin Gates of Transcendence and its two branches are cheap, so grab them, but understand what they actually do: they only affect production **while the game is closed**.

- Twin Gates of Transcendence (1)
- Angel branch — Angels (7), Archangels (49), Virtues (343), Dominions (2,401): raises the offline CpS *rate* (5% → 15% and up)
- Demon branch — Belphegor, Mammon, Abaddon, etc.: extends how *long* optimal offline production lasts (1hr → 2hr → …)

The angel and demon branches are **not mutually exclusive** — both stem from Twin Gates and you can own both. To see which you have, open the Legacy / ascension screen and look at the tree (owned nodes are lit; angels and demons sit on opposite sides of Twin Gates), or check Menu → Stats.

Because this build keeps the game running continuously under the autoclicker, the run is almost never "closed." These upgrades therefore do very little here. Buy the cheap ones for completeness, but do not treat them as a CpS priority.

---

### If chips are tight

The full list above runs roughly 10,351 HC, so a first-ascension budget (~6,678 HC) will not cover everything in one pass. Prioritize the quality-of-life upgrades (Season Switcher, Golden Switch, Starter Kit) and the cheap permanent power and multiplier lines first, then save toward Starter Kitchen (5,000) for the next ascension. Exact ordering does not matter much — none of it is worth agonizing over.

---

## Permanent Upgrade Slots

Permanent slots are best used to speed up the painful early rebuild, not to preserve something that is easy to reacquire later.

Current pick: **Santa's Dominion**. It is not the mathematically optimal slot, but it is a reasonable choice for a rare ascender — it removes most Christmas setup and makes reincarnation feel like resuming a run rather than restarting a checklist.

The conventional optimization is to slot the best available Kitten upgrade (or the most expensive flavor "cookie" upgrade) instead. This build intentionally favors run feel and low setup friction over that last bit of raw output, so Santa's Dominion stays — but the best Kitten upgrade is the natural replacement if priorities ever shift toward pure efficiency.

---

# What This Build Avoids

This build intentionally deprioritizes:

- constant ascensions
- active combo fishing
- micromanaged building ratios
- hyper-precise purchase timing
- spreadsheet optimization
- challenge mode during normal progression

This is a low-friction momentum build.

---

# Challenge Mode

Do not use challenge mode during normal progression runs.

Challenge mode is for:

- achievements
- novelty
- self-imposed restrictions

It is not useful for the main momentum run.

Normal reincarnation is the default.

---

# Advanced Notes From Actual Play

The recommendations above were refined through extended play after the first ascension. Several systems proved more valuable in practice than theory alone suggested.

## Ambient Automation vs. Idle Play

This strategy is often mistaken for an idle build.

It is not.

The build is designed around:

- continuous autoclicking
- long sessions
- passive accumulation
- occasional interaction
- frequent golden cookie clicks

The game is allowed to run unattended for long periods, but the player still interacts with key systems when convenient.

This is best described as **ambient automation** rather than traditional idle play.

---

## Wrinkler Philosophy

Wrinklers are treated as a savings account rather than a nuisance.

General guidance:

- allow wrinklers to accumulate naturally
- avoid popping them constantly
- harvest them when funding major purchases
- use them to smooth recovery from Krumblor sacrifices

For this playstyle:

- One Mind is desirable
- early Grandmapocalypse is desirable
- Elder Covenant is generally not recommended

Wrinklers are a core component of the economy.

---

## Pantheon Configuration

This build prioritizes a **set-and-forget** Pantheon: no spirit that punishes golden cookies, and nothing that needs to be swapped in and out during play.

| Slot | Spirit |
|--------|--------|
| Diamond | Muridal |
| Ruby | Cyclius |
| Jade | Jeremy |

### Muridal

Muridal performs exceptionally well because the autoclicker maintains constant click throughput. Its only downside is a small reduction to building output, with no effect on golden cookies.

### Cyclius

Cyclius is a purely passive CpS bonus that oscillates over time (up to +15%). It requires zero interaction, never needs swapping, and has no golden-cookie penalty — an ideal fit for a low-maintenance, always-running build.

### Jeremy

Jeremy provides reliable passive building production with no maintenance. Note its minor trade-off: a small reduction to golden/wrath cookie frequency (−3% in the Jade slot). This is mild, but if you want zero golden-cookie interference, Rigidel (faster sugar-lump ripening, no cookie penalty) is a penalty-free alternative for the Jade slot.

### A note on Skruuia

Skruuia is deliberately **not** used here. Its downside turns all golden cookies into wrath cookies with a higher chance of negative effects. The standard workaround is to slot it in for only a few seconds before popping wrinklers — but that constant swapping runs counter to this build's set-and-forget philosophy, so it is left out entirely.

---

## Milk Strategy

Milk selection is a minor optimization and not worth constant switching:

- AFK / unattended: Vanilla Milk
- Active or semi-active: Blueberry Milk
- Automatic is an acceptable default

This is not a kitten-focused, milk-min-maxing build. Pick a sensible milk and leave it.

---

## Krumblor Strategy

Dragon upgrades should be pursued aggressively once the sacrificed building is no longer a dominant portion of total production.

When the economy becomes diversified:

- sacrifices become easier to recover from
- wrinklers can fund recovery
- stored cookies can bridge temporary production losses

Do not be afraid to take dragon upgrades simply because the sacrifice appears large on paper.

---

## Stock Market

The Stock Market is a supporting system rather than a primary progression mechanic.

General philosophy:

- buy when prices are unusually low
- sell when prices are unusually high
- avoid excessive micromanagement

The bakery remains the primary source of progression.

The Stock Market exists to support the bakery, not the other way around.

---

## Upgrade Evaluation

As higher-tier buildings become dominant, building share percentages can become misleading.

A building contributing a smaller percentage of total CpS may still have highly valuable upgrades.

Evaluate purchases using:

- total CpS gained
- purchase cost
- recovery time
- opportunity cost

Do not evaluate upgrades solely on the current percentage contribution shown in building tooltips.

---

# Summary

This build is designed to make Cookie Clicker:

- fast to restart
- easy to maintain
- rewarding to idle
- productive in the background
- resilient to low attention
- strong over long sessions

The rule is simple:

> keep the machine running.

Buy upgrades when they appear. Buy buildings in waves. Click golden cookies when convenient. Ascend rarely. Let the run mature.

That is the whole system.

