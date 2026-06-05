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

Three options are provided:

- [`scripts/cookie-autoclicker.user.js`](scripts/cookie-autoclicker.user.js) — **recommended.** A [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) userscript that runs the same direct `Game.ClickCookie()` loop, but auto-starts on page load, persists across reloads, and is scoped to only the Cookie Clicker site. It also pops golden cookies (not wrath), harvests ripe sugar lumps (see below). It is the transparent, safe alternative to a black-box autoclicker extension: you can read exactly what it does. Start/stop from the Tampermonkey menu. Note: Chrome 138+ requires enabling the **"Allow User Scripts"** toggle (Tampermonkey icon → Manage Extension), or Developer Mode on older Chrome — see [Tampermonkey FAQ Q209](https://www.tampermonkey.net/faq.php?q=Q209#Q209).
- [`scripts/console-autoclicker.js`](scripts/console-autoclicker.js) — the same loop (plus the golden/lump helpers) as a one-off console paste (no install). Handy for a quick test; you re-paste it after each reload.
- [`scripts/fastclick.sh`](scripts/fastclick.sh) — OS-level clicker for macOS (`cliclick`). It clicks at the physical cursor position, so the pointer must sit on the big cookie. Tops out near ~50 CPS, which (see below) is essentially the useful ceiling anyway. It cannot pop golden cookies or sugar lumps on purpose — it has no idea where they are, and only ever caught them by luck when they drifted under the cursor. Treat it as the fallback.

Either keeps constant click pressure on the big cookie.

## Clicking Matters — But It Caps Around the Frame Rate

Clicking is a **large** income boost, not a side activity: in testing the autoclicker raised total earnings to roughly **13× the passive-only rate**. Late-game "mouse" upgrades make each click worth a meaningful share of your CpS, and clicking accounted for a big fraction of all cookies baked over a run. This is also why **Muridal** (+15% click power) earns its Diamond slot.

But there is a hard ceiling that is easy to miss: **the game only credits about one click per frame (~30 FPS).** So your effective click income maxes out at roughly **30–60 CPS**. Requesting 100, 1,000, or 100,000 CPS all earn the *same* — the extra calls are discarded, they just burn CPU and can flood the console with errors.

Measured example (one run): passive only ≈ 4.3e23/sec; at **60 CPS** ≈ 5.7e24/sec; at 1,000 and 100,000 CPS, the same ~5e24/sec. The boost is real and huge; the rate beyond ~60 does nothing.

Consequences:

- **Set the rate to ~60–100 CPS and stop.** That captures the entire click bonus. The scripts default to 100 (a little margin over the cap).
- Click income does **not** appear in the "cookies per second" stat (that stat is passive only). Judge the clicker by how fast your bank fills, not by the CpS number. To measure your own cap, the JS clickers have a `SHOW_METER` toggle plus this console one-liner: `(() => { const a = Game.cookiesEarned; setTimeout(() => console.log('earned/sec:', ((Game.cookiesEarned - a) / 5).toExponential(3)), 5000); })();`
- The **truly** huge click payoffs come from **Click Frenzy** golden-cookie buffs (which multiply click value ~777×) during active play — not from raw idle click rate.

Because the useful ceiling is ~60 CPS, `cliclick`'s ~50 CPS limit (a hard 20 ms floor per command) is a non-issue — no need to chase higher rates with it.

Background-tab note: browsers throttle timers in unfocused tabs to about once per second, and the game's own passive loop throttles in background tabs as well. Keep Cookie Clicker in the foreground, or use the Steam desktop version, which does not background-throttle.

## Golden Cookies and Sugar Lumps

An OS-level clicker like `cliclick` clicks a fixed *screen position*, so it only ever caught golden cookies or sugar lumps by accident — when one happened to spawn under the cursor. The userscript (and console script) target them deliberately instead, via two toggles that default on:

- **`AUTO_GOLDEN`** — pops golden cookies and reindeer the instant they appear. **Wrath cookies are skipped** (`shimmer.wrath === 1` — they still use type `"golden"` in the game code, so the red cookies during Grandmapocalypse are filtered by the flag, not the type string). They can trigger Ruin, Clot, and other downsides, and this build never wants those clicked unattended. When a normal golden cookie pops a **Click Frenzy**, the always-on clicker cashes the buff in automatically.
- **`AUTO_LUMP`** — harvests a sugar lump as soon as it is **ripe** (~23 hours), so none are ever missed over a long run. It deliberately never touches an unripe lump (calling the harvest early would pop a confirmation dialog), making it safe to leave running unattended.

Both run on a cheap once-per-second check that starts and stops with the clicker. Flip either constant to `false` to disable it. This is one more reason the userscript is the primary tool and `fastclick.sh` is only a fallback — the shell clicker can't do any of this.

### Keeping the machine awake (and why the screen stays on)

[`scripts/keepawake.sh`](scripts/keepawake.sh) runs `caffeinate -dimsu` to keep the system from sleeping during unattended runs. The `-d` flag (keep the **display** on) is load-bearing, not optional: letting the display sleep counts as the same kind of throttling described above. When the screen sleeps, macOS typically locks it, Chrome marks the tab `hidden`, and the autoclicker's timer drops to ~1 click/sec.

Measured directly: with the display allowed to sleep for ~90 sec, earnings fell to **~1.5e24/sec**, versus **~5.7e24/sec** with the screen on (and ~4.3e23 passive-only) — about a **75% loss**. So `-d` stays.

To save power without paying that penalty: **turn the brightness all the way down instead of sleeping the display.** The backlight is the bulk of the draw, so a near-black screen saves most of the energy while keeping the tab visible and full-speed.

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

# Minigames

Minigames are **support systems** for the bakery, not parallel progression tracks. This build treats them as set-and-forget where possible: check in occasionally, avoid constant swapping, and do not let side mechanics compete with upgrades and buildings.

The autoclicker harvests **ripe sugar lumps** automatically (~23 hours); Rigidel in the Pantheon speeds ripening further when your building count ends in 0.

---

## Sugar Lumps

Lumps are slow (~one per day before bonuses). Spend them deliberately; do not spread them across every building just because you can.

**Priority for this build**

1. **Temple (level 1, then occasional levels)** — unlocks the Pantheon, which is core to this setup (Muridal / Rigidel / Jeremy). Higher Temple levels strengthen spirit effects slightly.
2. **Farm (level 1, then levels when you care about the garden)** — unlocks the Garden; each level expands the plot and strengthens plant effects. Level 9 is a full 9×9 grid.
3. **Bank (level 1 when ready)** — unlocks the Stock Market for passive buy-low / sell-high check-ins.
4. **Wizard Tower (level 1, low priority)** — unlocks the Grimoire. Useful for active play; mostly optional for unattended runs (see Grimoire below).
5. **Other minigame buildings** (Shipment, Alchemy lab, etc.) — only when you actually use that minigame; not a priority for the ambient bakery loop.

**General rules**

- **Never harvest lumps early** — you lose a lump and reset the timer. The userscript only harvests once ripe.
- **Level 1 unlocks the minigame** — that is usually the best first lump on a building.
- **Higher levels are incremental** — nice, not urgent. Favor Temple and Farm over scattering +1 on everything.
- Lumps are **not** a substitute for heavenly chips or normal upgrades; they are long-horizon seasoning.

---

## Garden (Farm)

At early garden stages (only **Baker's Wheat** and **Meddleweed** unlocked), the garden barely moves total CpS. Treat it as a slow seed-unlock side project, not a main income source.

### Set-and-forget layout (recommended default)

- Fill the plot with **Baker's Wheat** (full grid).
- Keep **Fertilizer** soil selected — plants mature faster; fine when you are replanting often and not keeping rare mature plants alive.
- When you remember (every day or two), **Harvest all**, replant wheat.
- Use **Freeze** if you will be away for days and do not want plants dying mid-cycle.

Each mature Baker's Wheat gives a small CpS boost; the real long-term payoff is unlocking more seeds for better plants later (Queenbeet, etc.).

### Unlocking new seeds (active session only)

**Meddleweed spreads** and can **kill neighboring plants** — do not fill the farm with it unattended.

When you want mutations:

- Keep several **Baker's Wheat** plots.
- Plant **meddleweed on an edge or corner**, not across the whole grid.
- Let it spread a bit; mutations often appear when weeds die next to wheat (e.g. toward **Thumbcorn** and beyond).
- **Pebbles** soil helps seed drops while hunting unlocks; **Fertilizer** speeds up mutation cycles.

When you are not chasing seeds, skip meddleweed entirely.

### Soil quick reference

| Soil | Use when |
|------|----------|
| **Fertilizer** | Default for wheat grids and faster unlock attempts |
| **Clay** | Later, when valuable **mature** plants should stay alive a long time |
| **Pebbles** | Actively farming for **new seed** unlocks |
| **Dirt** | Neutral default if unsure |

---

## Pantheon (Temple)

This build prioritizes a **set-and-forget** Pantheon with a hard rule: **no spirit may carry a meaningful golden-cookie penalty**, and nothing should need swapping in and out during play. Golden cookies and chill play are valued above squeezing out maximum CpS.

| Slot | Spirit |
|--------|--------|
| Diamond | Muridal |
| Ruby | Rigidel |
| Jade | Jeremy |

This is a deliberately conservative setup that keeps golden cookies essentially untouched. It is not the highest-CpS Pantheon possible — the strongest passive boosters (Mokalsium, and Jeremy at full strength) reduce golden-cookie frequency enough to be noticeable, so they are kept out of the high-impact slots on purpose.

### Muridal (Diamond)

Muridal pairs with the always-on autoclicker: its click-power bonus is effectively active at all times, and it has no golden-cookie penalty. Its only downside is a small reduction to building output (−3% in the Diamond slot). Note that this building penalty *is* reflected in the displayed CpS, while the click-power upside is not (clicking feeds cookies-per-click, not the CpS stat).

### Rigidel (Ruby)

Rigidel is fully penalty-free: it speeds up sugar-lump ripening and does not touch CpS or golden cookies at all. In the Ruby slot the speedup is stronger (≈40 minutes sooner) than in Jade. The one quirk is that the effect is only active when your total building count ends in 0. It is placed in Ruby because none of the spirits that *do* boost CpS are allowed in the high-impact slots under this build's no-penalty rule — so the slot goes to a safe, useful utility instead.

### Jeremy (Jade)

Jeremy is the one real passive CpS gain in this lineup: **+3% building output** in the Jade slot, at the cost of a **small −3%** golden-cookie frequency. In the Jade slot the penalty is mild and generally not noticeable, which is why it is kept here and nowhere stronger.

Keep any golden-cookie penalty confined to the **Jade** slot, where it is smallest. Do **not** move Jeremy up to Ruby or Diamond — at −6% / −10% the reduction becomes noticeable, which is exactly what this build avoids. Mokalsium (−15% / −10% / −5%) is excluded entirely for the same reason.

### A note on Cyclius

Cyclius is **not** used in this build. It has no golden-cookie penalty, but its CpS bonus is a sine wave swinging between **+15% and −15%** tied to the UTC time of day (a 3 / 12 / 24-hour cycle for Diamond / Ruby / Jade). Over a full cycle it averages **0%** — it does not raise average CpS, it only makes the displayed number rise and fall. Worth knowing because that oscillation is the usual explanation for a sudden, unexplained CpS drop if you ever slot it. Live phase tracker: https://flothewiz.github.io/cyclius/.

### A note on Holobore

Holobore offers a tempting flat +15 / +10 / +5% base CpS with no time component — but its downside is disqualifying for this build: **clicking a single golden cookie unslots it and uses up all your worship swaps.** For a player who clicks golden cookies on sight, it would constantly self-eject. Excluded.

### A note on Skruuia

Skruuia is deliberately **not** used here. Its downside turns all golden cookies into wrath cookies with a higher chance of negative effects. The standard workaround is to slot it in for only a few seconds before popping wrinklers — but that constant swapping runs counter to this build's set-and-forget philosophy, so it is left out entirely.

---

## Grimoire (Wizard Tower)

The Grimoire is for **active** bursts, not the unattended loop.

- **Do not** leave **Force the Hand of Fate** or other click-dependent spells running unattended — backfires can spawn wrath cookies (same risks as Grandmapocalypse wrath cookies; the autoclicker deliberately skips those).
- Passive spells that boost production without interaction are fine when you are checking in, but they are not worth heavy lump investment in the Wizard Tower compared to Temple or Farm.
- Spend a lump on **Wizard Tower level 1** only when you actually want to experiment with spells; otherwise it can wait.

---

## Stock Market (Bank)

The Stock Market is a supporting system rather than a primary progression mechanic.

General philosophy:

- buy when prices are unusually low
- sell when prices are unusually high
- avoid excessive micromanagement

The bakery remains the primary source of progression.

The Stock Market exists to support the bakery, not the other way around.

---

# Advanced Notes From Actual Play

The recommendations above were refined through extended play after the first ascension. Several systems proved more valuable in practice than theory alone suggested. Minigame specifics (Garden, Pantheon, Grimoire, Stock Market, sugar lumps) live in **Minigames** above.

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

