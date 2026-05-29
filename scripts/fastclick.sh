#!/bin/bash
#
# Autoclicker for the big cookie (macOS), OS-level via cliclick.
#   brew install cliclick
#   Grant Accessibility permission: System Settings -> Privacy & Security
#   -> Accessibility (enable your terminal app), or clicks will silently fail.
#
# Clicks wherever the cursor currently sits (c:.), so park the pointer over
# the big cookie before starting. Stop with Ctrl-C.
#
# A single cliclick process tops out around ~50 CPS (its -w wait has a hard
# 20ms floor per command). That used to look like a limitation, but testing
# showed the game only CREDITS about one click per frame (~30 FPS), so click
# income caps around 30-60 CPS anyway. In other words, ~50 CPS is already
# essentially optimal -- there is nothing to gain from clicking faster, so this
# script intentionally stays as one simple loop.
#
# prefer scripts/console-autoclicker.js (or the Tampermonkey userscript): it is
# cursor-independent, so you can use the mouse normally while it runs.

# Build a small batch of clicks per cliclick launch to amortize spawn cost.
CLICKS=$(printf 'c:. %.0s' $(seq 20))

echo "Autoclicking cursor position at ~50 CPS (the useful ceiling). Ctrl-C to stop."

while true; do
  cliclick -w 20 $CLICKS
done
